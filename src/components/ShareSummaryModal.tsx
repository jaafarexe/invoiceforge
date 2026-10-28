import React, { useState } from 'react';
import { InvoiceData } from '../types/invoice';
import { calculateTotals, formatMoney, formatDateDisplay } from '../utils/currencies';
import { X, Copy, Check, MessageSquare } from 'lucide-react';

interface ShareSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: InvoiceData;
}

export const ShareSummaryModal: React.FC<ShareSummaryModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const { business, client, meta, items, financials, payment, theme } = data;
  const totals = calculateTotals(items, financials);
  const currency = theme.currency;

  const summaryText = `*INVOICE SUMMARY: ${meta.invoiceNumber}*
From: ${business.name}
To: ${client.company || client.name}
Issue Date: ${formatDateDisplay(meta.issueDate)}
Due Date: ${formatDateDisplay(meta.dueDate)}

*LINE ITEMS:*
${items.map((item, idx) => `• ${item.description} (Qty: ${item.quantity} @ ${formatMoney(item.unitPrice, currency)}) = ${formatMoney(item.quantity * item.unitPrice, currency)}`).join('\n')}

*FINANCIALS:*
• Subtotal: ${formatMoney(totals.subtotal, currency)}
${totals.discountAmount > 0 ? `• Discount: -${formatMoney(totals.discountAmount, currency)}\n` : ''}${totals.taxAmount > 0 ? `• Tax (${financials.taxRate}%): +${formatMoney(totals.taxAmount, currency)}\n` : ''}• Grand Total: ${formatMoney(totals.grandTotal, currency)}
${totals.amountPaid > 0 ? `• Paid / Retainer: -${formatMoney(totals.amountPaid, currency)}\n` : ''}*BALANCE DUE: ${formatMoney(totals.balanceDue, currency)}*

${payment.paymentInstructions ? `*PAYMENT INSTRUCTIONS:*\n${payment.paymentInstructions}\n` : ''}${payment.bankName ? `Bank: ${payment.bankName} | Account: ${payment.accountNumber} | Routing: ${payment.routingOrIban}\n` : ''}
Questions or settlement confirmation: ${business.email}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs no-print">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full border border-neutral-200 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-neutral-800" />
            <h2 className="text-sm font-bold text-neutral-900">Copy Invoice Summary</h2>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 p-1 rounded-md hover:bg-neutral-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 bg-neutral-50 border-b border-neutral-200">
          <p className="text-xs text-neutral-600">
            Copy this formatted text summary to quickly send an invoice overview to your client via Slack, email, or messaging.
          </p>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          <pre className="p-3 bg-neutral-100 rounded text-[11px] font-mono text-neutral-800 whitespace-pre-wrap leading-relaxed select-all border border-neutral-200 max-h-72 overflow-y-auto">
            {summaryText}
          </pre>
        </div>

        <div className="px-6 py-3 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between">
          <span className="text-[11px] text-neutral-500 font-mono">
            {copied ? 'Copied to clipboard!' : 'Ready to copy'}
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-800"
            >
              Close
            </button>
            <button
              onClick={handleCopy}
              className="px-4 py-1.5 text-xs font-semibold bg-neutral-900 text-white rounded hover:bg-neutral-800 transition-colors flex items-center gap-1.5 shadow-xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Summary</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
