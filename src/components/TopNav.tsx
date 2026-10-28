import React from 'react';
import { Printer, FileDown, FolderOpen, RefreshCw, PlusCircle, Share2, Code } from 'lucide-react';

interface TopNavProps {
  onPrint: () => void;
  onNewInvoice: () => void;
  onOpenSaved: () => void;
  onOpenShare: () => void;
  onOpenJson: () => void;
  onResetSample: () => void;
  activeView: 'editor' | 'preview';
  onViewChange: (view: 'editor' | 'preview') => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  onPrint,
  onNewInvoice,
  onOpenSaved,
  onOpenShare,
  onOpenJson,
  onResetSample,
  activeView,
  onViewChange,
}) => {
  return (
    <header
      id="app-header"
      className="bg-white border-b border-neutral-200 sticky top-0 z-30 no-print"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element Brand Zone */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            IF
          </div>
          <span className="text-lg font-bold tracking-tight text-neutral-900 whitespace-nowrap shrink-0">
            InvoiceForge
          </span>
        </div>

        {/* Zone 2: 4-5 clean single-line navigation / actions */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-neutral-600">
          <button
            type="button"
            onClick={onResetSample}
            className="hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sample Invoice</span>
          </button>

          <button
            type="button"
            onClick={onNewInvoice}
            className="hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Blank</span>
          </button>

          <button
            type="button"
            onClick={onOpenSaved}
            className="hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Saved Drafts</span>
          </button>

          <button
            type="button"
            onClick={onOpenShare}
            className="hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Summary</span>
          </button>

          <button
            type="button"
            onClick={onOpenJson}
            className="hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Code className="w-3.5 h-3.5" />
            <span>Backup / JSON</span>
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onPrint}
            className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 shadow-xs cursor-pointer active:scale-98"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Responsive View Switcher for Tablet & Mobile */}
      <div className="lg:hidden border-t border-neutral-100 bg-neutral-50 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-1 p-0.5 bg-neutral-200/70 rounded-md text-xs font-medium">
          <button
            type="button"
            onClick={() => onViewChange('editor')}
            className={`px-3 py-1 rounded transition-colors whitespace-nowrap ${
              activeView === 'editor'
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Edit Fields
          </button>
          <button
            type="button"
            onClick={() => onViewChange('preview')}
            className={`px-3 py-1 rounded transition-colors whitespace-nowrap ${
              activeView === 'preview'
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Live Preview
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={onOpenSaved}
            className="p-1.5 text-neutral-600 hover:text-neutral-900"
            title="Saved Invoices"
          >
            <FolderOpen className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onOpenShare}
            className="p-1.5 text-neutral-600 hover:text-neutral-900"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onResetSample}
            className="p-1.5 text-neutral-600 hover:text-neutral-900"
            title="Reset"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
