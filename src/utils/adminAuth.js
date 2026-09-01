// Simple client-side admin gate for a small shop site with no backend.
// IMPORTANT: this is NOT real security — anyone who reads the site's code
// can find this password. It only stops casual visitors from opening the
// admin panel. Change ADMIN_PASSWORD below to whatever you like before
// publishing the site, and don't share it publicly.
export const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD

const SESSION_KEY = 'shivyoga_admin_session'

export function isAdminLoggedIn() {
  try {
    return sessionStorage.getItem(SESSION_KEY) === 'true'
  } catch {
    return false
  }
}

export function loginAdmin(password) {
  if (password === ADMIN_PASSWORD) {
    try {
      sessionStorage.setItem(SESSION_KEY, 'true')
    } catch {
      /* ignore */
    }
    return true
  }
  return false
}

export function logoutAdmin() {
  try {
    sessionStorage.removeItem(SESSION_KEY)
  } catch {
    /* ignore */
  }
}
