/**
 * Formats a number as Indian Rupee (INR) currency.
 * @param {number|string} amount - The numeric value to format.
 * @returns {string} - Formatted currency string (e.g., ₹12,999.00).
 */
export const formatPrice = (amount) => {
  const number = parseFloat(amount);
  if (isNaN(number)) return amount;
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(number);
};

export const convertUSDToINR = (usdAmount, rate = 80) => {
  return parseFloat(usdAmount) * rate;
};
