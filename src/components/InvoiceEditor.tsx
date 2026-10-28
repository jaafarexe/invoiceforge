import React, { useState } from 'react';
import {
  InvoiceData,
  InvoiceItem,
  PaymentTermsType,
  InvoiceStatus,
  TemplateId,
  AccentColor,
} from '../types/invoice';
import { SUPPORTED_CURRENCIES, calculateTotals, formatMoney } from '../utils/currencies';
import {
  Plus,
  Trash2,
  Copy,
  Building2,
  User,
  Calendar,
  DollarSign,
  Palette,
  CreditCard,
  FileCheck,
  Upload,
  Sparkles,
  Info,
} from 'lucide-react';

interface InvoiceEditorProps {
  data: InvoiceData;
  onChange: (updated: InvoiceData) => void;
  onResetSample: () => void;
  onClearAll: () => void;
}

export const InvoiceEditor: React.FC<InvoiceEditorProps> = ({
  data,
  onChange,
  onResetSample,
  onClearAll,
}) => {
  const [activeTab, setActiveTab] = useState<'items' | 'parties' | 'meta' | 'financials' | 'payment' | 'design'>('items');

  const { business, client, meta, items, financials, payment, theme } = data;
  const totals = calculateTotals(items, financials);

  // Helper updates
  const updateBusiness = (fields: Partial<typeof business>) => {
    onChange({ ...data, business: { ...business, ...fields } });
  };

  const updateClient = (fields: Partial<typeof client>) => {
    onChange({ ...data, client: { ...client, ...fields } });
  };

  const updateMeta = (fields: Partial<typeof meta>) => {
    onChange({ ...data, meta: { ...meta, ...fields } });
  };

  const updateFinancials = (fields: Partial<typeof financials>) => {
    onChange({ ...data, financials: { ...financials, ...fields } });
  };

  const updatePayment = (fields: Partial<typeof payment>) => {
    onChange({ ...data, payment: { ...payment, ...fields } });
  };

  const updateTheme = (fields: Partial<typeof theme>) => {
    onChange({ ...data, theme: { ...theme, ...fields } });
  };

  // Item management
  const handleAddItem = (preset?: Partial<InvoiceItem>) => {
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      description: preset?.description || 'Consulting & Professional Services',
      details: preset?.details || '',
      quantity: preset?.quantity ?? 1,
      unitPrice: preset?.unitPrice ?? 100,
    };
    onChange({ ...data, items: [...items, newItem] });
  };

  const handleUpdateItem = (id: string, fields: Partial<InvoiceItem>) => {
    const updated = items.map((item) => (item.id === id ? { ...item, ...fields } : item));
    onChange({ ...data, items: updated });
  };

  const handleDuplicateItem = (itemToCopy: InvoiceItem) => {
    const newItem: InvoiceItem = {
      ...itemToCopy,
      id: `item-${Date.now()}`,
      description: `${itemToCopy.description} (Copy)`,
    };
    onChange({ ...data, items: [...items, newItem] });
  };

  const handleRemoveItem = (id: string) => {
    onChange({ ...data, items: items.filter((item) => item.id !== id) });
  };

  // Logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Please choose an image under 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        updateBusiness({ logoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-neutral-200 shadow-sm flex flex-col h-full overflow-hidden">
      {/* Editor Section Navigation */}
      <div className="border-b border-neutral-200 bg-neutral-50 px-3 pt-3 flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('items')}
            className={`px-3 py-2 text-xs font-semibold rounded-t-md transition-colors flex items-center gap-1.5 whitespace-nowrap border-b-2 ${
              activeTab === 'items'
                ? 'bg-white text-neutral-900 border-neutral-900 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-800 border-transparent hover:bg-neutral-100'
            }`}
          >
            <span>Items & Services</span>
            <span className="px-1.5 py-0.2 rounded-full bg-neutral-200 text-neutral-800 text-[10px] font-mono">
              {items.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('parties')}
            className={`px-3 py-2 text-xs font-semibold rounded-t-md transition-colors flex items-center gap-1.5 whitespace-nowrap border-b-2 ${
              activeTab === 'parties'
                ? 'bg-white text-neutral-900 border-neutral-900 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-800 border-transparent hover:bg-neutral-100'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Business & Client</span>
          </button>

          <button
            onClick={() => setActiveTab('meta')}
            className={`px-3 py-2 text-xs font-semibold rounded-t-md transition-colors flex items-center gap-1.5 whitespace-nowrap border-b-2 ${
              activeTab === 'meta'
                ? 'bg-white text-neutral-900 border-neutral-900 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-800 border-transparent hover:bg-neutral-100'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Invoice Details</span>
          </button>

          <button
            onClick={() => setActiveTab('financials')}
            className={`px-3 py-2 text-xs font-semibold rounded-t-md transition-colors flex items-center gap-1.5 whitespace-nowrap border-b-2 ${
              activeTab === 'financials'
                ? 'bg-white text-neutral-900 border-neutral-900 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-800 border-transparent hover:bg-neutral-100'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Taxes & Discounts</span>
          </button>

          <button
            onClick={() => setActiveTab('payment')}
            className={`px-3 py-2 text-xs font-semibold rounded-t-md transition-colors flex items-center gap-1.5 whitespace-nowrap border-b-2 ${
              activeTab === 'payment'
                ? 'bg-white text-neutral-900 border-neutral-900 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-800 border-transparent hover:bg-neutral-100'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Payment & Bank</span>
          </button>

          <button
            onClick={() => setActiveTab('design')}
            className={`px-3 py-2 text-xs font-semibold rounded-t-md transition-colors flex items-center gap-1.5 whitespace-nowrap border-b-2 ${
              activeTab === 'design'
                ? 'bg-white text-neutral-900 border-neutral-900 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-800 border-transparent hover:bg-neutral-100'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Theme & Style</span>
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="p-5 md:p-6 overflow-y-auto flex-1 space-y-6">
        {/* TAB 1: LINE ITEMS */}
        {activeTab === 'items' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <div>
                <h3 className="text-sm font-bold text-neutral-900">Line Items & Services</h3>
                <p className="text-xs text-neutral-500">
                  Itemize consulting, products, hours, or deliverables with automated line totals.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleAddItem()}
                  className="px-3 py-1.5 text-xs font-semibold bg-neutral-900 text-white rounded-md hover:bg-neutral-800 transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Line Item</span>
                </button>
              </div>
            </div>

            {/* Quick item presets */}
            <div className="flex items-center gap-2 text-xs text-neutral-500 overflow-x-auto pb-1">
              <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider shrink-0 font-mono">
                Quick Presets:
              </span>
              <button
                type="button"
                onClick={() =>
                  handleAddItem({
                    description: 'Full-Stack Development Sprint',
                    details: 'Implementation, unit tests, code review, and deployment verification.',
                    quantity: 40,
                    unitPrice: 150,
                  })
                }
                className="px-2.5 py-1 text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded transition-colors whitespace-nowrap"
              >
                + Hourly Sprint (40h)
              </button>
              <button
                type="button"
                onClick={() =>
                  handleAddItem({
                    description: 'UI/UX Interface Design Deliverable',
                    details: 'Responsive design tokens, wireframes, and interactive prototype.',
                    quantity: 1,
                    unitPrice: 2500,
                  })
                }
                className="px-2.5 py-1 text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded transition-colors whitespace-nowrap"
              >
                + Fixed Milestone ($2,500)
              </button>
              <button
                type="button"
                onClick={() =>
                  handleAddItem({
                    description: 'Monthly Maintenance & Advisory Retainer',
                    details: 'Infrastructure monitoring, security updates, and priority technical support.',
                    quantity: 1,
                    unitPrice: 1200,
                  })
                }
                className="px-2.5 py-1 text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded transition-colors whitespace-nowrap"
              >
                + Monthly Retainer ($1,200)
              </button>
            </div>

            {/* Items List */}
            {items.length === 0 ? (
              <div className="p-8 border-2 border-dashed border-neutral-200 rounded-lg text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-neutral-100 text-neutral-400 mx-auto flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <div className="text-sm font-medium text-neutral-700">No invoice items yet</div>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  Add line items describing your work or products to calculate totals.
                </p>
                <button
                  type="button"
                  onClick={() => handleAddItem()}
                  className="px-4 py-2 text-xs font-semibold bg-neutral-900 text-white rounded-md hover:bg-neutral-800"
                >
                  Add First Item
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item, index) => {
                  const lineTotal = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
                  return (
                    <div
                      key={item.id}
                      className="p-4 rounded-lg border border-neutral-200 hover:border-neutral-300 bg-neutral-50/40 transition-colors space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-neutral-500 font-mono">
                          #{index + 1}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleDuplicateItem(item)}
                            title="Duplicate item"
                            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded hover:bg-neutral-200 transition-colors"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            title="Remove item"
                            className="p-1.5 text-neutral-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                        {/* Description */}
                        <div className="md:col-span-6 space-y-1">
                          <label className="text-[11px] font-semibold text-neutral-600 uppercase tracking-wider block">
                            Item Title
                          </label>
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => handleUpdateItem(item.id, { description: e.target.value })}
                            placeholder="e.g. Frontend Development, Consultation, Hardware Unit..."
                            className="w-full text-xs px-3 py-2 rounded border border-neutral-300 bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 font-medium"
                          />
                        </div>

                        {/* Quantity */}
                        <div className="md:col-span-2 space-y-1">
                          <label className="text-[11px] font-semibold text-neutral-600 uppercase tracking-wider block">
                            Qty / Hours
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="any"
                            value={item.quantity}
                            onChange={(e) =>
                              handleUpdateItem(item.id, { quantity: parseFloat(e.target.value) || 0 })
                            }
                            className="w-full text-xs px-3 py-2 rounded border border-neutral-300 bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono text-center"
                          />
                        </div>

                        {/* Unit Price */}
                        <div className="md:col-span-2 space-y-1">
                          <label className="text-[11px] font-semibold text-neutral-600 uppercase tracking-wider block">
                            Rate ({theme.currency.symbol})
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="any"
                            value={item.unitPrice}
                            onChange={(e) =>
                              handleUpdateItem(item.id, { unitPrice: parseFloat(e.target.value) || 0 })
                            }
                            className="w-full text-xs px-3 py-2 rounded border border-neutral-300 bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono text-right"
                          />
                        </div>

                        {/* Line Total */}
                        <div className="md:col-span-2 space-y-1">
                          <label className="text-[11px] font-semibold text-neutral-600 uppercase tracking-wider block text-right">
                            Total
                          </label>
                          <div className="text-xs px-3 py-2 bg-neutral-100 rounded border border-neutral-200 font-mono font-bold text-neutral-900 text-right tabular-nums">
                            {formatMoney(lineTotal, theme.currency)}
                          </div>
                        </div>
                      </div>

                      {/* Optional Sub-details */}
                      <div className="space-y-1 pt-1">
                        <label className="text-[10px] font-medium text-neutral-500 uppercase tracking-wider block font-mono">
                          Deliverable Sub-details / Specifications (Optional)
                        </label>
                        <textarea
                          rows={2}
                          value={item.details || ''}
                          onChange={(e) => handleUpdateItem(item.id, { details: e.target.value })}
                          placeholder="Provide details on deliverables, milestone breakdown, or project scope..."
                          className="w-full text-xs px-3 py-1.5 rounded border border-neutral-200 bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900 placeholder:text-neutral-400"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Quick Math Snapshot */}
            <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="text-xs text-neutral-500">
                <span>{items.length} total line item{items.length === 1 ? '' : 's'}</span>
                <span className="mx-2">·</span>
                <span>Subtotal: <strong className="text-neutral-900 font-mono tabular-nums">{formatMoney(totals.subtotal, theme.currency)}</strong></span>
              </div>
              <div className="text-xs font-mono">
                <span className="text-neutral-500 font-sans mr-2">Grand Total:</span>
                <span className="font-extrabold text-neutral-950 text-sm tabular-nums">
                  {formatMoney(totals.grandTotal, theme.currency)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BUSINESS & CLIENT */}
        {activeTab === 'parties' && (
          <div className="space-y-8">
            {/* BUSINESS INFO */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-neutral-700" />
                  <h3 className="text-sm font-bold text-neutral-900">Your Business Details (From)</h3>
                </div>
                <label className="text-xs font-medium text-neutral-700 cursor-pointer hover:text-neutral-950 flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Logo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {business.logoUrl && (
                <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded border border-neutral-200">
                  <img
                    src={business.logoUrl}
                    alt="Business Logo"
                    className="h-10 w-auto object-contain rounded bg-white p-1 border border-neutral-200"
                  />
                  <div className="text-xs text-neutral-600 flex-1">
                    Custom business logo uploaded
                  </div>
                  <button
                    type="button"
                    onClick={() => updateBusiness({ logoUrl: undefined })}
                    className="text-xs text-rose-600 hover:text-rose-800 font-medium"
                  >
                    Remove Logo
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-neutral-600 uppercase tracking-wider block">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    value={business.name}
                    onChange={(e) => updateBusiness({ name: e.target.value })}
                    placeholder="e.g. Acme Studio LLC"
                    className="w-full text-xs px-3 py-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-900 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-neutral-600 uppercase tracking-wider block">
                    Logo Initials / Monogram
                  </label>
                  <input
                    type="text"
                    maxLength={3}
                    value={business.logoInitials || ''}
                    onChange={(e) => updateBusiness({ logoInitials: e.target.value.toUpperCase() })}
                    placeholder="e.g. FC"
                    className="w-full text-xs px-3 py-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono uppercase"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-neutral-600 uppercase tracking-wider block">
                    Billing Email *
                  </label>
                  <input
                    type="email"
                    value={business.email}
                    onChange={(e) => updateBusiness({ email: e.target.value })}
                    placeholder="billing@yourcompany.com"
                    className="w-full text-xs px-3 py-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-neutral-600 uppercase tracking-wider block">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={business.phone}
                    onChange={(e) => updateBusiness({ phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full text-xs px-3 py-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11px] font-semibold text-neutral-600 uppercase tracking-wider block">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={business.address}
                    onChange={(e) => updateBusiness({ address: e.target.value })}
                    placeholder="123 Innovation Way, Suite 400"
                    className="w-full text-xs px-3 py-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-neutral-600 uppercase tracking-wider block">
                    City, State, Zip
                  </label>
                  <input
                    type="text"
                    value={business.cityStateZip}
                    onChange={(e) => updateBusiness({ cityStateZip: e.target.value })}
                    placeholder="San Francisco, CA 94105"
                    className="w-full text-xs px-3 py-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-neutral-600 uppercase tracking-wider block">
                    Country
                  </label>
                  <input
                    type="text"
                    value={business.country}
                    onChange={(e) => updateBusiness({ country: e.target.value })}
                    placeholder="United States"
                    className="w-full text-xs px-3 py-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-neutral-600 uppercase tracking-wider block">
                    Tax / VAT / EIN Number
                  </label>
                  <input
                    type="text"
                    value={business.taxId || ''}
                    onChange={(e) => updateBusiness({ taxId: e.target.value })}
                    placeholder="e.g. US-84-2918402 / VAT-GB12345"
                    className="w-full text-xs px-3 py-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-neutral-600 uppercase tracking-wider block">
                    Website URL
                  </label>
                  <input
                    type="text"
                    value={business.website || ''}
                    onChange={(e) => updateBusiness({ website: e.target.value })}
                    placeholder="https://yourcompany.com"
                    className="w-full text-xs px-3 py-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
              </div>
            </div>

            {/* CLIENT INFO */}
            <div className="space-y-4 pt-4 border-t border-neutral-200">
              <div className="flex items-center gap-2 pb-2 border-b border-neutral-200">
                <User className="w-4 h-4 text-neutral-700" />
                <h3 className="text-sm font-bold text-neutral-900">Client Details (Billed To)</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-neutral-600 uppercase tracking-wider block">
                    Client Company Name *
                  </label>
                  <input
                    type="text"
                    value={client.company}
                    onChange={(e) => updateClient({ company: e.target.value })}
                    placeholder="e.g. Aether Dynamics Inc."
                    className="w-full text-xs px-3 py-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-900 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-neutral-600 uppercase tracking-wider block">
                    Contact Person Name
                  </label>
                  <input
                    type="text"
                    value={client.name}
                    onChange={(e) => updateClient({ name: e.target.value })}
                    placeholder="e.g. Sophia Chen"
                    className="w-full text-xs px-3 py-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-neutral-600 uppercase tracking-wider block">
                    Client Email
                  </label>
                  <input
                    type="email"
                    value={client.email}
                    onChange={(e) => updateClient({ email: e.target.value })}
                    placeholder="billing@client.com"
                    className="w-full text-xs px-3 py-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-neutral-600 uppercase tracking-wider block">
                    Client Phone
                  </label>
                  <input
                    type="text"
                    value={client.phone}
                    onChange={(e) => updateClient({ phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                    className="w-full text-xs px-3 py-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11px] font-semibold text-neutral-600 uppercase tracking-wider block">
                    Client Billing Address
                  </label>
                  <input
                    type="text"
                    value={client.address}
                    onChange={(e) => updateClient({ address: e.target.value })}
                    placeholder="742 Evergreen Point Road, Fl 4"
                    className="w-full text-xs px-3 py-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-neutral-600 uppercase tracking-wider block">
                    City, State, Zip
                  </label>
                  <input
                    type="text"
                    value={client.cityStateZip}
                    onChange={(e) => updateClient({ cityStateZip: e.target.value })}
                    placeholder="Seattle, WA 98101"
                    className="w-full text-xs px-3 py-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-neutral-600 uppercase tracking-wider block">
                    Country
                  </label>
                  <input
                    type="text"
                    value={client.country}
                    onChange={(e) => updateClient({ country: e.target.value })}
                    placeholder="United States"
                    className="w-full text-xs px-3 py-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-neutral-600 uppercase tracking-wider block">
                    Client Tax / VAT ID
                  </label>
                  <input
                    type="text"
                    value={client.taxId || ''}
                    onChange={(e) => updateClient({ taxId: e.target.value })}
                    placeholder="e.g. US-91-7294018"
                    className="w-full text-xs px-3 py-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: INVOICE META & DATES */}
        {activeTab === 'meta' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-neutral-900">Invoice Numbers & Timeline</h3>
              <p className="text-xs text-neutral-500">
                Set invoice numbering, client PO references, timeline, and invoice status.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-neutral-600 uppercase tracking-wider block">
                  Invoice Number *
                </label>
                <input
                  type="text"
                  value={meta.invoiceNumber}
                  onChange={(e) => updateMeta({ invoiceNumber: e.target.value })}
                  placeholder="INV-2026-001"
                  className="w-full text-xs px-3 py-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-neutral-600 uppercase tracking-wider block">
                  Purchase Order / Reference #
                </label>
                <input
                  type="text"
                  value={meta.poNumber || ''}
                  onChange={(e) => updateMeta({ poNumber: e.target.value })}
                  placeholder="e.g. PO-7821-AD"
                  className="w-full text-xs px-3 py-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-neutral-600 uppercase tracking-wider block">
                  Issue Date *
                </label>
                <input
                  type="date"
                  value={meta.issueDate}
                  onChange={(e) => updateMeta({ issueDate: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-neutral-600 uppercase tracking-wider block">
                  Due Date *
                </label>
                <input
                  type="date"
                  value={meta.dueDate}
                  onChange={(e) => updateMeta({ dueDate: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-neutral-600 uppercase tracking-wider block">
                  Payment Terms
                </label>
                <select
                  value={meta.paymentTerms}
                  onChange={(e) => updateMeta({ paymentTerms: e.target.value as PaymentTermsType })}
                  className="w-full text-xs px-3 py-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-white"
                >
                  <option value="due_on_receipt">Due on Receipt</option>
                  <option value="net_15">Net 15 Days</option>
                  <option value="net_30">Net 30 Days</option>
                  <option value="net_45">Net 45 Days</option>
                  <option value="net_60">Net 60 Days</option>
                  <option value="custom">Custom Terms</option>
                </select>
              </div>

              {meta.paymentTerms === 'custom' && (
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-neutral-600 uppercase tracking-wider block">
                    Custom Terms Text
                  </label>
                  <input
                    type="text"
                    value={meta.customTermsText || ''}
                    onChange={(e) => updateMeta({ customTermsText: e.target.value })}
                    placeholder="e.g. 50% deposit, 50% upon delivery"
                    className="w-full text-xs px-3 py-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
              )}

              <div className="space-y-1 sm:col-span-2">
                <label className="text-[11px] font-semibold text-neutral-600 uppercase tracking-wider block">
                  Invoice Status Badge
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['draft', 'pending', 'paid', 'overdue'] as InvoiceStatus[]).map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => updateMeta({ status })}
                      className={`px-3 py-2 text-xs font-semibold rounded border transition-colors capitalize flex items-center justify-center gap-1.5 ${
                        meta.status === status
                          ? status === 'paid'
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : status === 'overdue'
                            ? 'bg-rose-600 text-white border-rose-600'
                            : status === 'pending'
                            ? 'bg-amber-600 text-white border-amber-600'
                            : 'bg-neutral-900 text-white border-neutral-900'
                          : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: FINANCIALS (Taxes, Discounts, Shipping) */}
        {activeTab === 'financials' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-neutral-900">Discounts, Taxes & Deposits</h3>
              <p className="text-xs text-neutral-500">
                Configure percentage or fixed discount, regional tax/VAT rates, and deposits.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Discount Type */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-neutral-600 uppercase tracking-wider block">
                  Discount Type
                </label>
                <div className="flex rounded border border-neutral-300 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => updateFinancials({ discountType: 'percentage' })}
                    className={`flex-1 py-2 text-xs font-semibold ${
                      financials.discountType === 'percentage'
                        ? 'bg-neutral-900 text-white'
                        : 'bg-white text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    Percentage (%)
                  </button>
                  <button
                    type="button"
                    onClick={() => updateFinancials({ discountType: 'fixed' })}
                    className={`flex-1 py-2 text-xs font-semibold border-l border-neutral-300 ${
                      financials.discountType === 'fixed'
                        ? 'bg-neutral-900 text-white'
                        : 'bg-white text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    Fixed Amount ({theme.currency.symbol})
                  </button>
                </div>
              </div>

              {/* Discount Value */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-neutral-600 uppercase tracking-wider block">
                  Discount Value {financials.discountType === 'percentage' ? '(%)' : `(${theme.currency.symbol})`}
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={financials.discountValue}
                  onChange={(e) =>
                    updateFinancials({ discountValue: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full text-xs px-3 py-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono text-right"
                />
              </div>

              {/* Tax Rate */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-neutral-600 uppercase tracking-wider block">
                  Tax / VAT Rate (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={financials.taxRate}
                    onChange={(e) =>
                      updateFinancials({ taxRate: parseFloat(e.target.value) || 0 })
                    }
                    placeholder="8.5"
                    className="w-full text-xs px-3 py-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono text-right pr-7"
                  />
                  <span className="absolute right-3 top-2 text-xs text-neutral-400 font-mono pointer-events-none">%</span>
                </div>
              </div>

              {/* Shipping or Misc Fee */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-neutral-600 uppercase tracking-wider block">
                  Shipping / Handling Fee ({theme.currency.symbol})
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={financials.shippingOrFee}
                  onChange={(e) =>
                    updateFinancials({ shippingOrFee: parseFloat(e.target.value) || 0 })
                  }
                  placeholder="0.00"
                  className="w-full text-xs px-3 py-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono text-right"
                />
              </div>

              {/* Amount Already Paid / Deposit */}
              <div className="space-y-1 sm:col-span-2">
                <label className="text-[11px] font-semibold text-neutral-600 uppercase tracking-wider block">
                  Amount Already Paid / Deposit ({theme.currency.symbol})
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={financials.amountPaid}
                  onChange={(e) =>
                    updateFinancials({ amountPaid: parseFloat(e.target.value) || 0 })
                  }
                  placeholder="0.00"
                  className="w-full text-xs px-3 py-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono text-right"
                />
                <span className="text-[11px] text-neutral-400 block mt-1">
                  If the client previously paid an advance or retainer, enter it here to deduce from balance due.
                </span>
              </div>
            </div>

            {/* Calculations Breakdown Box */}
            <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200 text-xs font-mono space-y-2">
              <div className="flex justify-between text-neutral-600">
                <span className="font-sans">Subtotal:</span>
                <span className="tabular-nums font-semibold">{formatMoney(totals.subtotal, theme.currency)}</span>
              </div>
              {totals.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span className="font-sans">Discount Applied:</span>
                  <span className="tabular-nums">-{formatMoney(totals.discountAmount, theme.currency)}</span>
                </div>
              )}
              {totals.taxAmount > 0 && (
                <div className="flex justify-between text-neutral-600">
                  <span className="font-sans">Estimated Tax ({financials.taxRate}%):</span>
                  <span className="tabular-nums">+{formatMoney(totals.taxAmount, theme.currency)}</span>
                </div>
              )}
              {totals.shippingOrFee > 0 && (
                <div className="flex justify-between text-neutral-600">
                  <span className="font-sans">Shipping / Fee:</span>
                  <span className="tabular-nums">+{formatMoney(totals.shippingOrFee, theme.currency)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-neutral-200 font-bold text-neutral-900">
                <span className="font-sans uppercase">Grand Total:</span>
                <span className="tabular-nums">{formatMoney(totals.grandTotal, theme.currency)}</span>
              </div>
              <div className="flex justify-between text-indigo-900 font-bold">
                <span className="font-sans uppercase">Balance Due:</span>
                <span className="tabular-nums text-sm">{formatMoney(totals.balanceDue, theme.currency)}</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: PAYMENT DETAILS & NOTES */}
        {activeTab === 'payment' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-neutral-900">Payment Instructions & Banking</h3>
              <p className="text-xs text-neutral-500">
                Provide bank account details, wire routing, payment link, or settlement instructions.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-neutral-600 uppercase tracking-wider block">
                  Payment Instructions
                </label>
                <textarea
                  rows={2}
                  value={payment.paymentInstructions || ''}
                  onChange={(e) => updatePayment({ paymentInstructions: e.target.value })}
                  placeholder="e.g. ACH or Domestic Wire preferred. Please reference invoice #INV-2026-084 on memo."
                  className="w-full text-xs px-3 py-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-neutral-600 uppercase tracking-wider block">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    value={payment.bankName || ''}
                    onChange={(e) => updatePayment({ bankName: e.target.value })}
                    placeholder="e.g. Silicon Valley Bank"
                    className="w-full text-xs px-3 py-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-neutral-600 uppercase tracking-wider block">
                    Account Beneficiary Name
                  </label>
                  <input
                    type="text"
                    value={payment.accountName || ''}
                    onChange={(e) => updatePayment({ accountName: e.target.value })}
                    placeholder="e.g. Acme Studio LLC"
                    className="w-full text-xs px-3 py-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-neutral-600 uppercase tracking-wider block">
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={payment.accountNumber || ''}
                    onChange={(e) => updatePayment({ accountNumber: e.target.value })}
                    placeholder="•••••••• 8492"
                    className="w-full text-xs px-3 py-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-neutral-600 uppercase tracking-wider block">
                    Routing # or IBAN
                  </label>
                  <input
                    type="text"
                    value={payment.routingOrIban || ''}
                    onChange={(e) => updatePayment({ routingOrIban: e.target.value })}
                    placeholder="021000089 / GB29NWBK..."
                    className="w-full text-xs px-3 py-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11px] font-semibold text-neutral-600 uppercase tracking-wider block">
                    SWIFT / BIC Code (for International wires)
                  </label>
                  <input
                    type="text"
                    value={payment.swiftBic || ''}
                    onChange={(e) => updatePayment({ swiftBic: e.target.value })}
                    placeholder="e.g. SVCBUS33XXX"
                    className="w-full text-xs px-3 py-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono uppercase"
                  />
                </div>
              </div>

              <div className="space-y-1 pt-2">
                <label className="text-[11px] font-semibold text-neutral-600 uppercase tracking-wider block">
                  Notes to Client
                </label>
                <textarea
                  rows={2}
                  value={payment.notes || ''}
                  onChange={(e) => updatePayment({ notes: e.target.value })}
                  placeholder="Thank you for your business! We appreciate working with your team."
                  className="w-full text-xs px-3 py-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-neutral-600 uppercase tracking-wider block">
                  Terms & Conditions
                </label>
                <textarea
                  rows={2}
                  value={payment.termsAndConditions || ''}
                  onChange={(e) => updatePayment({ termsAndConditions: e.target.value })}
                  placeholder="Payment is due within 30 days. Overdue balances may incur a 1.5% monthly late fee."
                  className="w-full text-xs px-3 py-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: DESIGN, TEMPLATES & CURRENCY */}
        {activeTab === 'design' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-neutral-900">Design & Layout Styling</h3>
              <p className="text-xs text-neutral-500">
                Choose from 4 layout templates, select an accent color palette, and choose currency.
              </p>
            </div>

            {/* Currency Selector */}
            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-neutral-600 uppercase tracking-wider block">
                Invoice Currency
              </label>
              <select
                value={theme.currency.code}
                onChange={(e) => {
                  const selected = SUPPORTED_CURRENCIES.find((c) => c.code === e.target.value);
                  if (selected) {
                    updateTheme({ currency: selected });
                  }
                }}
                className="w-full text-xs px-3 py-2.5 rounded border border-neutral-300 bg-white font-medium focus:outline-none focus:ring-1 focus:ring-neutral-900"
              >
                {SUPPORTED_CURRENCIES.map((cur) => (
                  <option key={cur.code} value={cur.code}>
                    {cur.name} ({cur.symbol})
                  </option>
                ))}
              </select>
            </div>

            {/* Template Selector */}
            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-neutral-600 uppercase tracking-wider block">
                Invoice Template Design
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    id: 'modern',
                    title: 'Modern Minimalist',
                    desc: 'Clean typography, hairline rules, contemporary tech/design studio layout.',
                  },
                  {
                    id: 'corporate',
                    title: 'Corporate Classic',
                    desc: 'Prominent header band, structured billing panels, formal business feel.',
                  },
                  {
                    id: 'emerald',
                    title: 'Agency Emerald',
                    desc: 'Refined deep green borders, clean balance banner, elegant spacing.',
                  },
                  {
                    id: 'nordic',
                    title: 'Nordic Editorial',
                    desc: 'High contrast monochrome, bold structural dividers, tabular clarity.',
                  },
                ].map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => updateTheme({ template: tpl.id as TemplateId })}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      theme.template === tpl.id
                        ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                        : 'border-neutral-200 bg-white hover:border-neutral-300 text-neutral-800'
                    }`}
                  >
                    <div className="font-bold text-xs">{tpl.title}</div>
                    <div
                      className={`text-[11px] mt-1 line-clamp-2 ${
                        theme.template === tpl.id ? 'text-neutral-300' : 'text-neutral-500'
                      }`}
                    >
                      {tpl.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Accent Color Palette */}
            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-neutral-600 uppercase tracking-wider block">
                Accent Highlight Color
              </label>
              <div className="flex items-center gap-3">
                {[
                  { id: 'slate', name: 'Slate / Dark', bg: 'bg-slate-900' },
                  { id: 'indigo', name: 'Indigo Studio', bg: 'bg-indigo-600' },
                  { id: 'emerald', name: 'Forest Emerald', bg: 'bg-emerald-700' },
                  { id: 'blue', name: 'Sapphire Blue', bg: 'bg-blue-700' },
                  { id: 'rose', name: 'Editorial Rose', bg: 'bg-rose-700' },
                  { id: 'amber', name: 'Warm Amber', bg: 'bg-amber-600' },
                ].map((col) => (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() => updateTheme({ accentColor: col.id as AccentColor })}
                    title={col.name}
                    className={`w-7 h-7 rounded-full ${col.bg} transition-transform ${
                      theme.accentColor === col.id
                        ? 'ring-2 ring-offset-2 ring-neutral-900 scale-110'
                        : 'hover:scale-105 opacity-80 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Toggle Watermark Stamp */}
            <div className="pt-2 border-t border-neutral-200">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-800 font-medium select-none">
                <input
                  type="checkbox"
                  checked={theme.showWatermark}
                  onChange={(e) => updateTheme({ showWatermark: e.target.checked })}
                  className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                />
                <span>Display Status Stamp on Invoice (Paid, Pending, Overdue, Draft)</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Editor Footer / Presets & Reset */}
      <div className="p-3 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onResetSample}
            className="px-2.5 py-1 text-xs text-neutral-600 hover:text-neutral-900 font-medium hover:bg-neutral-200 rounded transition-colors"
          >
            Reset to Sample
          </button>
          <span className="text-neutral-300">·</span>
          <button
            type="button"
            onClick={onClearAll}
            className="px-2.5 py-1 text-xs text-rose-600 hover:text-rose-800 font-medium hover:bg-rose-50 rounded transition-colors"
          >
            Clear All
          </button>
        </div>

        <div className="text-[11px] text-neutral-400 font-mono">
          Auto-saves in memory
        </div>
      </div>
    </div>
  );
};
