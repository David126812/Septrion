---
status: 'active'
createdAt: '2026-04-10'
workflowType: 'sprint-plan'
inputDocuments:
  - "epics.md"
  - "architecture.md"
  - "readiness-report.md"
  - "sprint-status.yaml"
---

# Sprint Plan — Septrion MVP (Re-implementation)

**Date :** 2026-04-10
**Contexte :** Code reset au commit `328e8a8`. Tous les artifacts de planning sont en place. Re-implementation story-driven selon le workflow BMad.

---

## Principes

1. **Story-driven** — chaque story est implementee, testee et commitee avant de passer a la suivante
2. **Dependencies first** — les stories sont ordonnees par dependances techniques reelles
3. **Vertical slices** — chaque sprint produit une app fonctionnelle (meme si incomplete)
4. **Sprint = epic** — sauf quand les dependances forcent un re-ordonnancement

---

## Ordre d'implementation

### Sprint 0 : Fondations (pre-requis pour tout)

| # | Story | Raison |
|---|---|---|
| 1 | **X.4** — Migration 001 tables core | Pre-requis : toutes les queries referencent ces tables |
| 2 | **1.1** — Deploiement Vercel & PWA | Pre-requis : l'app doit etre deployable |
| 3 | **1.2** — Inscription (numero + mdp) | Pre-requis : auth necessaire pour tout |
| 4 | **1.3** — Connexion & persistance session | Pre-requis : session auth |
| 5 | **1.4** — RLS par copropriete | Pre-requis : securite des donnees |
| 6 | **X.3** — Auth guard conditionnel onboarding | Pre-requis : redirect logic apres login |
| 7 | **X.1** — Bottom Navigation globale | Pre-requis : navigation de toute l'app |

**Livrable :** App deployee, auth fonctionnel, navigation globale, schema DB complet.

---

### Sprint 1 : Onboarding

| # | Story | Raison |
|---|---|---|
| 8 | **2.1** — Stepper & explication visuelle | Base du flow onboarding |
| 9 | **2.2** — Inscription + profil fusionnes & opt-in | Collecte profil |
| 10 | **2.3** — Instructions installation PWA | Step PWA |
| 11 | **2.4** — Explication WhatsApp | Step WhatsApp |
| 12 | **8.1** — Pre-chargement dossiers seed | Necessaire avant step 5 (exploration) |
| 13 | **2.5** — Premier document ou exploration | Derniere etape, depend du seed |

**Livrable :** Nouveau utilisateur peut s'inscrire, configurer son profil, et arriver sur un dashboard peuple.

---

### Sprint 2 : Ingestion & Analyse IA

| # | Story | Raison |
|---|---|---|
| 14 | **3.1** — Pipeline IA partage (analyzeMessage) | Base pour toute l'ingestion |
| 15 | **3.2** — Webhook WhatsApp -> signalement | Canal principal |
| 16 | **3.3** — Creation manuelle in-app | Canal secondaire |
| 17 | **3.4** — Upload fichier (sans IA) | Piece jointe basique |
| 18 | **3.5** — Auto-completion IA sur fichier | Enrichissement IA optionnel |
| 19 | **3.6** — Mise a jour temps reel signalements | Realtime pour UX |

**Livrable :** Documents arrivent par WhatsApp ou in-app, l'IA les analyse, signalements apparaissent en temps reel.

---

### Sprint 3 : Triage & Dossiers

| # | Story | Raison |
|---|---|---|
| 20 | **4.1** — Inbox signalements | Prerequis pour triage |
| 21 | **4.2** — Qualifier -> creer dossier | Action principale |
| 22 | **4.3** — Qualifier -> rattacher a un dossier | Action secondaire |
| 23 | **4.4** — Liste des dossiers | Vue d'ensemble |
| 24 | **4.5** — Detail d'un dossier | Vue complete |
| 25 | **4.6** — Transitions de statut | Cycle de vie |
| 26 | **4.7** — Resume IA dynamique | Regeneration a chaque rattachement |

**Livrable :** Cycle complet : signalement -> qualification -> dossier -> suivi.

---

### Sprint 4 : Notifications & Dashboard

| # | Story | Raison |
|---|---|---|
| 27 | **5.1** — Helpers envoi WhatsApp + email | Base notification |
| 28 | **5.2** — Notification auto nouveau signalement | Notification principale |
| 29 | **6.1** — Dashboard avec remontee automatique | Vue d'accueil complete |
| 30 | **6.2** — Digest resume IA | Envoi manuel du digest |
| 31 | **5.3** — Partage cosmetique depuis dossier | Feature secondaire |

**Livrable :** Dashboard complet, notifications fonctionnelles, digest IA.

---

### Sprint 5 : Assistant IA

| # | Story | Raison |
|---|---|---|
| 32 | **9.1** — Edge Function assistant-query (RAG) | Backend de l'assistant |
| 33 | **9.2** — Interface chat texte | UI principale |
| 34 | **9.3** — Suggestions, chips & actions | UX enrichie |
| 35 | **9.4** — Agent vocal | Input vocal |
| 36 | **9.5** — Animations et transitions | Polish UX |

**Livrable :** Assistant IA complet avec chat, voix, suggestions et actions contextuelles.

---

### Sprint 6 : Finitions

| # | Story | Raison |
|---|---|---|
| 37 | **X.2** — Page Settings | Profil, lots, notifications, privacy, deconnexion |
| 38 | **1.5** — Politique de confidentialite | RGPD |
| 39 | **7.1** — Initialisation PostHog & identification | Analytics base |
| 40 | **7.2** — Events custom | Analytics avances |

**Livrable :** App MVP complete, toutes les stories implementees.

---

## Notes

- **Story X.4 en premier** — la migration SQL est le fondement de tout. Sans les tables core, rien ne fonctionne.
- **Story X.1 dans Sprint 0** — la bottom nav est necessaire des que les premieres pages existent, sinon l'app est inutilisable.
- **Story 8.1 avancee au Sprint 1** — le seed doit etre pret avant le step 5 de l'onboarding.
- **Story X.2 reportee au Sprint 6** — Settings n'est pas bloquant pour le flow principal.
- **Decision auth (2026-04-10)** — email + mdp pour la creation de compte. Le numero WhatsApp est collecte a l'onboarding (Story 2.2).
