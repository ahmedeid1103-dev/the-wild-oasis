# Layout regression checks

The shared `SiteShell` uses the current pathname to choose the homepage layout.
Do not use `:has(.home-hero)` on shared ancestors: Next.js retains inactive pages
in the DOM, so that selector also matches after leaving the homepage.

After changing shared layouts, test client navigation as well as direct loads:

1. Open Home, follow Explore our cabins, and open a cabin.
2. Return Home through the logo, then visit Cabins again.
3. Use browser Back and Forward between Home and Cabins.
4. Continue through About, Sign in, and Create an account.
5. Sign in with a test account and visit the overview, profile, and reservations.
6. Check missing-page and missing-cabin screens.

On Home, the header overlays the hero and the hero can scroll on short screens.
On other routes, the header stays in document flow and the main content retains
its responsive padding. Hidden homepage markup must not change either rule.
Check at 320/390px, 768px, and 1440px widths. Review cards, date fields, profile
badges, and reservation summaries for overflow. Do not submit reservations or
change account data merely to check layout.

Run `npm run lint` and `npm run build` after implementation changes.
