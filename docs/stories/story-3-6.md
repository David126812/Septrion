---
id: story-3-6
epic: 3
name: "Mise a jour temps reel des signalements"
status: done
commit: 0006491
---

# Story 3.6: Mise a jour temps reel des signalements

## User Story

As a **membre CS**,
I want **voir les nouveaux signalements apparaitre en temps reel**,
So that **je suis au courant immediatement quand un document arrive**.

## Acceptance Criteria

Given sur page signalements
When nouveau signalement insere pour copro_id
Then apparait sans refresh. Supabase Realtime avec cleanup au demontage.

## Tasks

- [x] Supabase Realtime subscription
- [x] Cleanup on unmount
- [x] Insert auto dans la liste

## Dev Notes

**Architecture patterns:** Supabase Realtime subscription with proper cleanup on component unmount to prevent memory leaks
**Source files:** src/pages/Signalements.tsx
**Testing:** Test real-time insert appears without refresh, verify subscription cleanup on navigation away, verify only signalements for user's copro_id appear

## Dev Agent Record

**Model:** Claude
**Status:** done
**Implementation notes:** Supabase Realtime subscription set up on the Signalements page, filtered by copro_id. New signalements inserted by any source (WhatsApp webhook, manual creation) appear in the list without page refresh. Subscription is properly cleaned up on component unmount via useEffect cleanup function.
**Gaps:** None
