# Deploying the T-Rex site for free (GitHub Pages)

This project is a Next.js app configured for **static export** (`output: "export"` in
`next.config.ts`). It ships with a GitHub Actions workflow (`.github/workflows/deploy-pages.yml`)
that builds the site and publishes it to **GitHub Pages** automatically on every push to `main`.
GitHub Pages is free for public repositories.

You have two free hosting URL shapes:

| Repo type | Repo name | Resulting URL |
|---|---|---|
| **Org / user "root" site** | `<name>.github.io` | `https://<name>.github.io/` |
| **Project site** | anything (e.g. `t-rex`) | `https://<owner>.github.io/t-rex/` |

The previous T-Rex page lives at `https://tactile-rex.github.io/`, which is the **org root-site**
pattern (an org named `tactile-rex` + a repo named `tactile-rex.github.io`). The steps below
reproduce that for a brand-new org.

---

## A. Create a new organization (free)

1. Sign in to GitHub → top-right avatar → **Settings**.
2. Left sidebar → **Organizations** → **New organization** (or go to
   `https://github.com/account/organizations/new`).
3. Choose the **Free** plan.
4. Set the **organization account name** — this becomes the subdomain. For a root site at
   `https://tactile-rex.github.io/`, name the org **`tactile-rex`**.
5. Add your email, skip inviting members, finish.

> You can also host under your personal account instead of an org — then the root-site URL is
> `https://<your-username>.github.io/`. An org just gives the project a clean, shared home.

## B. Create the repository

**Option 1 — root site (recommended, matches `tactile-rex.github.io`):**

1. Inside the org → **Repositories** → **New**.
2. Repository name: **`<org-name>.github.io`** (exactly — e.g. `tactile-rex.github.io`).
3. Visibility: **Public** (required for free Pages).
4. Create the repo (don't add a README — we'll push our own files).

**Option 2 — project site:** name the repo anything (e.g. `t-rex`). The site will live under a
subpath `https://<org>.github.io/t-rex/`. If you use a subpath you must also add a `basePath` —
see "Project-site subpath" below.

## C. Push this folder to the repo

From `web-based-on-enpire-research/`:

```bash
git init
git add -A
git commit -m "T-Rex project website"
git branch -M main
git remote add origin https://github.com/<org-name>/<repo-name>.git
git push -u origin main
```

(`.gitignore` already excludes `node_modules/`, `.next/`, and `out/`.)

## D. Turn on GitHub Pages (GitHub Actions source)

1. In the repo → **Settings** → **Pages**.
2. Under **Build and deployment → Source**, select **GitHub Actions**.
3. That's it. The included workflow (`.github/workflows/deploy-pages.yml`) runs on every push to
   `main`: it installs deps, runs `npm run build` (static export to `out/`), and deploys.
4. Watch progress in the **Actions** tab. When the "Deploy GitHub Pages" run is green, your site is
   live at the URL from the table above (first deploy can take 1–2 minutes).

## E. Updating the site

Just push to `main` again — the workflow rebuilds and redeploys automatically.

```bash
git add -A && git commit -m "update" && git push
```

---

## Project-site subpath (only if you chose Option 2)

If the repo is **not** named `<org>.github.io`, the site is served from a subpath, so add a
`basePath`/`assetPrefix` so assets resolve. Edit `next.config.ts`:

```ts
const repo = "t-rex"; // your repo name
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath: process.env.NODE_ENV === "production" ? `/${repo}` : "",
  assetPrefix: process.env.NODE_ENV === "production" ? `/${repo}/` : "",
};
```

Root sites (`<org>.github.io`) need **no** `basePath` — leave `next.config.ts` as shipped.

## Custom domain (optional, still free)

Repo **Settings → Pages → Custom domain**: enter e.g. `tactile-rex.org`, then add the DNS records
GitHub shows (a `CNAME` to `<org>.github.io`, or `A`/`AAAA` records for an apex domain). GitHub
provisions HTTPS automatically.

## Notes

- Videos stream from Hugging Face (not committed), so the repo and each Pages deploy stay small and
  fast. To enable the second camera view in the demo gallery, upload the third-person clips (see
  README → Videos).
- GitHub Pages soft-limits a published site to ~1 GB and recommends keeping the source repo under
  ~1 GB — another reason the videos live on Hugging Face rather than in-repo.
