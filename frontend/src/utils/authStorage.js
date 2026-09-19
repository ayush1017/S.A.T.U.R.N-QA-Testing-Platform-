const HAS_ACCOUNT_KEY = 'saturn_has_account';

export function hasStoredAccount() {
  return localStorage.getItem(HAS_ACCOUNT_KEY) === 'true';
}

export function markHasAccount() {
  localStorage.setItem(HAS_ACCOUNT_KEY, 'true');
}

export function getAuthRedirectPath() {
  return hasStoredAccount() ? '/login' : '/signup';
}
