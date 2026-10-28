/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { InvoiceData, TemplateId, InvoiceStatus } from './types/invoice';
import { SAMPLE_INVOICE, BLANK_INVOICE } from './data/sampleInvoice';
import { calculateTotals, formatMoney } from './utils/currencies';
import { InvoicePreview } from './components/InvoicePreview';
import { InvoiceEditor } from './components/InvoiceEditor';
import { TopNav } from './components/TopNav';
import { SavedInvoicesModal } from './components/SavedInvoicesModal';
import { ShareSummaryModal } from './components/ShareSummaryModal';
import { JsonModal } from './components/JsonModal';
import {
  Printer,
  ZoomIn,
  ZoomOut,
  Maximize2,
  FileCheck2,
  Sparkles,
  Eye,
  CheckCircle2,
  AlertCircle,
  Clock,
  FileText,
} from 'lucide-react';

const DRAFT_STORAGE_KEY = 'invoiceforge_current_draft_v1';

export default function App() {
  // State for active invoice
  const [invoice, setInvoice] = useState<InvoiceData>(() => {
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error reading draft from localStorage', e);
    }
    return SAMPLE_INVOICE;
  });

  // Preview scale / zoom
  const [previewScale, setPreviewScale] = useState<number>(0.92);

  // Responsive view on mobile/tablet ('split' on desktop, 'editor' or 'preview' on smaller screens)
  const [activeMobileView, setActiveMobileView] = useState<'editor' | 'preview'>('editor');

  // Modals state
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);

  // Save to localStorage whenever invoice changes
  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(invoice));
    } catch (err) {
      console.error('Failed to save draft to localStorage', err);
    }
  }, [invoice]);

  // Handle Print
  const handlePrint = useCallback(() => {
    // If mobile view is on editor, switch to preview or just let print stylesheet take over
    window.print();
  }, []);

  // Keyboard shortcut for Cmd/Ctrl+P
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
        e.preventDefault();
        handlePrint();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrint]);

  // Reset to Sample Invoice
  const handleResetSample = () => {
    if (window.confirm('Reset current invoice back to sample consulting invoice?')) {
      setInvoice({ ...SAMPLE_INVOICE, lastModified: Date.now() });
    }
  };

  // Clear All Fields
  const handleClearAll = () => {
    if (window.confirm('Start a new blank invoice? Any unsaved edits will be cleared.')) {
      setInvoice({
        ...BLANK_INVOICE,
        meta: {
          ...BLANK_INVOICE.meta,
          invoiceNumber: `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100)}`,
        },
        lastModified: Date.now(),
      });
    }
  };

  const totals = calculateTotals(invoice.items, invoice.financials);

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col font-sans text-neutral-900">
      {/* 1. Header (Follows Top Bar Contract) */}
      <TopNav
        onPrint={handlePrint}
        onNewInvoice={handleClearAll}
        onOpenSaved={() => setIsSavedModalOpen(true)}
        onOpenShare={() => setIsShareModalOpen(true)}
        onOpenJson={() => setIsJsonModalOpen(true)}
        onResetSample={handleResetSample}
        activeView={activeMobileView}
        onViewChange={setActiveMobileView}
      />

      {/* 2. Main Workspace Layout */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: INTERACTIVE EDITOR */}
          <div
            id="app-editor-panel"
            className={`lg:col-span-6 xl:col-span-5 h-auto no-print ${
              activeMobileView === 'preview' ? 'hidden lg:block' : 'block'
            }`}
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-neutral-700 uppercase tracking-wider font-mono">
                  Invoice Builder
                </span>
                <span className="text-neutral-300">·</span>
                <span className="text-xs text-neutral-500 font-mono">
                  {invoice.meta.invoiceNumber || 'INV-001'}
                </span>
              </div>
              <div className="text-xs text-neutral-500 font-mono">
                Total: <strong className="text-neutral-900 font-bold">{formatMoney(totals.balanceDue, invoice.theme.currency)}</strong>
              </div>
            </div>

            <InvoiceEditor
              data={invoice}
              onChange={setInvoice}
              onResetSample={handleResetSample}
              onClearAll={handleClearAll}
            />
          </div>

          {/* RIGHT COLUMN: LIVE CLEAN PRINTABLE INVOICE PREVIEW */}
          <div
            className={`lg:col-span-6 xl:col-span-7 flex flex-col items-center ${
              activeMobileView === 'editor' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            {/* Toolbar above preview */}
            <div
              id="preview-toolbar"
              className="w-full max-w-[820px] bg-white rounded-lg border border-neutral-200 px-4 py-2.5 mb-4 shadow-xs flex flex-wrap items-center justify-between gap-3 no-print"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700">
                  <Eye className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Live Preview</span>
                </div>

                <span className="text-neutral-300">|</span>

                {/* Quick Template Picker */}
                <div className="flex items-center gap-1">
                  {(['modern', 'corporate', 'emerald', 'nordic'] as TemplateId[]).map((tpl) => (
                    <button
                      key={tpl}
                      type="button"
                      onClick={() =>
                        setInvoice((prev) => ({
                          ...prev,
                          theme: { ...prev.theme, template: tpl },
                        }))
                      }
                      className={`px-2 py-0.5 text-[11px] font-medium rounded capitalize transition-colors ${
                        invoice.theme.template === tpl
                          ? 'bg-neutral-900 text-white font-semibold'
                          : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100'
                      }`}
                    >
                      {tpl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status and Zoom Controls */}
              <div className="flex items-center gap-3 text-xs">
                {/* Quick Status toggle */}
                <select
                  value={invoice.meta.status}
                  onChange={(e) =>
                    setInvoice((prev) => ({
                      ...prev,
                      meta: { ...prev.meta, status: e.target.value as InvoiceStatus },
                    }))
                  }
                  className="text-[11px] py-1 px-2 border border-neutral-300 rounded font-semibold text-neutral-700 bg-neutral-50 focus:outline-none"
                >
                  <option value="draft">Draft</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>

                <div className="flex items-center gap-1 bg-neutral-100 rounded p-0.5">
                  <button
                    type="button"
                    onClick={() => setPreviewScale((s) => Math.max(0.6, s - 0.1))}
                    title="Zoom Out"
                    className="p-1 text-neutral-600 hover:text-neutral-900 rounded hover:bg-white"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] font-mono font-medium px-1 text-neutral-700 w-11 text-center">
                    {Math.round(previewScale * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={() => setPreviewScale((s) => Math.min(1.2, s + 0.1))}
                    title="Zoom In"
                    className="p-1 text-neutral-600 hover:text-neutral-900 rounded hover:bg-white"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewScale(1)}
                    title="100% Scale"
                    className="p-1 text-neutral-600 hover:text-neutral-900 rounded hover:bg-white text-[10px] font-mono px-1.5"
                  >
                    1:1
                  </button>
                </div>
              </div>
            </div>

            {/* Printable Paper Canvas */}
            <div className="w-full flex justify-center overflow-x-auto pb-8">
              <InvoicePreview data={invoice} scale={previewScale} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer info (Clean, anti-slop, no fake version counters) */}
      <footer className="border-t border-neutral-200 bg-white py-4 px-6 text-center text-xs text-neutral-500 no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-800">InvoiceForge</span>
            <span>·</span>
            <span>Client-side secure invoice generator</span>
            <span>·</span>
            <span>Instant PDF export via browser print engine</span>
          </div>
          <div className="text-[11px] text-neutral-400 font-mono">
            Press <kbd className="px-1.5 py-0.5 bg-neutral-100 border border-neutral-300 rounded text-neutral-700 font-bold">⌘P</kbd> or <kbd className="px-1.5 py-0.5 bg-neutral-100 border border-neutral-300 rounded text-neutral-700 font-bold">Ctrl+P</kbd> to save PDF
          </div>
        </div>
      </footer>

      {/* Modals */}
      <SavedInvoicesModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        currentData={invoice}
        onLoadInvoice={(loaded) => setInvoice(loaded)}
      />

      <ShareSummaryModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        data={invoice}
      />

      <JsonModal
        isOpen={isJsonModalOpen}
        onClose={() => setIsJsonModalOpen(false)}
        data={invoice}
        onImport={(imported) => setInvoice(imported)}
      />
    </div>
  );
}
