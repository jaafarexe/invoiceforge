import React, { useState, useEffect } from 'react';
import { InvoiceData } from '../types/invoice';
import { calculateTotals, formatMoney, formatDateDisplay } from '../utils/currencies';
import { X, Save, FolderOpen, Trash2, Copy, FileText, Check } from 'lucide-react';

interface SavedInvoicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentData: InvoiceData;
  onLoadInvoice: (data: InvoiceData) => void;
}

interface StoredInvoiceEntry {
  id: string;
  name: string;
  savedAt: number;
  data: InvoiceData;
}

const STORAGE_KEY = 'invoiceforge_saved_invoices_v1';

export const SavedInvoicesModal: React.FC<SavedInvoicesModalProps> = ({
  isOpen,
  onClose,
  currentData,
  onLoadInvoice,
}) => {
  const [savedList, setSavedList] = useState<StoredInvoiceEntry[]>([]);
  const [saveName, setSaveName] = useState('');
  const [justSaved, setJustSaved] = useState(false);

  // Load from localStorage
  useEffect(() => {
    if (isOpen) {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          setSavedList(JSON.parse(raw));
        } else {
          setSavedList([]);
        }
      } catch (err) {
        console.error('Failed to load saved invoices', err);
      }
      setSaveName(
        `${currentData.meta.invoiceNumber || 'INV'} - ${currentData.client.company || currentData.client.name || 'Client'}`
      );
    }
  }, [isOpen, currentData]);

  const handleSaveCurrent = (e: React.FormEvent) => {
    e.preventDefault();
    const entryName = saveName.trim() || `Invoice ${currentData.meta.invoiceNumber || 'Draft'}`;
    const newEntry: StoredInvoiceEntry = {
      id: `saved-${Date.now()}`,
      name: entryName,
      savedAt: Date.now(),
      data: { ...currentData, lastModified: Date.now() },
    };

    const updated = [newEntry, ...savedList.filter((item) => item.name !== entryName)];
    setSavedList(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save to localStorage', err);
    }

    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
  };

  const handleDelete = (id: string) => {
    const updated = savedList.filter((item) => item.id !== id);
    setSavedList(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectInvoice = (entry: StoredInvoiceEntry) => {
    onLoadInvoice(entry.data);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs no-print">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full border border-neutral-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-neutral-800" />
            <h2 className="text-sm font-bold text-neutral-900">Manage Saved Invoices</h2>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 p-1 rounded-md hover:bg-neutral-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Save Current Invoice Form */}
        <form onSubmit={handleSaveCurrent} className="p-4 bg-neutral-50 border-b border-neutral-200">
          <label className="text-[11px] font-semibold text-neutral-600 uppercase tracking-wider block mb-1">
            Save Current Invoice to Browser Storage
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              placeholder="e.g. INV-2026-084 Aether Dynamics"
              className="flex-1 text-xs px-3 py-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-white"
            />
            <button
              type="submit"
              className={`px-3 py-2 text-xs font-semibold rounded transition-colors flex items-center gap-1.5 shrink-0 ${
                justSaved
                  ? 'bg-emerald-600 text-white'
                  : 'bg-neutral-900 text-white hover:bg-neutral-800'
              }`}
            >
              {justSaved ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Copy</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* List of Saved Invoices */}
        <div className="p-4 overflow-y-auto flex-1 space-y-2">
          {savedList.length === 0 ? (
            <div className="p-8 text-center text-neutral-400 text-xs">
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="font-medium text-neutral-600">No saved invoices yet</p>
              <p className="text-neutral-400 mt-1">
                Save your current work above to quickly retrieve it later without losing progress.
              </p>
            </div>
          ) : (
            savedList.map((entry) => {
              const totals = calculateTotals(entry.data.items || [], entry.data.financials || { discountType: 'percentage', discountValue: 0, taxRate: 0, shippingOrFee: 0, amountPaid: 0 });
              return (
                <div
                  key={entry.id}
                  className="p-3 rounded border border-neutral-200 hover:border-neutral-300 bg-white flex items-center justify-between gap-3 group transition-colors"
                >
                  <div
                    onClick={() => handleSelectInvoice(entry)}
                    className="flex-1 cursor-pointer min-w-0"
                  >
                    <div className="text-xs font-bold text-neutral-900 truncate group-hover:text-neutral-950">
                      {entry.name}
                    </div>
                    <div className="text-[11px] text-neutral-500 font-mono flex items-center gap-2 mt-0.5">
                      <span>{entry.data.meta?.invoiceNumber || 'No ID'}</span>
                      <span>·</span>
                      <span className="font-semibold text-neutral-800">
                        {formatMoney(totals.balanceDue, entry.data.theme?.currency || { code: 'USD', symbol: '$', name: 'USD', position: 'prefix', decimalDigits: 2 })}
                      </span>
                      <span>·</span>
                      <span>{new Date(entry.savedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleSelectInvoice(entry)}
                      className="px-2.5 py-1 text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded transition-colors"
                    >
                      Load
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(entry.id)}
                      className="p-1.5 text-neutral-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
                      title="Delete saved invoice"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="px-6 py-3 bg-neutral-50 border-t border-neutral-200 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-neutral-700 hover:text-neutral-900 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
