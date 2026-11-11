-- Extra velden voor het vernieuwde contact-/offerteformulier.
-- Allemaal nullable, zodat bestaande berichten geldig blijven.
alter table public.contact_messages
  add column if not exists request_type text,
  add column if not exists service text,
  add column if not exists budget text,
  add column if not exists phone text;

alter table public.contact_messages
  drop constraint if exists contact_messages_request_type_check;
alter table public.contact_messages
  add constraint contact_messages_request_type_check
  check (request_type is null or request_type in ('kennismaking', 'offerte', 'vraag'));

create index if not exists idx_contact_messages_created_at on public.contact_messages(created_at desc);
