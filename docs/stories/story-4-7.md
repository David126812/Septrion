---
id: story-4-7
epic: 4
name: "Resume IA dynamique"
status: missing
commit: N/A
---

# Story 4.7: Resume IA dynamique

## User Story
As a **membre du conseil syndical**, I want **que le resume se mette a jour automatiquement quand j'ajoute des documents**, So that **le resume reflete toujours l'etat complet du dossier**.

## Acceptance Criteria
- Given un signalement est rattache a un dossier existant (story 4.3)
- When le rattachement est confirme
- Then regenerateDossierSummary() est appelee avec le contexte complet du dossier
- And le resume et le next_step sont regeneres
- And un loading indicator est affiche pendant la regeneration
- And si la regeneration echoue, l'ancien resume est conserve et un toast d'erreur est affiche

## Tasks
- [ ] Appeler regenerateDossierSummary depuis le flow de rattachement
- [ ] Loading indicator pendant la regeneration
- [ ] Fallback ancien resume si echec avec toast erreur

## Dev Notes
**Architecture patterns:** Appel a la Edge Function regenerateDossierSummary apres rattachement, gestion optimiste avec fallback en cas d'echec. La fonction existe dans _shared mais n'est jamais invoquee.
**Source files:** supabase/functions/_shared/regenerateDossierSummary.ts (existe mais pas branchee)
**Testing:** Verifier l'appel apres rattachement, le loading state, le fallback en cas d'erreur, et la regeneration effective du resume.

## Dev Agent Record
**Model:** Claude
**Status:** missing
**Implementation notes:** La fonction regenerateDossierSummary existe dans supabase/functions/_shared/ mais n'est jamais appelee depuis le code UI. Aucune implementation du loading indicator ni du fallback erreur.
**Gaps:** Feature entierement non branchee. La fonction Edge existe mais n'est invoquee nulle part. Il faut: (1) appeler la fonction depuis Signalements.tsx apres rattachement, (2) ajouter un loading indicator, (3) gerer le fallback en cas d'echec.
