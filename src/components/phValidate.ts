export const validatePhone = (phone: string): boolean => {
  // Validates:
  // - Optional +
  // - Optional country code (1-3 digits)
  // - Area code and number (allowing spaces, dots, or dashes as separators)
  const phoneRegex =
    /^\+?([0-9]{1,3})?[-. ]?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  return phoneRegex.test(phone.trim());
};
