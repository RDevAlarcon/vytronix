;(async () => {
  const { config } = await import('dotenv');
  config();
  const { config: load } = await import('dotenv');
  load({ path: '.env.local' });
  const { Client } = await import('pg');
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL not set');
  const client = new Client({ connectionString: url });
  await client.connect();

  const cols = await client.query(
    `select column_name, data_type, column_default
     from information_schema.columns
     where table_schema='public' and table_name='contact_requests'
     order by ordinal_position`
  );
  console.log('contact_requests columns:', cols.rows);

  const sampleWithMessage = await client
    .query(
      `select id, name, email, phone, message, status, created_at
       from contact_requests
       order by created_at desc
       limit 5`
    )
    .catch((e) => {
      console.log('Select with message failed:', e.message);
      return { rows: [] };
    });
  console.log('sample rows (with message if available):', sampleWithMessage.rows);

  await client.end();
})().catch((e) => {
  console.error('DB check failed:', e.message);
  process.exit(1);
});
