import { disposableEmailDomains } from "./disposableEmailDomains";

export function isValidEmail(email) {
  const normalizedEmail = email.trim().toLowerCase();

  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(normalizedEmail);
}

export function isDisposableEmail(email) {
  const normalizedEmail = email.trim().toLowerCase();
  const atIndex = normalizedEmail.lastIndexOf("@");

  if (atIndex <= 0 || atIndex === normalizedEmail.length - 1) {
    return false;
  }

  const domain = normalizedEmail.slice(atIndex + 1);

  return disposableEmailDomains.has(domain);
}
