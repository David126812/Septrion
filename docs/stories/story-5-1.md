---
id: story-5-1
epic: 5
name: "Helpers d'envoi WhatsApp + email"
status: done
commit: a5a3107
---

# Story 5.1: Helpers d'envoi WhatsApp + email

## User Story
As a **developpeur**, I want **des helpers reutilisables pour envoyer des notifications**, So that **toutes les Edge Functions utilisent le meme canal de communication**.

## Acceptance Criteria
- Given une Edge Function doit notifier un utilisateur
- When elle appelle sendWhatsApp() ou sendEmail()
- Then WhatsApp est envoye via Meta API avec template
- And email est envoye via Resend API
- And les helpers sont dans le dossier _shared/
- And si un canal echoue, l'autre est tente
- And les envois sont logges

## Tasks
- [x] sendWhatsApp.ts dans _shared/
- [x] sendEmail.ts dans _shared/
- [x] Integration Meta Graph API v21.0
- [x] Integration Resend API

## Dev Notes
**Architecture patterns:** Helpers partages dans supabase/functions/_shared/, pattern fallback multi-canal (WhatsApp + email), logging des envois. Meta Graph API v21.0 pour WhatsApp, Resend pour email.
**Source files:** supabase/functions/_shared/sendWhatsApp.ts, supabase/functions/_shared/sendEmail.ts
**Testing:** Verifier l'envoi WhatsApp via Meta API, l'envoi email via Resend, le fallback si un canal echoue, et le logging.

## Dev Agent Record
**Model:** Claude
**Status:** done
**Implementation notes:** Helpers sendWhatsApp.ts et sendEmail.ts implementes dans _shared/. sendWhatsApp utilise Meta Graph API v21.0 avec templates. sendEmail utilise Resend API. Fallback multi-canal et logging en place.
**Gaps:** Aucun.
