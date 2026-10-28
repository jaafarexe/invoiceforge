export interface Currency {
  code: string;
  symbol: string;
  name: string;
  position: 'prefix' | 'suffix';
  decimalDigits: number;
}

export type PaymentTermsType = 'due_on_receipt' | 'net_15' | 'net_30' | 'net_45' | 'net_60' | 'custom';

export type InvoiceStatus = 'draft' | 'pending' | 'paid' | 'overdue';

export type TemplateId = 'modern' | 'corporate' | 'emerald' | 'nordic';

export type AccentColor = 'slate' | 'indigo' | 'emerald' | 'blue' | 'rose' | 'amber';

export interface InvoiceItem {
  id: string;
  description: string;
  details?: string;
  quantity: number;
  unitPrice: number;
}

export interface BusinessInfo {
  name: string;
  logoUrl?: string;
  logoInitials?: string;
  taxId?: string;
  email: string;
  phone: string;
  address: string;
  cityStateZip: string;
  country: string;
  website?: string;
}

export interface ClientInfo {
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  cityStateZip: string;
  country: string;
  taxId?: string;
}

export interface InvoiceMeta {
  invoiceNumber: string;
  poNumber?: string;
  issueDate: string;
  dueDate: string;
  paymentTerms: PaymentTermsType;
  customTermsText?: string;
  status: InvoiceStatus;
}

export interface InvoiceFinancials {
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  taxRate: number; // percentage, e.g. 8.5
  shippingOrFee: number;
  amountPaid: number;
}

export interface PaymentDetails {
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
  routingOrIban?: string;
  swiftBic?: string;
  paymentInstructions?: string;
  termsAndConditions?: string;
  notes?: string;
}

export interface InvoiceThemeConfig {
  template: TemplateId;
  accentColor: AccentColor;
  currency: Currency;
  showWatermark: boolean;
  showDetailsColumn: boolean;
}

export interface InvoiceData {
  id: string;
  business: BusinessInfo;
  client: ClientInfo;
  meta: InvoiceMeta;
  items: InvoiceItem[];
  financials: InvoiceFinancials;
  payment: PaymentDetails;
  theme: InvoiceThemeConfig;
  lastModified?: number;
}

export interface CalculatedTotals {
  subtotal: number;
  discountAmount: number;
  taxableAmount: number;
  taxRate: number;
  taxAmount: number;
  shippingOrFee: number;
  grandTotal: number;
  amountPaid: number;
  balanceDue: number;
}
