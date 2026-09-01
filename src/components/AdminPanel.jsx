import { useRef, useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { useAdminProducts } from '../context/AdminProductsContext'
import { isAdminLoggedIn, loginAdmin, logoutAdmin } from '../utils/adminAuth'
import { filterGroups } from '../data/categories'

const CATEGORY_OPTIONS = filterGroups.filter((g) => g !== 'सर्व')

const EMPTY_FORM = {
  nameMr: '',
  nameEn: '',
  category: CATEGORY_OPTIONS[0] || '',
  price: '',
  descMr: '',
  descEn: '',
  available: true,
  image: '',
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function AdminPanel({ onClose }) {
  const { t, lang, pick } = useLanguage()
  const { adminProducts, addProduct, updateProduct, deleteProduct } = useAdminProducts()

  const [loggedIn, setLoggedIn] = useState(isAdminLoggedIn())
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState(false)

  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [formError, setFormError] = useState('')
  const fileInputRef = useRef(null)

  function handleLogin(e) {
    e.preventDefault()
    if (loginAdmin(password)) {
      setLoggedIn(true)
      setLoginError(false)
    } else {
      setLoginError(true)
    }
  }

  function handleLogout() {
    logoutAdmin()
    setLoggedIn(false)
    setPassword('')
  }

  function resetForm() {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setFormError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handlePhotoChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const dataUrl = await fileToDataUrl(file)
      setForm((f) => ({ ...f, image: dataUrl }))
    } catch {
      setFormError(t('admin_required_fields'))
    }
  }

  function startEdit(p) {
    setEditingId(p.id)
    setForm({
      nameMr: p.nameMr || '',
      nameEn: p.nameEn || '',
      category: p.category || CATEGORY_OPTIONS[0] || '',
      price: p.price ?? '',
      descMr: p.descMr || '',
      descEn: p.descEn || '',
      available: p.available !== false,
      image: p.image || '',
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSubmit(e) {
  e.preventDefault()

  const nameMr = form.nameMr.trim()
  const nameEn = form.nameEn.trim()

  if ((!nameMr && !nameEn) || !form.image) {
    setFormError(t('admin_required_fields'))
    return
  }

  setFormError('')

  const payload = {
    nameMr: nameMr || nameEn,
    nameEn: nameEn || nameMr,
    name: nameEn || nameMr,
    category: form.category,
    price: form.price ? Number(form.price) : null,
    descMr: form.descMr.trim(),
    descEn: form.descEn.trim(),
    desc: form.descMr.trim(),
    available: form.available,
    image: form.image,
  }

  try {
    if (editingId) {
      await updateProduct(editingId, payload)
    } else {
      await addProduct(payload)
    }

    resetForm()
  } catch (error) {
    console.error(error)

    setFormError(
      error.message || 'Product save failed. Please try again.'
    )
  }
}

async function handleDelete(id) {
  if (!window.confirm(t('admin_delete_confirm'))) {
    return
  }

  try {
    await deleteProduct(id)

    if (editingId === id) {
      resetForm()
    }
  } catch (error) {
    console.error(error)

    setFormError(
      error.message || 'Product delete failed.'
    )
  }
}

  return (
    <div
      className="fixed inset-0 z-[100] bg-navy-900/70 backdrop-blur-sm flex items-start justify-center p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl my-4 sm:my-8 overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-4 bg-navy-700 text-white sticky top-0">
          <h2 className="font-display font-bold text-base sm:text-lg">
            {loggedIn ? t('admin_panel_title') : t('admin_login_title')}
          </h2>
          <div className="flex items-center gap-2 shrink-0">
            {loggedIn && (
              <button
                onClick={handleLogout}
                className="text-xs sm:text-sm font-semibold rounded-full border border-white/40 px-3 py-1.5 hover:bg-white/10 transition"
              >
                {t('admin_logout')}
              </button>
            )}
            <button
              onClick={onClose}
              aria-label={t('modal_close')}
              className="text-2xl leading-none px-1 hover:text-gold-400 transition"
            >
              ×
            </button>
          </div>
        </div>

        {!loggedIn ? (
          <form onSubmit={handleLogin} className="p-6 sm:p-8 flex flex-col gap-4">
            <p className="text-sm text-navy-400 font-marathi">{t('admin_login_desc')}</p>
            <div>
              <label htmlFor="admin-pass" className="text-sm font-semibold text-navy-600">
                {t('admin_password_label')}
              </label>
              <input
                id="admin-pass"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setLoginError(false)
                }}
                required
                className="mt-1 w-full rounded-lg border border-navy-100 px-4 py-2.5 text-sm focus:border-royal-400 focus:ring-2 focus:ring-royal-100 outline-none"
              />
              {loginError && (
                <p className="text-xs text-brand-red mt-1.5">{t('admin_wrong_password')}</p>
              )}
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-royal-500 text-white font-bold px-6 py-3 hover:brightness-105 transition"
            >
              {t('admin_login_btn')}
            </button>
          </form>
        ) : (
          <div className="p-4 sm:p-6 flex flex-col gap-8">
            <form
              onSubmit={handleSubmit}
              className="premium-card p-4 sm:p-6 flex flex-col gap-4"
            >
              <h3 className="font-display font-bold text-navy-700">
                {editingId ? t('admin_edit_title') : t('admin_add_title')}
              </h3>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-navy-600">
                    {t('admin_field_name_mr')}
                  </label>
                  <input
                    type="text"
                    value={form.nameMr}
                    onChange={(e) => setForm((f) => ({ ...f, nameMr: e.target.value }))}
                    className="mt-1 w-full rounded-lg border border-navy-100 px-4 py-2.5 text-sm focus:border-royal-400 focus:ring-2 focus:ring-royal-100 outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-navy-600">
                    {t('admin_field_name_en')}
                  </label>
                  <input
                    type="text"
                    value={form.nameEn}
                    onChange={(e) => setForm((f) => ({ ...f, nameEn: e.target.value }))}
                    className="mt-1 w-full rounded-lg border border-navy-100 px-4 py-2.5 text-sm focus:border-royal-400 focus:ring-2 focus:ring-royal-100 outline-none"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-navy-600">
                    {t('admin_field_category')}
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="mt-1 w-full rounded-lg border border-navy-100 px-4 py-2.5 text-sm focus:border-royal-400 focus:ring-2 focus:ring-royal-100 outline-none bg-white"
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-navy-600">
                    {t('admin_field_price')}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                    className="mt-1 w-full rounded-lg border border-navy-100 px-4 py-2.5 text-sm focus:border-royal-400 focus:ring-2 focus:ring-royal-100 outline-none"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-navy-600">
                    {t('admin_field_desc_mr')}
                  </label>
                  <textarea
                    rows={3}
                    value={form.descMr}
                    onChange={(e) => setForm((f) => ({ ...f, descMr: e.target.value }))}
                    className="mt-1 w-full rounded-lg border border-navy-100 px-4 py-2.5 text-sm focus:border-royal-400 focus:ring-2 focus:ring-royal-100 outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-navy-600">
                    {t('admin_field_desc_en')}
                  </label>
                  <textarea
                    rows={3}
                    value={form.descEn}
                    onChange={(e) => setForm((f) => ({ ...f, descEn: e.target.value }))}
                    className="mt-1 w-full rounded-lg border border-navy-100 px-4 py-2.5 text-sm focus:border-royal-400 focus:ring-2 focus:ring-royal-100 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-navy-600">
                  {t('admin_field_photo')}
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="mt-1 w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-royal-500 file:text-white file:px-4 file:py-2 file:font-semibold file:cursor-pointer"
                />
                <p className="text-[11px] text-navy-400/80 mt-1">{t('admin_photo_hint')}</p>
                {form.image && (
                  <img
                    src={form.image}
                    alt="preview"
                    className="mt-3 h-28 w-28 object-cover rounded-xl border border-navy-100"
                  />
                )}
              </div>

              <label className="inline-flex items-center gap-2 text-sm font-semibold text-navy-600 w-fit">
                <input
                  type="checkbox"
                  checked={form.available}
                  onChange={(e) => setForm((f) => ({ ...f, available: e.target.checked }))}
                  className="h-4 w-4 rounded border-navy-200 text-royal-500 focus:ring-royal-300"
                />
                {t('admin_field_available')}
              </label>

              {formError && <p className="text-xs text-brand-red">{formError}</p>}

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-green-500 text-white font-bold px-6 py-3 hover:brightness-105 transition"
                >
                  {editingId ? t('admin_update_btn') : t('admin_save_btn')}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-navy-200 text-navy-600 font-semibold px-6 py-3 hover:bg-navy-50 transition"
                  >
                    {t('admin_cancel_btn')}
                  </button>
                )}
              </div>
            </form>

            <div>
              <h3 className="font-display font-bold text-navy-700 mb-3">
                {t('admin_your_products')}
              </h3>
              {adminProducts.length === 0 ? (
                <p className="text-sm text-navy-400 font-marathi">{t('admin_no_products')}</p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3">
                  {adminProducts.map((p) => (
                    <div
                      key={p.id}
                      className="flex gap-3 items-center rounded-xl border border-navy-50 p-3"
                    >
                      <img
                        src={p.image}
                        alt={pick(p.nameMr, p.nameEn)}
                        className="h-14 w-14 rounded-lg object-cover shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-navy-700 truncate">
                          {pick(p.nameMr, p.nameEn)}
                        </p>
                        <p className="text-xs text-navy-400">{p.category}</p>
                      </div>
                      <div className="flex flex-col gap-1 shrink-0">
                        <button
                          onClick={() => startEdit(p)}
                          className="text-xs font-semibold text-royal-500 hover:text-brand-red"
                        >
                          {t('admin_edit')}
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="text-xs font-semibold text-brand-red hover:brightness-90"
                        >
                          {t('admin_delete')}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <p className="text-[11px] text-navy-400/80 font-marathi leading-relaxed border-t border-navy-50 pt-4">
              {t('admin_note')}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
