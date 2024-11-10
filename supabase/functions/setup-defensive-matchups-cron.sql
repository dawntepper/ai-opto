select
cron.schedule(
  'update-defensive-matchups-daily',
  '0 5 * * *', -- Run at 5 AM UTC daily
  $$
  select
    net.http_post(
        url:='https://yhigfweeqfmoezrfigcx.supabase.co/functions/v1/update-defensive-matchups',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb
    ) as request_id;
  $$
);