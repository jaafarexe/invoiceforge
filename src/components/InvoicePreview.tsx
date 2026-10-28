import React from 'react';
import { InvoiceData } from '../types/invoice';
import { calculateTotals, formatMoney, formatDateDisplay } from '../utils/currencies';
import { CheckCircle2, AlertCircle, Clock, FileText, Globe, Mail, Phone, MapPin } from 'lucide-react';

interface InvoicePreviewProps {
  data: InvoiceData;
  scale?: number;
}

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({ data, scale = 1 }) => {
  const { business, client, meta, items, financials, payment, theme } = data;
  const totals = calculateTotals(items, financials);
  const currency = theme.currency;

  // Accent color mapping
  const colorMap: Record<string, {
    primaryText: string;
    primaryBg: string;
    border: string;
    lightBg: string;
    badgeBg: string;
    badgeText: string;
  }> = {
    slate: {
      primaryText: 'text-slate-900',
      primaryBg: 'bg-slate-900 text-white',
      border: 'border-slate-900',
      lightBg: 'bg-slate-50',
      badgeBg: 'bg-slate-100',
      badgeText: 'text-slate-800',
    },
    indigo: {
      primaryText: 'text-indigo-900',
      primaryBg: 'bg-indigo-700 text-white',
      border: 'border-indigo-600',
      lightBg: 'bg-indigo-50/50',
      badgeBg: 'bg-indigo-50',
      badgeText: 'text-indigo-800',
    },
    emerald: {
      primaryText: 'text-emerald-950',
      primaryBg: 'bg-emerald-800 text-white',
      border: 'border-emerald-700',
      lightBg: 'bg-emerald-50/40',
      badgeBg: 'bg-emerald-50',
      badgeText: 'text-emerald-800',
    },
    blue: {
      primaryText: 'text-blue-950',
      primaryBg: 'bg-blue-800 text-white',
      border: 'border-blue-700',
      lightBg: 'bg-blue-50/50',
      badgeBg: 'bg-blue-50',
      badgeText: 'text-blue-800',
    },
    rose: {
      primaryText: 'text-rose-950',
      primaryBg: 'bg-rose-800 text-white',
      border: 'border-rose-700',
      lightBg: 'bg-rose-50/50',
      badgeBg: 'bg-rose-50',
      badgeText: 'text-rose-800',
    },
    amber: {
      primaryText: 'text-amber-950',
      primaryBg: 'bg-amber-800 text-white',
      border: 'border-amber-700',
      lightBg: 'bg-amber-50/50',
      badgeBg: 'bg-amber-50',
      badgeText: 'text-amber-800',
    },
  };

  const currentThemeColor = colorMap[theme.accentColor] || colorMap.slate;

  // Status badge details
  const renderStatusStamp = () => {
    if (!theme.showWatermark) return null;

    if (meta.status === 'paid') {
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded border-2 border-emerald-600 text-emerald-700 font-bold uppercase tracking-wider text-xs rotate-[-3deg] bg-emerald-50/80 print:rotate-[-3deg]">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>PAID IN FULL</span>
        </div>
      );
    }
    if (meta.status === 'overdue') {
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded border-2 border-rose-600 text-rose-700 font-bold uppercase tracking-wider text-xs rotate-[-3deg] bg-rose-50/80">
          <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
          <span>PAYMENT OVERDUE</span>
        </div>
      );
    }
    if (meta.status === 'pending') {
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded border border-amber-500 text-amber-700 font-medium uppercase tracking-wider text-xs bg-amber-50/60">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          <span>PENDING PAYMENT</span>
        </div>
      );
    }
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded border border-neutral-300 text-neutral-600 font-medium uppercase tracking-wider text-xs bg-neutral-50">
        <FileText className="w-3.5 h-3.5 text-neutral-500" />
        <span>DRAFT INVOICE</span>
      </div>
    );
  };

  const getTermsLabel = (term: string) => {
    switch (term) {
      case 'due_on_receipt': return 'Due on Receipt';
      case 'net_15': return 'Net 15 Days';
      case 'net_30': return 'Net 30 Days';
      case 'net_45': return 'Net 45 Days';
      case 'net_60': return 'Net 60 Days';
      case 'custom': return meta.customTermsText || 'Custom Terms';
      default: return 'Net 30 Days';
    }
  };

  return (
    <div
      id="invoice-printable-wrapper"
      className="w-full flex justify-center transition-transform origin-top print:transform-none"
      style={{ transform: scale !== 1 ? `scale(${scale})` : undefined }}
    >
      <div
        id="invoice-printable-area"
        className="w-full max-w-[820px] min-h-[1050px] bg-white text-slate-900 shadow-xl rounded-sm print:shadow-none print:rounded-none p-10 md:p-14 relative flex flex-col justify-between border border-neutral-200 print:border-none"
      >
        {/* TOP SECTION: Header / Branding / Meta */}
        <div>
          {/* TEMPLATE 1: MODERN MINIMALIST (Default) */}
          {theme.template === 'modern' && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-8 border-b border-neutral-200">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    {business.logoUrl ? (
                      <img
                        src={business.logoUrl}
                        alt={business.name}
                        className="h-12 w-auto max-w-[160px] object-contain rounded"
                      />
                    ) : (
                      <div className="h-11 w-11 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-bold tracking-tight text-sm shadow-sm">
                        {business.logoInitials || (business.name ? business.name.slice(0, 2).toUpperCase() : 'IF')}
                      </div>
                    )}
                    <div>
                      <h1 className="text-xl font-bold tracking-tight text-neutral-900 leading-tight">
                        {business.name || 'Your Company Name'}
                      </h1>
                      {business.website && (
                        <p className="text-xs text-neutral-500 font-normal">{business.website}</p>
                      )}
                    </div>
                  </div>

                  <div className="text-xs text-neutral-500 leading-relaxed max-w-xs">
                    {business.address && <div>{business.address}</div>}
                    {business.cityStateZip && <div>{business.cityStateZip}</div>}
                    {business.country && <div>{business.country}</div>}
                    {business.email && <div className="mt-1 text-neutral-600">{business.email}</div>}
                    {business.phone && <div>{business.phone}</div>}
                    {business.taxId && <div className="mt-1 font-mono text-[11px] text-neutral-400">TAX / VAT: {business.taxId}</div>}
                  </div>
                </div>

                <div className="sm:text-right space-y-2">
                  <div className="flex sm:justify-end items-center gap-2">
                    <span className="text-2xl md:text-3xl font-extrabold tracking-tight text-neutral-900 uppercase">
                      INVOICE
                    </span>
                  </div>
                  {renderStatusStamp()}

                  <div className="pt-2 text-xs text-neutral-600 space-y-1 font-mono">
                    <div className="flex sm:justify-end gap-3">
                      <span className="text-neutral-400 font-sans">Invoice No:</span>
                      <span className="font-semibold text-neutral-900">{meta.invoiceNumber || 'INV-0001'}</span>
                    </div>
                    {meta.poNumber && (
                      <div className="flex sm:justify-end gap-3">
                        <span className="text-neutral-400 font-sans">P.O. / Ref:</span>
                        <span className="font-medium text-neutral-800">{meta.poNumber}</span>
                      </div>
                    )}
                    <div className="flex sm:justify-end gap-3">
                      <span className="text-neutral-400 font-sans">Issue Date:</span>
                      <span className="text-neutral-800">{formatDateDisplay(meta.issueDate)}</span>
                    </div>
                    <div className="flex sm:justify-end gap-3">
                      <span className="text-neutral-400 font-sans">Due Date:</span>
                      <span className="font-semibold text-neutral-900">{formatDateDisplay(meta.dueDate)}</span>
                    </div>
                    <div className="flex sm:justify-end gap-3">
                      <span className="text-neutral-400 font-sans">Terms:</span>
                      <span className="text-neutral-700 font-sans">{getTermsLabel(meta.paymentTerms)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CLIENT BILLING INFO */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-8 border-b border-neutral-100">
                <div>
                  <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block mb-2 font-mono">
                    Billed To
                  </span>
                  <div className="text-sm font-bold text-neutral-900">
                    {client.company || client.name || 'Client Name / Company'}
                  </div>
                  {client.company && client.name && (
                    <div className="text-xs text-neutral-600 mt-0.5">Attn: {client.name}</div>
                  )}
                  <div className="text-xs text-neutral-500 leading-relaxed mt-2 space-y-0.5">
                    {client.address && <div>{client.address}</div>}
                    {client.cityStateZip && <div>{client.cityStateZip}</div>}
                    {client.country && <div>{client.country}</div>}
                    {client.email && <div className="text-neutral-700 mt-1">{client.email}</div>}
                    {client.phone && <div>{client.phone}</div>}
                    {client.taxId && <div className="text-[11px] font-mono text-neutral-400 mt-1">Tax ID: {client.taxId}</div>}
                  </div>
                </div>

                <div className="sm:text-right flex flex-col sm:items-end justify-end">
                  <div className="p-3.5 bg-neutral-50 border border-neutral-200/80 rounded-lg max-w-[240px] sm:w-full">
                    <span className="text-[11px] font-medium text-neutral-500 block uppercase tracking-wider font-mono">
                      Balance Due
                    </span>
                    <span className="text-2xl font-extrabold text-neutral-950 font-mono tabular-nums tracking-tight block mt-0.5">
                      {formatMoney(totals.balanceDue, currency)}
                    </span>
                    <span className="text-[11px] text-neutral-500 block mt-1">
                      Due by {formatDateDisplay(meta.dueDate)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TEMPLATE 2: CORPORATE CLASSIC */}
          {theme.template === 'corporate' && (
            <div>
              <div className="bg-neutral-900 text-white -mx-10 -mt-10 md:-mx-14 md:-mt-14 p-8 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  {business.logoUrl ? (
                    <img
                      src={business.logoUrl}
                      alt={business.name}
                      className="h-10 w-auto object-contain rounded bg-white p-1"
                    />
                  ) : (
                    <div className="h-10 w-10 bg-white text-neutral-950 font-bold rounded flex items-center justify-center text-sm">
                      {business.logoInitials || 'IF'}
                    </div>
                  )}
                  <div>
                    <h1 className="text-xl font-bold tracking-tight text-white">{business.name || 'Company Name'}</h1>
                    <p className="text-xs text-neutral-400">{business.email || business.website}</p>
                  </div>
                </div>
                <div className="text-right flex flex-col sm:items-end">
                  <span className="text-xs tracking-widest text-neutral-400 uppercase font-mono">Official Invoice</span>
                  <span className="text-2xl font-bold font-mono tracking-tight">{meta.invoiceNumber || 'INV-001'}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <div className="text-xs text-neutral-500">
                  {business.address} · {business.cityStateZip} · {business.country}
                  {business.taxId && <span className="ml-2 font-mono">Tax ID: {business.taxId}</span>}
                </div>
                {renderStatusStamp()}
              </div>

              <div className="grid grid-cols-2 gap-6 p-5 bg-neutral-50 border border-neutral-200 rounded-md mb-8">
                <div>
                  <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
                    Invoice To
                  </span>
                  <div className="font-bold text-neutral-900 text-sm">{client.company || client.name}</div>
                  {client.company && client.name && <div className="text-xs text-neutral-600">Attn: {client.name}</div>}
                  <div className="text-xs text-neutral-500 mt-1">
                    {client.address && <div>{client.address}</div>}
                    {client.cityStateZip && <div>{client.cityStateZip}</div>}
                    {client.email && <div>{client.email}</div>}
                  </div>
                </div>
                <div className="text-right text-xs space-y-1 font-mono">
                  <div className="flex justify-end gap-3">
                    <span className="text-neutral-500 font-sans">Issue Date:</span>
                    <span className="text-neutral-900 font-medium">{formatDateDisplay(meta.issueDate)}</span>
                  </div>
                  <div className="flex justify-end gap-3">
                    <span className="text-neutral-500 font-sans">Payment Due:</span>
                    <span className="text-neutral-900 font-bold">{formatDateDisplay(meta.dueDate)}</span>
                  </div>
                  {meta.poNumber && (
                    <div className="flex justify-end gap-3">
                      <span className="text-neutral-500 font-sans">PO Number:</span>
                      <span className="text-neutral-800">{meta.poNumber}</span>
                    </div>
                  )}
                  <div className="flex justify-end gap-3">
                    <span className="text-neutral-500 font-sans">Terms:</span>
                    <span className="text-neutral-700 font-sans">{getTermsLabel(meta.paymentTerms)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TEMPLATE 3: CLEAN EMERALD */}
          {theme.template === 'emerald' && (
            <div>
              <div className="flex justify-between items-start pb-6 mb-6 border-b-2 border-emerald-800">
                <div className="flex items-center gap-3">
                  {business.logoUrl ? (
                    <img src={business.logoUrl} alt={business.name} className="h-12 w-auto object-contain rounded" />
                  ) : (
                    <div className="h-11 w-11 rounded bg-emerald-800 text-white flex items-center justify-center font-bold text-sm">
                      {business.logoInitials || 'FC'}
                    </div>
                  )}
                  <div>
                    <h1 className="text-xl font-bold text-emerald-950">{business.name || 'Studio'}</h1>
                    <div className="text-xs text-neutral-500">{business.email} · {business.phone}</div>
                  </div>
                </div>
                <div className="text-right">
                  <h2 className="text-3xl font-black text-emerald-900 tracking-tight">INVOICE</h2>
                  <div className="text-xs font-mono text-emerald-700 font-semibold mt-1">#{meta.invoiceNumber}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8 text-xs">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider block">Billed Client</span>
                  <div className="text-sm font-bold text-neutral-900">{client.company || client.name}</div>
                  {client.name && client.company && <div className="text-neutral-600">Attn: {client.name}</div>}
                  <div className="text-neutral-500 leading-relaxed">
                    {client.address && <div>{client.address}</div>}
                    {client.cityStateZip && <div>{client.cityStateZip}</div>}
                    {client.email && <div>{client.email}</div>}
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between">
                  {renderStatusStamp()}
                  <div className="text-right space-y-1 font-mono text-neutral-700 mt-2">
                    <div><span className="text-neutral-400 font-sans mr-2">Issue Date:</span>{formatDateDisplay(meta.issueDate)}</div>
                    <div><span className="text-neutral-400 font-sans mr-2">Due Date:</span><span className="font-bold text-neutral-900">{formatDateDisplay(meta.dueDate)}</span></div>
                    {meta.poNumber && <div><span className="text-neutral-400 font-sans mr-2">Ref/PO:</span>{meta.poNumber}</div>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TEMPLATE 4: NORDIC MONOCHROME */}
          {theme.template === 'nordic' && (
            <div>
              <div className="flex justify-between items-baseline pb-4 mb-8 border-b-4 border-neutral-950">
                <div className="space-y-1">
                  <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 block">Statement Of Account</span>
                  <h1 className="text-2xl font-black tracking-tight text-neutral-950 uppercase">{business.name || 'Company'}</h1>
                </div>
                <div className="text-right font-mono">
                  <div className="text-xs uppercase text-neutral-400">Invoice Identifier</div>
                  <div className="text-xl font-bold text-neutral-950 tracking-tight">{meta.invoiceNumber || 'INV-001'}</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 mb-8 text-xs pb-6 border-b border-neutral-200">
                <div>
                  <span className="font-mono text-neutral-400 uppercase text-[10px] block mb-1">From</span>
                  <div className="font-semibold text-neutral-900">{business.name}</div>
                  <div className="text-neutral-500 leading-relaxed mt-1">
                    {business.address && <div>{business.address}</div>}
                    {business.cityStateZip && <div>{business.cityStateZip}</div>}
                    {business.email && <div>{business.email}</div>}
                  </div>
                </div>
                <div>
                  <span className="font-mono text-neutral-400 uppercase text-[10px] block mb-1">Recipient</span>
                  <div className="font-semibold text-neutral-900">{client.company || client.name}</div>
                  {client.company && client.name && <div className="text-neutral-600">{client.name}</div>}
                  <div className="text-neutral-500 leading-relaxed mt-1">
                    {client.address && <div>{client.address}</div>}
                    {client.cityStateZip && <div>{client.cityStateZip}</div>}
                    {client.email && <div>{client.email}</div>}
                  </div>
                </div>
                <div className="font-mono text-right space-y-1">
                  <div className="mb-2 flex justify-end">{renderStatusStamp()}</div>
                  <div><span className="text-neutral-400 font-sans mr-2 text-[11px]">Issued:</span>{formatDateDisplay(meta.issueDate)}</div>
                  <div><span className="text-neutral-400 font-sans mr-2 text-[11px]">Due:</span><strong className="text-neutral-900">{formatDateDisplay(meta.dueDate)}</strong></div>
                  <div><span className="text-neutral-400 font-sans mr-2 text-[11px]">Terms:</span>{getTermsLabel(meta.paymentTerms)}</div>
                </div>
              </div>
            </div>
          )}

          {/* TABLE OF ITEMS (Shared across layouts with refined typography) */}
          <div className="my-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-neutral-900 text-[11px] font-semibold text-neutral-600 uppercase tracking-wider font-mono">
                  <th className="py-2.5 pr-4 w-[50%]">Item Description</th>
                  <th className="py-2.5 px-3 text-center w-[15%]">Qty</th>
                  <th className="py-2.5 px-3 text-right w-[17%]">Unit Price</th>
                  <th className="py-2.5 pl-3 text-right w-[18%]">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-xs">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-neutral-400 italic font-mono text-xs">
                      No items added yet. Click &quot;Add Line Item&quot; in editor.
                    </td>
                  </tr>
                ) : (
                  items.map((item, idx) => {
                    const lineTotal = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
                    return (
                      <tr key={item.id || idx} className="avoid-break hover:bg-neutral-50/50">
                        <td className="py-3.5 pr-4 align-top">
                          <div className="font-medium text-neutral-900 leading-snug">
                            {item.description || 'Service or product description'}
                          </div>
                          {item.details && (
                            <div className="text-[11px] text-neutral-500 mt-1 leading-relaxed">
                              {item.details}
                            </div>
                          )}
                        </td>
                        <td className="py-3.5 px-3 text-center align-top font-mono text-neutral-700 tabular-nums">
                          {item.quantity}
                        </td>
                        <td className="py-3.5 px-3 text-right align-top font-mono text-neutral-700 tabular-nums">
                          {formatMoney(item.unitPrice, currency)}
                        </td>
                        <td className="py-3.5 pl-3 text-right align-top font-mono font-semibold text-neutral-900 tabular-nums">
                          {formatMoney(lineTotal, currency)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* TOTALS & SUMMARY SECTION */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-8 pt-4 pb-6 avoid-break">
            {/* Left: Notes & Banking Info */}
            <div className="w-full sm:w-[52%] space-y-4 text-xs">
              {payment.paymentInstructions && (
                <div className="p-3.5 bg-neutral-50/80 rounded border border-neutral-200/70 text-neutral-700">
                  <div className="font-semibold text-neutral-900 text-[11px] uppercase tracking-wider mb-1.5 flex items-center gap-1.5 font-mono">
                    Payment Instructions
                  </div>
                  <p className="text-[11px] leading-relaxed text-neutral-600 mb-2">
                    {payment.paymentInstructions}
                  </p>
                  {(payment.bankName || payment.accountNumber || payment.routingOrIban || payment.swiftBic) && (
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] font-mono text-neutral-600 pt-1.5 border-t border-neutral-200">
                      {payment.bankName && (
                        <div className="col-span-2">
                          <span className="text-neutral-400 font-sans">Bank:</span> {payment.bankName}
                        </div>
                      )}
                      {payment.accountName && (
                        <div className="col-span-2">
                          <span className="text-neutral-400 font-sans">Account Name:</span> {payment.accountName}
                        </div>
                      )}
                      {payment.accountNumber && (
                        <div>
                          <span className="text-neutral-400 font-sans">Account #:</span> {payment.accountNumber}
                        </div>
                      )}
                      {payment.routingOrIban && (
                        <div>
                          <span className="text-neutral-400 font-sans">Routing/IBAN:</span> {payment.routingOrIban}
                        </div>
                      )}
                      {payment.swiftBic && (
                        <div className="col-span-2">
                          <span className="text-neutral-400 font-sans">SWIFT/BIC:</span> {payment.swiftBic}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {payment.notes && (
                <div>
                  <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block mb-1 font-mono">
                    Special Notes
                  </span>
                  <p className="text-[11px] text-neutral-600 leading-relaxed italic">
                    &quot;{payment.notes}&quot;
                  </p>
                </div>
              )}
            </div>

            {/* Right: Detailed Math Breakout */}
            <div className="w-full sm:w-[42%] text-xs font-mono space-y-2">
              <div className="flex justify-between py-1 text-neutral-600">
                <span className="font-sans">Subtotal:</span>
                <span className="tabular-nums font-medium text-neutral-900">
                  {formatMoney(totals.subtotal, currency)}
                </span>
              </div>

              {totals.discountAmount > 0 && (
                <div className="flex justify-between py-1 text-emerald-700">
                  <span className="font-sans flex items-center gap-1">
                    Discount {financials.discountType === 'percentage' ? `(${financials.discountValue}%)` : ''}:
                  </span>
                  <span className="tabular-nums font-medium">
                    -{formatMoney(totals.discountAmount, currency)}
                  </span>
                </div>
              )}

              {totals.taxAmount > 0 && (
                <div className="flex justify-between py-1 text-neutral-600">
                  <span className="font-sans">
                    Tax / VAT ({financials.taxRate}%):
                  </span>
                  <span className="tabular-nums font-medium text-neutral-900">
                    +{formatMoney(totals.taxAmount, currency)}
                  </span>
                </div>
              )}

              {totals.shippingOrFee > 0 && (
                <div className="flex justify-between py-1 text-neutral-600">
                  <span className="font-sans">Shipping / Fee:</span>
                  <span className="tabular-nums font-medium text-neutral-900">
                    +{formatMoney(totals.shippingOrFee, currency)}
                  </span>
                </div>
              )}

              <div className="flex justify-between py-2 border-t-2 border-neutral-900 text-sm font-bold text-neutral-950">
                <span className="font-sans uppercase tracking-tight">Total:</span>
                <span className="tabular-nums">
                  {formatMoney(totals.grandTotal, currency)}
                </span>
              </div>

              {totals.amountPaid > 0 && (
                <div className="flex justify-between py-1 text-neutral-500 border-b border-neutral-100">
                  <span className="font-sans">Amount Paid / Retainer:</span>
                  <span className="tabular-nums">
                    -{formatMoney(totals.amountPaid, currency)}
                  </span>
                </div>
              )}

              <div className={`flex justify-between items-center p-3 rounded-md mt-2 ${currentThemeColor.primaryBg} avoid-break`}>
                <span className="font-sans font-bold uppercase tracking-wider text-xs">
                  Balance Due:
                </span>
                <span className="text-base font-extrabold tabular-nums font-mono">
                  {formatMoney(totals.balanceDue, currency)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: Terms & Footer */}
        <div className="pt-8 border-t border-neutral-200 text-[11px] text-neutral-400 space-y-2 avoid-break">
          {payment.termsAndConditions && (
            <div className="text-neutral-500 leading-relaxed">
              <span className="font-semibold text-neutral-700">Terms & Conditions: </span>
              {payment.termsAndConditions}
            </div>
          )}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 pt-2 text-[10px] text-neutral-400 font-mono">
            <div>
              Generated with InvoiceForge · {business.name || 'Business Invoice'}
            </div>
            <div>
              Questions? Email {business.email || 'billing support'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
