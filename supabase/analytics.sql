create table if not exists public.analytics_visits (
  id bigint generated always as identity primary key,
  occurred_at timestamptz not null default now(),
  visit_date date generated always as ((occurred_at at time zone 'UTC')::date) stored,
  session_id uuid not null,
  country text not null default 'Unknown',
  source text not null default 'direct',
  medium text,
  campaign text,
  content text,
  platform text not null default 'Other',
  device text not null default 'Desktop',
  constraint analytics_visits_session_day unique (session_id, visit_date)
);

create index if not exists analytics_visits_date_idx on public.analytics_visits (visit_date desc);
create index if not exists analytics_visits_country_idx on public.analytics_visits (country);
create index if not exists analytics_visits_source_idx on public.analytics_visits (source);

alter table public.analytics_visits enable row level security;
revoke all on table public.analytics_visits from anon, authenticated;
grant all on table public.analytics_visits to service_role;

create or replace function public.analytics_summary(p_days integer default 7)
returns jsonb
language sql
security definer
set search_path = public
as $$
  with limits as (select greatest(1, least(p_days, 365))::integer as n),
  range_days as (
    select generate_series(current_date - ((select n from limits) - 1), current_date, interval '1 day')::date as day
  ),
  recent as (
    select * from analytics_visits where visit_date >= current_date - ((select n from limits) - 1)
  )
  select jsonb_build_object(
    'total', (select count(*) from analytics_visits),
    'today', (select count(*) from analytics_visits where visit_date = current_date),
    'daily', (select jsonb_agg(jsonb_build_object('date', d.day, 'views', coalesce(v.views, 0)) order by d.day)
      from range_days d left join (select visit_date, count(*) views from recent group by visit_date) v on v.visit_date = d.day),
    'countries', (select coalesce(jsonb_agg(jsonb_build_object('label', country, 'value', views) order by views desc), '[]'::jsonb)
      from (select country, count(*) views from recent group by country order by views desc limit 5) q),
    'sources', (select coalesce(jsonb_agg(jsonb_build_object('label', source, 'value', views) order by views desc), '[]'::jsonb)
      from (select source, count(*) views from recent group by source order by views desc limit 5) q),
    'platforms', (select coalesce(jsonb_agg(jsonb_build_object('label', platform, 'value', views) order by views desc), '[]'::jsonb)
      from (select platform, count(*) views from recent group by platform order by views desc limit 5) q)
  );
$$;

revoke all on function public.analytics_summary(integer) from public, anon, authenticated;
grant execute on function public.analytics_summary(integer) to service_role;
