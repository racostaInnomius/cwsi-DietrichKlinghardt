# Dietrich Klinghardt — temporary newsletter landing

Landing page implemented from `DK_Newsletter (7).pdf` with the same stack as
`cwsi-BistroRestaurant`: Vite, React 19, TypeScript and `vite-react-ssg`.

## Development

```bash
npm install
cp .env.example .env
npm run dev
```

Production validation:

```bash
npm run typecheck
npm run lint
npm run build
```

## Beytrax integration

- `page-contents/newsletter` controls the newsletter paragraph and optional CMS image.
- `page-contents/home` remains an image fallback for compatibility with existing content.
- Local fallback content keeps the temporary landing available when the CMS is offline.
- The signup form posts `firstName`, `lastName` and `email` to
  `POST /api/public/newsletter/subscribe` together with the public tenant/site UUIDs.
- Beytrax writes a `pending` row to `newsletter_subscribers`, sends the double-opt-in
  email and changes it to `confirmed` only after the subscriber clicks the link.
- A success or error modal gives immediate accessible feedback after each attempt.
- Confirmation redirects are implemented at `/newsletter/confirmed` and
  `/newsletter/error`.

Do not add MailerLite, Resend or database secrets to this repository. They belong
in `CWSB-Baytrax`/the tenant credential provisioning flow.

## Database records

Database scripts are intentionally not stored in this website repository. Create the
tenant, site and `pro_plus` (or higher) subscription manually in the Beytrax database.
The subscription row is required because the public API applies newsletter plan limits
before inserting into `newsletter_subscribers`.

## Production values

`.env.production` currently assumes `https://dietrich-klinghardt.com`. The corresponding
`sites.domain` value must be `dietrich-klinghardt.com` without protocol. Social/contact
URLs intentionally default to the signup section until the client supplies final destinations.

## Image provenance

`public/images/dietrich-klinghardt.jpg` is the original 1920×1080 image embedded in
the client-provided PDF. No external stock imagery is used.
