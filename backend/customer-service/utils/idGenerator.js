/**
 * Generates a SSN-style customer ID (XXX-XX-XXXX)
 */
export const generateCustomerId = () => {
    const num = Math.floor(Math.random() * 1000000000);
    return num.toString()
      .padStart(9, '0')
      .replace(/(\d{3})(\d{2})(\d{4})/, '$1-$2-$3');
  };