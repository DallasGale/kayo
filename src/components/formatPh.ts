// export const formatPhoneNumber = (value: string): string => {
//   // Remove all non-digit characters
//   const digits = value.replace(/\D/g, "");

//   // Format the number as user types
//   if (digits.length <= 3) {
//     return digits;
//   } else if (digits.length <= 6) {
//     return `${digits.slice(0, 5)}-${digits.slice(3)}`;
//   } else {
//     return `${digits.slice(0, 5)}-${digits.slice(3, 6)}-${digits.slice(6, 9)}`;
//   }
// };
