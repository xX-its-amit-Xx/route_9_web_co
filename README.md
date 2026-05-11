# Route 9 Web

Marketing and portfolio site for [Route 9 Web](https://route9web.com) — a local web design practice serving independent businesses along Route 9 in central Massachusetts.

Built with Next.js 16 (App Router), TypeScript, Tailwind CSS v4, and Geist + Syne fonts.

---

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Building for production

```bash
npm run build
npm start
```

## Editing content

All copy, pricing, contact details, and portfolio items live in one file:

```
lib/content.ts
```

Before launch, fill in the placeholder constants:

| Constant | What to set |
|---|---|
| `SITE.phone` | Your phone number, e.g. `"(508) 555-0123"` |
| `SITE.github` | Your GitHub repo URL |
| `SITE.personalSite` | Your personal site URL |

The contact form currently uses `mailto:` so visitors need an email client. When you're ready to switch to a real form backend, swap the `handleSubmit` function in `components/Contact.tsx` for a `fetch()` call to a Vercel serverless function using [Resend](https://resend.com).

## Adding a real portfolio item

Replace a placeholder in `lib/content.ts`:

```ts
{
  label: "Smith's Pizzeria",
  description: "Mobile-first site with online menu and Google Maps integration.",
  gradient: "from-orange-100 via-amber-50 to-yellow-50",
  live: "https://smithspizzeria.com",
},
```

## Deploying to Vercel

### First deploy

1. Push this repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the GitHub repo.
3. No environment variables are needed for v1.
4. Click **Deploy**. Vercel auto-detects Next.js.

### Connecting route9web.com

1. In your Vercel project → **Settings → Domains** → Add `route9web.com`.
2. Vercel will show you DNS records to add.
3. In Cloudflare (your DNS provider):
   - Add the `A` record Vercel gives you (pointing to Vercel's IP).
   - Add the `CNAME` record for `www` pointing to `cname.vercel-dns.com`.
   - Set both records to **DNS only** (gray cloud, not orange) so Vercel can handle SSL.
4. Vercel provisions an SSL certificate automatically. Takes ~5 minutes.

### Subsequent deploys

Push to `main` — Vercel deploys automatically.

## OG image

Replace `public/og-image.png` with a real 1200×630 image before launch. The placeholder path is already wired into `app/layout.tsx`.

## License

MIT © 2026 Route 9 Web. See [LICENSE](LICENSE).
