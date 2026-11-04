# Deploy DEAL! Connect

## GitHub
Create a new private repository named `deal-connect`. Push this folder to its `main` branch. Never add customer CSV/XLSX exports, `.env`, `.dev.vars`, access tokens, LINE secrets or API credentials.

## Cloudflare Pages
1. Create a separate Pages project named `deal-connect`.
2. Connect it to the private GitHub repository.
3. Select Vite; build command `npm run build`; output directory `dist`; production branch `main`.
4. Create a dedicated D1 database `deal-connect-db` and apply `migrations/0001_init.sql`.
5. Add D1 binding `DB` in Pages > Settings > Functions.
6. Add secrets `LINE_CHANNEL_ID`, `LINE_CHANNEL_SECRET`, `APP_BASE_URL`, and `LINE_CHANNEL_ACCESS_TOKEN` for outbound LINE push.
7. Register `${APP_BASE_URL}/api/auth/line/callback` in LINE Login channel settings.
8. Add GitHub Actions secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` if using the included workflow.

The initial deployment is a preview. Do not expose real customer data or enable production customer access until identity matching, staff permissions and row-level authorization are tested.
