import { validatePhone } from "../phValidate";

export const isEmailValid = (email: string) => {
  return email.trim() && /\S+@\S+\.\S+/.test(email);
};

export const isPhoneValid = (phone: string) => {
  return phone.trim() && validatePhone(phone);
};
