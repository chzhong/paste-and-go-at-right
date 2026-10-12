# GitHub Pages maintenance

[简体中文](github-pages.md) · English

The project website is a buildless static site under `docs/`, deployed by `.github/workflows/pages.yml`.

## First-time enablement

1. Open **Settings → Pages** in the GitHub repository.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Open **Actions → Deploy GitHub Pages** and run the workflow. Later pushes that change `docs/` on `main` deploy automatically.

Public URLs:

- Home: `https://chzhong.github.io/paste-and-go-at-right/`
- Privacy policy: `https://chzhong.github.io/paste-and-go-at-right/privacy.html`

## Local preview

```bash
python3 -m http.server 4173 --directory docs
```

Then open `http://127.0.0.1:4173/`.

## Content structure

- `index.html`: bilingual product landing page.
- `privacy.html`: bilingual public privacy policy for the Chrome Web Store.
- `assets/site.css`: responsive visual design.
- `assets/site.js`: English/Chinese switching and local language preference.
- `*.md`: project documentation readable directly on GitHub.

The site uses no analytics, cookies, external fonts, third-party scripts, or remote build dependencies.
