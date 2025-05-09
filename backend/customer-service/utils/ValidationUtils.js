// src/utils/ValidationUtils.js

// List of valid US state abbreviations and names
const validStates = {
    // Abbreviations
    'AL': 'Alabama',
    'AK': 'Alaska',
    'AZ': 'Arizona',
    'AR': 'Arkansas',
    'CA': 'California',
    'CO': 'Colorado',
    'CT': 'Connecticut',
    'DE': 'Delaware',
    'FL': 'Florida',
    'GA': 'Georgia',
    'HI': 'Hawaii',
    'ID': 'Idaho',
    'IL': 'Illinois',
    'IN': 'Indiana',
    'IA': 'Iowa',
    'KS': 'Kansas',
    'KY': 'Kentucky',
    'LA': 'Louisiana',
    'ME': 'Maine',
    'MD': 'Maryland',
    'MA': 'Massachusetts',
    'MI': 'Michigan',
    'MN': 'Minnesota',
    'MS': 'Mississippi',
    'MO': 'Missouri',
    'MT': 'Montana',
    'NE': 'Nebraska',
    'NV': 'Nevada',
    'NH': 'New Hampshire',
    'NJ': 'New Jersey',
    'NM': 'New Mexico',
    'NY': 'New York',
    'NC': 'North Carolina',
    'ND': 'North Dakota',
    'OH': 'Ohio',
    'OK': 'Oklahoma',
    'OR': 'Oregon',
    'PA': 'Pennsylvania',
    'RI': 'Rhode Island',
    'SC': 'South Carolina',
    'SD': 'South Dakota',
    'TN': 'Tennessee',
    'TX': 'Texas',
    'UT': 'Utah',
    'VT': 'Vermont',
    'VA': 'Virginia',
    'WA': 'Washington',
    'WV': 'West Virginia',
    'WI': 'Wisconsin',
    'WY': 'Wyoming',
  };
  
  // Valid state names array
  const validStateNames = Object.values(validStates);
  
  /**
   * Validates a state input (abbreviation or full name)
   * @param {string} state - State abbreviation or full name
   * @returns {boolean} - Whether state is valid
   */
  export const isValidState = (state) => {
    if (!state) return false;
    
    // Check if it's a valid abbreviation (uppercase)
    if (state.length === 2) {
      return !!validStates[state.toUpperCase()];
    }
    
    // Check if it's a valid state name (case-insensitive)
    return validStateNames.some(
      stateName => stateName.toLowerCase() === state.toLowerCase()
    );
  };
  
  /**
   * Validates a zip code format
   * @param {string} zipCode - Zip code to validate
   * @returns {boolean} - Whether zip code is valid
   */
  export const isValidZipCode = (zipCode) => {
    if (!zipCode) return false;
    
    // Pattern: 5 digits OR 5 digits, dash, 4 digits
    const zipPattern = /^[0-9]{5}(?:-[0-9]{4})?$/;
    return zipPattern.test(zipCode);
  };
  
  /**
   * Validates a social security number format (SSN)
   * @param {string} ssn - SSN to validate
   * @returns {boolean} - Whether SSN is valid
   */
  export const isValidSSN = (ssn) => {
    if (!ssn) return false;
    
    // Pattern: XXX-XX-XXXX
    const ssnPattern = /^[0-9]{3}-[0-9]{2}-[0-9]{4}$/;
    return ssnPattern.test(ssn);
  };
  
  /**
   * Validates a phone number
   * @param {string} phone - Phone number to validate
   * @returns {boolean} - Whether phone number is valid
   */
  export const isValidPhone = (phone) => {
    if (!phone) return false;
    
    // Simple phone validation - can be enhanced as needed
    const phonePattern = /^\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4}$/;
    return phonePattern.test(phone);
  };
  
  /**
   * Validates an email address
   * @param {string} email - Email to validate
   * @returns {boolean} - Whether email is valid
   */
  export const isValidEmail = (email) => {
    if (!email) return false;
    
    // Basic email validation
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };
  
  /**
   * Get the error message for a field
   * @param {string} field - Field name
   * @param {string} value - Field value
   * @returns {string|null} - Error message or null if valid
   */
  export const getFieldError = (field, value) => {
    switch (field) {
      case 'ssn':
        return isValidSSN(value) ? null : 'SSN must be in format XXX-XX-XXXX';
      case 'state':
        return isValidState(value) ? null : 'Please enter a valid US state abbreviation or name';
      case 'zipCode':
        return isValidZipCode(value) ? null : 'Zip code must be in format XXXXX or XXXXX-XXXX';
      case 'phoneNumber':
        return isValidPhone(value) ? null : 'Please enter a valid phone number';
      case 'email':
        return isValidEmail(value) ? null : 'Please enter a valid email address';
      default:
        return null;
    }
  };