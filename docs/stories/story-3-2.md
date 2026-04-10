---
id: story-3-2
epic: 3
name: "Webhook WhatsApp -> signalement"
status: done
commit: 0006491
---

# Story 3.2: Webhook WhatsApp -> signalement

## User Story

As a **membre CS**,
I want **forwarder un document par WhatsApp et le retrouver dans l'app**,
So that **l'info entre sans effort dans Septrion**.

## Acceptance Criteria

Given message WhatsApp recu
When webhook recoit
Then match sender_phone -> copro_id, upload Storage, analyzeMessage(), insert signalement avec status 'nouveau', ignore si phone inconnu, limite 10MB

## Tasks

- [x] whatsapp-webhook/index.ts
- [x] Webhook verification GET
- [x] Message ingestion POST
- [x] Media download Meta API
- [x] Upload Supabase Storage
- [x] Phone matching
- [x] Signalement creation

## Dev Notes

**Architecture patterns:** Supabase Edge Function as webhook endpoint, Meta WhatsApp Business API integration, phone-to-copro matching via profiles table
**Source files:** supabase/functions/whatsapp-webhook/index.ts
**Testing:** Test webhook verification handshake, message ingestion with media, phone matching for known/unknown numbers, 10MB limit enforcement

## Dev Agent Record

**Model:** Claude
**Status:** done
**Implementation notes:** WhatsApp webhook Edge Function implemented with GET verification and POST ingestion. Downloads media via Meta API, uploads to Supabase Storage, matches sender phone to copro_id via profiles, calls analyzeMessage() for IA analysis, and creates signalement with status 'nouveau'. Unknown phone numbers are ignored. 10MB limit enforced.
**Gaps:** None
