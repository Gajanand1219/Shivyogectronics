# Shivyoga Electrical & Electronics — Website

Premium, mobile-first website for **शिवयोगा इलेक्ट्रिकल & इलेक्ट्रॉनिक्स**, मामा चौक, मेन रोड, वसमत, जि. हिंगोली, महाराष्ट्र.

Built with **React + Vite + Tailwind CSS**.

## 1. Setup

You need [Node.js](https://nodejs.org) 18+ installed. Then, inside this folder:

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

To build for production (upload the `dist/` folder to any hosting like Hostinger, Netlify, Vercel, GitHub Pages, etc.):

```bash
npm run build
npm run preview   # optional: preview the production build locally
```

## 2. What's included

- **Marathi-first content** with a Devanagari web font (Noto Sans Devanagari), English used where natural (product names, buttons, technical terms).
- **Brand colors** based on the shop's real logo: Deep Navy, Royal Blue, Gold/Yellow, Red, Orange, White.
- Sticky navbar with the **real shop logo**, mobile hamburger menu, call + WhatsApp buttons.
- Premium hero section with the logo, floating category chips, and a glowing circuit-style signature divider.
- Trust badges, 20 product categories, a searchable + filterable product catalog (24 sample products), and dedicated showcase sections for **Water Heater / Geyser Elements, Fans, TV/DTH/Remotes, and Decorative Festival Lighting**.
- Services, "Why choose us," Electrical Tips articles, a photo gallery with lightbox, About, Google Maps location, and a Contact form that opens WhatsApp with the filled details.
- **Floating WhatsApp + Call buttons** on desktop, and a **sticky bottom action bar** (WhatsApp / Call / Directions) on mobile.
- SEO: page title, meta description, Open Graph tags, and `LocalBusiness` + `BreadcrumbList` JSON-LD structured data in `index.html`.
- Accessible: semantic HTML, alt text, visible focus states, `prefers-reduced-motion` support.

## 3. Editing content

All editable data lives in plain JS files — no need to touch component code for day-to-day updates:

| File | What it controls |
|---|---|
| `src/data/products.js` | Product catalog (add/edit/remove products) |
| `src/data/categories.js` | The 20 product categories |
| `src/data/services.js` | Services list + "Why choose us" points |
| `src/data/tips.js` | Electrical Tips articles |
| `src/utils/contact.js` | Phone numbers, WhatsApp number, address, social links, map query |

### Adding a real product photo

Right now product/category cards use emoji icons (no stock photos were used, since only the logo image was provided). To add a real photo:

1. Put the image in `src/assets/products/your-photo.jpg`.
2. In `src/data/products.js`, import it and set it as the product's `icon`, or extend the `ProductCard` in `src/components/Products.jsx` to render an `<img>` when a photo path is present instead of the emoji tile.

### Prices

Unknown prices intentionally show **"किंमतीसाठी संपर्क करा"**. Add a real number to a product's `price` field in `products.js` once you want to display it — no other business facts (years of experience, customer counts, awards, certifications) have been invented anywhere on the site, per your instructions.

## 4. WhatsApp / Call numbers

Defined once in `src/utils/contact.js`:

```js
export const WHATSAPP_NUMBER = '917038319408'
export const PHONE_NUMBERS = ['7038319408', '9552884781', '9359458009']
```

Every WhatsApp button on the site uses `waLink(message)` from this file, so the number only needs to be changed in one place.

## 5. Google Maps

The map embed and "Get Directions" link are built from a text search query (`मामा चौक, मेन रोड, वसमत`) in `src/utils/contact.js`, since an exact latitude/longitude was not provided. Once you have the shop's exact Google Maps pin, replace `MAPS_QUERY` with the coordinates for a more precise embed.

## 6. Future: Admin panel

The frontend is structured so it can later connect to a backend API:

- Product/category/service/tip data is centralized in `src/data/*.js` — this can be swapped for `fetch()` calls to an API with minimal changes to components.
- Components are reusable and presentational (`ProductCard`, section components), so an admin panel could reuse the same rendering components with API-driven data.

## 7. Project structure

```
src/
  assets/          → logo and future images
  components/       → Navbar, Hero, Products, Services, Gallery, Contact, Footer, etc.
  data/            → products.js, categories.js, services.js, tips.js
  utils/           → contact.js (phone/WhatsApp/map helpers)
  App.jsx          → assembles the homepage sections in order
  main.jsx         → React entry point
  index.css        → Tailwind layers + design tokens (colors, cards, animations)
index.html          → SEO meta tags + LocalBusiness/Breadcrumb structured data
tailwind.config.js  → brand color tokens (navy, royal, gold, brand.red/orange) and fonts
```

## 8. Notes on content honesty

Per your instructions, this site does **not** invent: prices, reviews, customer counts, awards, certifications, years of experience, or brand authorizations. Placeholders used throughout are: "किंमतीसाठी संपर्क करा", "उपलब्धतेनुसार", and "WhatsApp वर चौकशी करा".
