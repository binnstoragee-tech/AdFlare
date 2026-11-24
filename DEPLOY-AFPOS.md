# AFPOS update — deployment handoff

## What changed

This update keeps AFPOS’s existing AdFlare UI and static/no-build structure. Customer profiles now include birthday, default price level and note; customer search targets name, phone and email; birthday and customer-added date ranges can be combined; total spend is calculated from completed and pending bills; filtered customer results can be exported. Product records add barcode, unit, cost price and a per-product minimum-stock alert. The product alert now drives its low-stock status. Existing stock levels remain outlet-specific and continue to sync as before.

These customer/product fields are stored inside the existing JSON records in `public.pos_rows`; this feature set does not require a new column/table migration. The default price level is stored as customer metadata; it does not change sale pricing, because AFPOS does not yet have a complete tiered price-list engine.

## Before deploy

1. Back up your repository and Supabase data.
2. Keep `supabase-config.js` pointed at the intended Supabase project. Its browser key must be the **publishable/anon key** only. Never put a service-role key in frontend code.
3. Apply the existing account and outlet prerequisite SQL scripts following `private/README.md` in that file’s stated order. Then run `private/afpos-cloud-data.sql` in the Supabase SQL Editor after the outlet SQL prerequisites; it provisions the company-scoped `pos_rows` data layer, RLS and Realtime publication. Do not run unrelated scripts unless their feature is needed.
4. Confirm `public.pos_rows` is included in the `supabase_realtime` publication, and test using approved AFPOS accounts belonging to a test company. Realtime requires this SQL setup and authenticated access; code alone cannot configure your hosted Supabase project.
5. Upload the site files to your GitHub repository root (including `pos-app.html`, `pos-app.css`, `pos.html`, `supabase-config.js`, and the assets/scripts they reference). There is no build step for the site.

## Verification and boundaries

The inline JavaScript in `pos-app.html` passes `node --check`. The customer export reuses the existing filtered table query, and record edits use the existing save/Supabase sync path. No live Supabase writes, account sign-in, GitHub push, or production deployment were performed in this task. A real-time multi-device acceptance test should be done after you deploy and sign in on two approved test accounts/devices.
