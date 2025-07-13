/**
 * Format number consistently across server and client to avoid hydration errors
 * Uses a specific locale to ensure consistent formatting
 */
export function formatNumber(number: number): string {
  return new Intl.NumberFormat('en-US').format(number);
}

/**
 * Format currency (Indian Rupees) consistently 
 */
export function formatCurrency(amount: number): string {
  return `₹${formatNumber(amount)}`;
}
