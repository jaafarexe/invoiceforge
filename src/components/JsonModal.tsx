import React, { useState } from 'react';
import { InvoiceData } from '../types/invoice';
import { X, Download, Upload, Copy, Check, Code } from 'lucide-react';

interface JsonModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: InvoiceData;
  onImport: (importedData: InvoiceData) => void;
}

export const JsonModal: React.FC<JsonModalProps> = ({
  isOpen,
  onClose,
  data,
  onImport,
}) => {
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const [importJsonText, setImportJsonText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const jsonString = JSON.stringify(data, null, 2);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadFile = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${data.meta.invoiceNumber || 'invoice'}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          setImportJsonText(JSON.stringify(parsed, null, 2));
          setImportError(null);
        } catch {
          setImportError('Invalid JSON file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleExecuteImport = () => {
    try {
      const parsed = JSON.parse(importJsonText);
      if (!parsed.business || !parsed.client || !parsed.items || !parsed.meta) {
        setImportError('JSON is missing essential invoice fields (business, client, items, meta).');
        return;
      }
      onImport(parsed);
      onClose();
    } catch {
      setImportError('Invalid JSON syntax. Please check for syntax errors.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs no-print">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full border border-neutral-200 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-neutral-800" />
            <h2 className="text-sm font-bold text-neutral-900">Backup & Restore JSON</h2>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 p-1 rounded-md hover:bg-neutral-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-neutral-200 bg-neutral-50 px-4 pt-2 gap-2">
          <button
            onClick={() => setActiveTab('export')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-t border-b-2 transition-colors ${
              activeTab === 'export'
                ? 'bg-white text-neutral-900 border-neutral-900'
                : 'text-neutral-500 border-transparent hover:text-neutral-800'
            }`}
          >
            Export JSON
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-t border-b-2 transition-colors ${
              activeTab === 'import'
                ? 'bg-white text-neutral-900 border-neutral-900'
                : 'text-neutral-500 border-transparent hover:text-neutral-800'
            }`}
          >
            Import JSON
          </button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          {activeTab === 'export' ? (
            <div className="space-y-3">
              <p className="text-xs text-neutral-600">
                Download or copy the raw JSON data of your invoice. You can save this file as a backup or import it later.
              </p>
              <pre className="p-3 bg-neutral-100 rounded text-[11px] font-mono text-neutral-800 whitespace-pre-wrap leading-relaxed select-all border border-neutral-200 max-h-72 overflow-y-auto">
                {jsonString}
              </pre>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-neutral-600">
                Paste JSON data below or upload an exported invoice `.json` file to restore it.
              </p>

              <div>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileSelect}
                  className="text-xs text-neutral-600 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-neutral-900 file:text-white hover:file:bg-neutral-800 cursor-pointer"
                />
              </div>

              <textarea
                rows={10}
                value={importJsonText}
                onChange={(e) => {
                  setImportJsonText(e.target.value);
                  setImportError(null);
                }}
                placeholder="Paste JSON content here..."
                className="w-full text-[11px] font-mono p-3 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-neutral-50"
              />

              {importError && (
                <div className="p-2 text-xs text-rose-600 bg-rose-50 rounded border border-rose-200 font-medium">
                  {importError}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="px-6 py-3 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-800"
          >
            Cancel
          </button>

          {activeTab === 'export' ? (
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 text-xs font-semibold bg-white border border-neutral-300 rounded text-neutral-800 hover:bg-neutral-50 flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy JSON'}</span>
              </button>
              <button
                onClick={handleDownloadFile}
                className="px-4 py-1.5 text-xs font-semibold bg-neutral-900 text-white rounded hover:bg-neutral-800 transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .json</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleExecuteImport}
              disabled={!importJsonText.trim()}
              className="px-4 py-1.5 text-xs font-semibold bg-neutral-900 text-white rounded hover:bg-neutral-800 transition-colors disabled:opacity-50 flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import Invoice</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
