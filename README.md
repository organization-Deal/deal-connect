# DEAL! Connect — Full Platform Build (v0.2)

A customer/owner portal and internal admin console for DEAL!, built with React + Vite and Cloudflare Pages Functions + D1 schema.

## What's included

### Front-end demo
- Admin Console: system overview, connection queue, customer directory, data quality, locations, projects, PX cases, voting center, announcements, documents, finance, LINE notification log, staff permissions, audit history and integration settings.
- Customer Portal: home, assets, cases/work tracking, finance, documents, voting, announcements and profile.
- Interactive demo actions: submit a connection request, approve/review requests, create cases, update case statuses, create polls, cast sample votes, publish announcements, search/filter records, inspect Customer 360.
- Demo state persists in localStorage.
- Synthetic customer records only; no uploaded customer CSV exports or real PII are included.

### Cloudflare backend foundation
- Pages Functions for LINE Login start/callback, logout, session middleware, connection request, guarded customer summary, staff-only connection review, health check and LINE webhook signature verification.
- D1 migration for customers, customer account links, verification requests, sessions, holdings, locations, projects, cases, voting, announcements, documents, finance entries, notification logs, staff users and audit logs.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run typecheck
npm run build
```

## Deploy to Cloudflare Pages

- Framework preset: Vite
- Build command: `npm run build`
- Build output directory: `dist`
- Production branch: `main`
- D1 database: create a dedicated database named `deal-connect-db`, apply `migrations/0001_init.sql`, then add a Pages D1 binding named `DB`.

Add Cloudflare Pages secrets (never commit them):
- `LINE_CHANNEL_ID`
- `LINE_CHANNEL_SECRET`
- `APP_BASE_URL` (the final https origin, e.g. the Pages URL)
- `LINE_CHANNEL_ACCESS_TOKEN` (Messaging API channel access token; only needed for outbound push messages)

The LINE Login callback URL must be registered exactly as `${APP_BASE_URL}/api/auth/line/callback`. Enable the email scope in the LINE Login channel if you expect an email claim. Staff access is granted only when the verified LINE email matches an active row in `staff_users`.

GitHub Actions deployment requires repository secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`, plus a Pages project named `deal-connect`.

## Production safety gates

This is not yet production-ready for customer access. The UI's demo actions use browser localStorage and sample records. The backend foundation is deliberately fail-closed for protected APIs unless a valid D1 session exists. Before using real customer data:
1. Complete and security-review LINE Login configuration, callback URL, OAuth state/nonce, ID-token verification and session lifecycle.
2. Configure staff records and least-privilege roles in D1; protect every admin route.
3. Import Lark Master via a server-side sync job with source IDs preserved; do not auto-merge duplicate names or shared emails.
4. Add verified contact OTP using a trusted provider. A phone/email entered into a form is not proof of ownership.
5. Add customer-specific authorization for each holding, location, document, finance record, vote and case.
6. Add rate limits, CSRF strategy, security headers, retention, PDPA notice/consent and operational monitoring.
7. Run account-isolation and permission QA using synthetic users before importing production data.

Do not connect real LINE push messaging, financial records or ownership data until the above gates pass.
