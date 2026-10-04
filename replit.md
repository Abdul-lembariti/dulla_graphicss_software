# Portfolio project notes

## Run on Replit

This is a static HTML, CSS, and JavaScript site with no build step or npm dependencies. The
`Start application` workflow serves it at `0.0.0.0:5000` using:

```sh
python3 -m http.server 5000 --bind 0.0.0.0
```

## Portfolio content

- `projects.js` is the project catalog. Keep project details there instead of duplicating card
  markup in `index.html`.
- Missing project images use `images/default-project.svg`.
- Keep image and script URLs relative so the portfolio continues to work from its GitHub Pages
  subpath.
- The two Vercel website redesigns are self-initiated design work, not client projects.
- Add real case-study facts and social profile URLs only when Abdulaziz provides them.

## Contact form

The contact form currently submits through FormSubmit. Do not put email passwords or SMTP
credentials in browser-side code; the portfolio is a static site.