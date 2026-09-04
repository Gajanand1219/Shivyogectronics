// ============================================================
// Google Analytics 4 - Shivyoga Electrical & Electronics
// Measurement ID: G-WE6ZVDWGR5
// ============================================================

const GA_ID = 'G-WE6ZVDWGR5'

// ------------------------------------------------------------
// Check whether GA4 is available
// ------------------------------------------------------------
const isGAReady = () => {
  return (
    typeof window !== 'undefined' &&
    typeof window.gtag === 'function'
  )
}

// ------------------------------------------------------------
// Generic event function
// ------------------------------------------------------------
export const trackEvent = (eventName, parameters = {}) => {
  if (!isGAReady()) return

  window.gtag('event', eventName, {
    ...parameters,
  })
}

// ============================================================
// PRODUCT TRACKING
// ============================================================

export const trackProductClick = (product) => {
  if (!product) return

  trackEvent('product_click', {
    product_id: String(product.id || ''),
    product_name: String(
      product.nameEn ||
      product.nameMr ||
      product.name ||
      ''
    ),
    category: String(product.category || ''),
  })
}

// ============================================================
// CATEGORY TRACKING
// ============================================================

export const trackCategoryClick = (category) => {
  if (!category) return

  trackEvent('category_click', {
    category_name: String(category),
  })
}

// ============================================================
// SEARCH TRACKING
// ============================================================

export const trackSearch = (searchTerm) => {
  if (!searchTerm) return

  const query = String(searchTerm).trim()

  if (!query) return

  trackEvent('search', {
    search_term: query,
  })
}

// ============================================================
// WHATSAPP
// ============================================================

export const trackWhatsAppClick = (location = 'unknown') => {
  trackEvent('whatsapp_click', {
    location: String(location),
  })
}

// ============================================================
// CALL
// ============================================================

export const trackCallClick = (phoneNumber = '', location = 'unknown') => {
  trackEvent('call_click', {
    phone_number: String(phoneNumber),
    location: String(location),
  })
}

// ============================================================
// GOOGLE REVIEW
// ============================================================

export const trackReviewClick = (location = 'unknown') => {
  trackEvent('google_review_click', {
    location: String(location),
  })
}

// ============================================================
// GOOGLE MAPS / DIRECTIONS
// ============================================================

export const trackDirectionsClick = (location = 'unknown') => {
  trackEvent('directions_click', {
    location: String(location),
  })
}

// ============================================================
// INSTAGRAM
// ============================================================

export const trackInstagramClick = (location = 'unknown') => {
  trackEvent('instagram_click', {
    location: String(location),
  })
}

// ============================================================
// FACEBOOK
// ============================================================

export const trackFacebookClick = (location = 'unknown') => {
  trackEvent('facebook_click', {
    location: String(location),
  })
}

// ============================================================
// VIEW MORE PRODUCTS
// ============================================================

export const trackViewMore = (visibleCount = 0) => {
  trackEvent('view_more_products', {
    visible_products: Number(visibleCount),
  })
}

// ============================================================
// VIEW LESS PRODUCTS
// ============================================================

export const trackViewLess = (visibleCount = 0) => {
  trackEvent('view_less_products', {
    visible_products: Number(visibleCount),
  })
}

// ============================================================
// NAVIGATION
// ============================================================

export const trackNavigation = (section = '') => {
  if (!section) return

  trackEvent('navigation_click', {
    section: String(section),
  })
}

// ============================================================
// CONTACT FORM
// ============================================================

export const trackContactSubmit = () => {
  trackEvent('contact_form_submit')
}

// ============================================================
// REVIEW POPUP
// ============================================================

export const trackReviewPopupShown = () => {
  trackEvent('review_popup_shown')
}

export const trackReviewPopupClosed = () => {
  trackEvent('review_popup_closed')
}

// ============================================================
// ADMIN
// ============================================================

export const trackAdminOpen = () => {
  trackEvent('admin_panel_open')
}

// ============================================================
// CUSTOM EVENT
// ============================================================

export const trackCustomEvent = (eventName, parameters = {}) => {
  if (!eventName) return

  trackEvent(String(eventName), parameters)
}

// ============================================================
// GA4 USER PROPERTIES
// ============================================================

export const setAnalyticsUserProperty = (property, value) => {
  if (!isGAReady()) return
  if (!property) return

  window.gtag('set', 'user_properties', {
    [property]: value,
  })
}

// ============================================================
// SET USER ID
// ============================================================
// Use ONLY for a genuine non-personally-identifying internal ID.
// Do NOT send phone number, email, name, etc.

export const setAnalyticsUserId = (userId) => {
  if (!isGAReady()) return
  if (!userId) return

  window.gtag('config', GA_ID, {
    user_id: String(userId),
  })
}
