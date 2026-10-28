import { InvoiceData } from '../types/invoice';
import { SUPPORTED_CURRENCIES, getTodayDateString, getDatePlusDays } from '../utils/currencies';

const today = getTodayDateString();
const dueDate = getDatePlusDays(today, 30);

export const SAMPLE_INVOICE: InvoiceData = {
  id: 'inv-sample-001',
  business: {
    name: 'Forge & Craft Design Studio LLC',
    logoInitials: 'FC',
    taxId: 'US-84-2918402',
    email: 'billing@forgecraft.design',
    phone: '+1 (415) 890-4120',
    address: '450 Mission Street, Suite 1200',
    cityStateZip: 'San Francisco, CA 94105',
    country: 'United States',
    website: 'https://forgecraft.design',
  },
  client: {
    name: 'Sophia Chen',
    company: 'Aether Dynamics Inc.',
    email: 'billing@aetherdynamics.io',
    phone: '+1 (206) 555-0184',
    address: '742 Evergreen Point Road, Fl 4',
    cityStateZip: 'Seattle, WA 98101',
    country: 'United States',
    taxId: 'US-91-7294018',
  },
  meta: {
    invoiceNumber: 'INV-2026-084',
    poNumber: 'PO-7821-AD',
    issueDate: today,
    dueDate: dueDate,
    paymentTerms: 'net_30',
    status: 'pending',
  },
  items: [
    {
      id: 'item-1',
      description: 'Design System & UI Architecture Sprint',
      details: 'Complete token system, typography scale, responsive layouts, Figma component library with auto-layout v2 & dark mode variants.',
      quantity: 40,
      unitPrice: 165,
    },
    {
      id: 'item-2',
      description: 'Frontend Application Engineering & State Engine',
      details: 'React 19 & Tailwind architecture, real-time client calculation pipeline, printable vector stylesheet engine, and local draft persistence.',
      quantity: 48,
      unitPrice: 175,
    },
    {
      id: 'item-3',
      description: 'Performance, Accessibility & Print Engine Audit',
      details: 'WCAG 2.1 AA compliance audit, high-density print stylesheet calibration, tabular numeral alignment, and screen reader testing.',
      quantity: 12,
      unitPrice: 150,
    },
    {
      id: 'item-4',
      description: 'Cloud Staging Infrastructure & Deployment Runbook',
      details: 'Production build configuration, containerization script, security headers, and automated continuous delivery integration.',
      quantity: 1,
      unitPrice: 1200,
    },
  ],
  financials: {
    discountType: 'percentage',
    discountValue: 5, // 5% discount
    taxRate: 8.5, // 8.5% tax
    shippingOrFee: 0,
    amountPaid: 5000, // $5,000 paid as initial retainer
  },
  payment: {
    bankName: 'Silicon Valley Commercial Bank',
    accountName: 'Forge & Craft Design Studio LLC',
    accountNumber: '•••••••• 8492',
    routingOrIban: '021000089',
    swiftBic: 'SVCBUS33XXX',
    paymentInstructions: 'ACH or Domestic Wire preferred. Please reference invoice number INV-2026-084 on the payment memo. For international wires, please use the SWIFT/BIC code listed above.',
    termsAndConditions: 'Payment is due within 30 days of invoice date. Overdue balances may incur a 1.5% monthly late finance charge. All deliverables remain intellectual property of Forge & Craft until full settlement.',
    notes: 'Thank you for partnering with Forge & Craft Design Studio. It was a pleasure working with your product engineering team!',
  },
  theme: {
    template: 'modern',
    accentColor: 'indigo',
    currency: SUPPORTED_CURRENCIES[0], // USD
    showWatermark: true,
    showDetailsColumn: true,
  },
  lastModified: Date.now(),
};

export const BLANK_INVOICE: InvoiceData = {
  id: 'inv-new',
  business: {
    name: 'Your Company Name',
    logoInitials: 'YC',
    taxId: '',
    email: 'contact@yourcompany.com',
    phone: '',
    address: '123 Business Avenue',
    cityStateZip: 'New York, NY 10001',
    country: 'United States',
    website: '',
  },
  client: {
    name: 'Client Contact Name',
    company: 'Client Company LLC',
    email: 'accounts@clientcompany.com',
    phone: '',
    address: '456 Client Boulevard',
    cityStateZip: 'Chicago, IL 60601',
    country: 'United States',
    taxId: '',
  },
  meta: {
    invoiceNumber: `INV-${new Date().getFullYear()}-001`,
    poNumber: '',
    issueDate: today,
    dueDate: getDatePlusDays(today, 15),
    paymentTerms: 'net_15',
    status: 'draft',
  },
  items: [
    {
      id: 'item-1',
      description: 'Consulting & Implementation Services',
      details: 'Initial project milestone deliverables and strategic advisory.',
      quantity: 10,
      unitPrice: 150,
    },
  ],
  financials: {
    discountType: 'percentage',
    discountValue: 0,
    taxRate: 0,
    shippingOrFee: 0,
    amountPaid: 0,
  },
  payment: {
    bankName: 'First National Bank',
    accountName: 'Your Company Name',
    accountNumber: '1234567890',
    routingOrIban: '987654321',
    swiftBic: '',
    paymentInstructions: 'Payment can be made via bank transfer or credit card. Please include the invoice number with your payment.',
    termsAndConditions: 'Payment is due within agreed terms. Late payments may be subject to a fee.',
    notes: 'Thank you for your business!',
  },
  theme: {
    template: 'modern',
    accentColor: 'slate',
    currency: SUPPORTED_CURRENCIES[0],
    showWatermark: false,
    showDetailsColumn: true,
  },
  lastModified: Date.now(),
};
