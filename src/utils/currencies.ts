import { Currency, InvoiceFinancials, InvoiceItem, CalculatedTotals } from '../types/invoice';

export const SUPPORTED_CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar (USD)', position: 'prefix', decimalDigits: 2 },
  { code: 'EUR', symbol: '€', name: 'Euro (EUR)', position: 'suffix', decimalDigits: 2 },
  { code: 'GBP', symbol: '£', name: 'British Pound (GBP)', position: 'prefix', decimalDigits: 2 },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar (CAD)', position: 'prefix', decimalDigits: 2 },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar (AUD)', position: 'prefix', decimalDigits: 2 },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen (JPY)', position: 'prefix', decimalDigits: 0 },
  { code: 'CHF', symbol: 'CHF ', name: 'Swiss Franc (CHF)', position: 'prefix', decimalDigits: 2 },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee (INR)', position: 'prefix', decimalDigits: 2 },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar (SGD)', position: 'prefix', decimalDigits: 2 },
  { code: 'AED', symbol: 'AED ', name: 'UAE Dirham (AED)', position: 'prefix', decimalDigits: 2 },
  { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar (NZD)', position: 'prefix', decimalDigits: 2 },
  { code: 'SEK', symbol: ' kr', name: 'Swedish Krona (SEK)', position: 'suffix', decimalDigits: 2 },
];

export function formatMoney(amount: number, currency: Currency): string {
  const safeAmount = isNaN(amount) ? 0 : amount;
  const fixed = safeAmount.toLocaleString('en-US', {
    minimumFractionDigits: currency.decimalDigits,
    maximumFractionDigits: currency.decimalDigits,
  });

  if (currency.position === 'prefix') {
    return `${currency.symbol}${fixed}`;
  }
  return `${fixed}${currency.symbol}`;
}

export function calculateTotals(items: InvoiceItem[], financials: InvoiceFinancials): CalculatedTotals {
  const subtotal = items.reduce((sum, item) => {
    const qty = Number(item.quantity) || 0;
    const price = Number(item.unitPrice) || 0;
    return sum + (qty * price);
  }, 0);

  let discountAmount = 0;
  if (financials.discountType === 'percentage') {
    const pct = Math.max(0, Math.min(100, Number(financials.discountValue) || 0));
    discountAmount = (subtotal * pct) / 100;
  } else {
    discountAmount = Math.max(0, Number(financials.discountValue) || 0);
  }

  // Cap discount at subtotal
  discountAmount = Math.min(discountAmount, subtotal);

  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxRate = Math.max(0, Number(financials.taxRate) || 0);
  const taxAmount = (taxableAmount * taxRate) / 100;

  const shippingOrFee = Math.max(0, Number(financials.shippingOrFee) || 0);
  const grandTotal = taxableAmount + taxAmount + shippingOrFee;

  const amountPaid = Math.max(0, Number(financials.amountPaid) || 0);
  const balanceDue = Math.max(0, grandTotal - amountPaid);

  return {
    subtotal,
    discountAmount,
    taxableAmount,
    taxAmount,
    taxRate,
    shippingOrFee,
    grandTotal,
    amountPaid,
    balanceDue,
  };
}

export function formatDateDisplay(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    if (!year || !month || !day) return dateStr;
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function getTodayDateString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDatePlusDays(dateStr: string, days: number): string {
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    date.setDate(date.getDate() + days);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  } catch {
    return dateStr;
  }
}
