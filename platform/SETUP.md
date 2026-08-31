# Setup — one-time, about 20 minutes

Everything below is free. No card is needed for either account.

## 1. Supabase (database, logins, file storage)

1. Go to **supabase.com** and sign up (GitHub or email).
2. Click **New project**.
   - Name: `cwg-loads`
   - Database password: generate one and **save it in your password manager** —
     it cannot be recovered later.
   - Region: **EU (Frankfurt)** — closest of the free regions to South Africa.
3. Wait about two minutes for the project to finish provisioning.
4. Open **SQL Editor → New query**, paste the entire contents of
   `platform/supabase/schema.sql`, and click **Run**. It should report success.
   The script is safe to run again if anything needs re-applying.
5. Open **Project Settings → Data API** and copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Open **Project Settings → API keys** and copy the **service_role** key →
   `SUPABASE_SERVICE_ROLE_KEY`. This one is secret: server-side only, never in
   the browser, never in a screenshot.

## 2. Resend (notification emails)

1. Go to **resend.com** and sign up.
2. **API Keys → Create API Key** (permission: *Sending access*) →
   `RESEND_API_KEY`.
3. **Domains → Add Domain** → `cwgholdings.net`. Resend shows a few DNS records
   to add. Whoever manages the domain's DNS adds them; verification usually
   completes within the hour.
   - Until the domain is verified, Resend can only send to your own address.
     That is fine for development.

## 3. Local environment

```bash
cd platform
cp .env.example .env.local   # then paste in the values from steps 1 and 2
npm install
npm run dev                  # http://localhost:3000
```

## 4. Making yourself an admin

Admin rights are a row in the database, not a setting in the app — so nobody
can grant it to themselves through the interface.

1. Register through the app as a normal user.
2. In Supabase → **SQL Editor**, run (with your own email):

```sql
update profiles set role = 'admin'
where id = (select id from auth.users where email = 'you@example.com');
```

## 5. Deploying

The Vercel project currently serves the gated mockup from the repository root.
When the platform is ready to take over, in the Vercel project:

- **Settings → Build and Deployment → Root Directory** → set to `platform`
- **Settings → Environment Variables** → add the same keys as `.env.local`
  (`NEXT_PUBLIC_*` for all environments, the secret keys for Production)

Until that switch, `main` keeps publishing the mockup, so this build cannot
break the client's preview link.

## Notes on secrets

- `.env.local` is gitignored. Keep it that way.
- The **anon** key is designed to be public — it is safe in the browser because
  row level security decides what it may read. The **service_role** key is not:
  it bypasses those rules entirely.
- If a secret is ever pasted somewhere public, rotate it in the provider's
  dashboard rather than trying to delete the message.
