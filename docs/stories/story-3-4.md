---
id: story-3-4
epic: 3
name: "Upload fichier comme piece jointe (sans IA)"
status: done
commit: 0006491
---

# Story 3.4: Upload fichier comme piece jointe (sans IA)

## User Story

As a **membre CS**,
I want **attacher un fichier a mon signalement sans declencher l'IA**,
So that **le document est conserve comme piece justificative**.

## Acceptance Criteria

Given sur SignalerIncident
When selectionne fichier
Then upload Storage, document_url attache, limite 10MB, IA NON declenchee

## Tasks

- [x] Zone upload dans SignalerIncident.tsx
- [x] Upload Supabase Storage
- [x] Limite 10MB avec toast erreur
- [x] IA non declenchee par defaut

## Dev Notes

**Architecture patterns:** File upload to Supabase Storage with size validation, document_url stored on signalement record
**Source files:** src/pages/SignalerIncident.tsx
**Testing:** Test file upload under and over 10MB, verify IA is not triggered on upload, verify document_url is attached to signalement

## Dev Agent Record

**Model:** Claude
**Status:** done
**Implementation notes:** File upload zone added to SignalerIncident form. Files uploaded to Supabase Storage with 10MB limit enforced (toast error on oversized files). document_url attached to signalement record. IA analysis is not triggered by default on file attachment -- user must explicitly click the analyze button (Story 3.5).
**Gaps:** None
