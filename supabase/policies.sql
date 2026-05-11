alter table inquiries enable row level security;
alter table events enable row level security;
alter table radar_items enable row level security;
alter table newsletter_subscribers enable row level security;

-- inquiries: allow insert only
create policy "public_insert_inquiries"
on inquiries for insert
to anon
with check (true);

-- events: allow insert only
create policy "public_insert_events"
on events for insert
to anon
with check (true);

-- radar items: allow select
create policy "public_select_radar"
on radar_items for select
to anon
using (true);

-- newsletter: allow insert
create policy "public_insert_subscribers"
on newsletter_subscribers for insert
to anon
with check (true);
