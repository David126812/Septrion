---
status: 'complete'
completedAt: '2026-04-10'
generatedPostImplementation: true
workflowType: 'retrospective'
---

# Retrospectives par Epic — Septrion MVP

**Date :** 2026-04-10
**Note :** Retrospectives generees retroactivement apres implementation des 9 epics. Objectif : documenter ce qui a fonctionne, ce qui a derive des specs, et les ajustements necessaires.

---

## Epic 1 : Infrastructure & Authentification

**Commit :** `2167d58`
**Statut global :** Partial (70%)

### Ce qui a fonctionne
- Deploiement Vercel SPA en une config simple (`vercel.json` rewrites)
- PWA installable avec manifest + SW minimal
- Supabase Auth fonctionnel avec session persistante
- AuthGuard propre et reutilisable
- Page privacy policy en place

### Ce qui a derive
- **Auth par email au lieu de telephone** — L'implementation initiale utilisait email+password alors que les specs disaient telephone. **Decision (2026-04-10) : email + mdp est desormais la methode officielle.** Le numero WhatsApp est collecte a l'onboarding (step profil). Tous les docs ont ete mis a jour (PRD, architecture, epics, UX spec, project-context).
- **Migration 001 manquante** — Les tables core (`dossiers`, `signalements`, `published_updates`) n'ont pas de `CREATE TABLE` dans les migrations. Les migrations 004 (ALTER TABLE ADD copro_id) et 006 (RLS policies) referencent des tables qui n'existent pas en base. Un `supabase db reset` echouerait.
- **Variables d'environnement hardcodees** — `supabase.ts` contient un fallback avec l'URL et l'anon key en clair. Acceptable pour un prototype, problematique pour la production.

### Ajustements necessaires
1. Creer migration `001_core_tables.sql` (BLOQUANT)
2. ~~Migrer Auth de email vers telephone~~ — **Resolu (2026-04-10) : email + mdp confirme comme methode officielle**
3. Supprimer les fallbacks hardcodes dans `supabase.ts`

---

## Epic 2 : Onboarding & Configuration

**Commit :** `bb92f6a`
**Statut global :** Partial (80%)

### Ce qui a fonctionne
- Stepper 5 etapes fluide et bien structure
- Chaque etape est un composant isole (separation of concerns)
- StepProfil collecte les bonnes donnees (prenom, copro, whatsapp_phone, notification_consent)
- StepPremierDoc offre 3 options (upload, demo, explorer) comme prevu
- Seed data realistes (ascenseur, ravalement, eclairage)

### Ce qui a derive
- **Inscription non fusionnee** — L'UX spec et story 2.2 prevoient que l'inscription (numero+mdp) et le profil (prenom, copro, opt-in) sont fusionnes dans le step 2. En realite, l'inscription est separee dans Auth.tsx et le step 2 ne collecte que le profil. L'utilisateur s'inscrit d'abord, puis complete son profil — 2 etapes au lieu d'une.
- **Flag `onboarding_completed` absent** — Story 2.5 specifie explicitement que le flag est enregistre dans profiles. Sans ce flag, un utilisateur peut re-entrer l'onboarding indefiniment et le login redirige toujours vers /dashboard meme si l'onboarding n'est pas complete.
- **PostHog identify non fait** — Story 2.2 specifie `posthog.identify()` + `posthog.group()` au step 2. Non implemente (Epic 7 entierement manquant).

### Ajustements necessaires
1. Ajouter `onboarding_completed` dans profiles + migration SQL
2. Modifier AuthGuard pour verifier le flag
3. Evaluer si la fusion inscription+profil est necessaire (peut rester separe si acceptable UX)

---

## Epic 3 : Ingestion & Analyse IA

**Commit :** `0006491`
**Statut global :** Done (95%)

### Ce qui a fonctionne
- Pipeline IA partage (`analyzeMessage.ts`) proprement factorise entre webhook et upload
- Support PDF + image + texte avec Claude Sonnet
- Fallback keywords si Claude fail — resilience
- Auto-completion IA dans le formulaire avec loading indicator
- Limite 10MB correctement appliquee avec toast erreur
- Realtime Supabase pour les nouveaux signalements

### Ce qui a derive
- **Pas de selecteur d'urgence** — FR12 mentionne "urgence" dans la saisie manuelle, mais le UX spec dit explicitement "Pas de champ urgence (normal par defaut, IA determine si analyse)". L'implementation suit le UX spec. C'est un ecart avec FR12 mais conforme au UX spec.

### Ajustements necessaires
- Rien de bloquant. L'ecart urgence est une decision UX deliberee.

---

## Epic 4 : Triage & Gestion des Dossiers

**Commit :** `5a74857`
**Statut global :** Partial (90%)

### Ce qui a fonctionne
- Inbox signalements avec 3 actions (creer dossier, rattacher, rejeter)
- Liste dossiers avec badges statut et urgence
- Detail dossier complet (resume IA, timeline, documents, statut)
- Transitions de statut fonctionnelles (en_cours <-> bloque <-> termine)
- Time-ago helper pour les dates relatives

### Ce qui a derive
- **`regenerateDossierSummary` non branche** — La fonction shared existe et est correctement implementee, mais elle n'est jamais appelee depuis le flow de rattachement (story 4.3). Quand un signalement est rattache a un dossier existant, le resume du dossier ne se met pas a jour automatiquement. C'est story 4.7 qui est manquante.

### Ajustements necessaires
1. Appeler `regenerateDossierSummary` dans le flow de rattachement dans Signalements.tsx
2. Ajouter un loading indicator pendant la regeneration

---

## Epic 5 : Notifications & Communication

**Commit :** `a5a3107`
**Statut global :** Partial (80%)

### Ce qui a fonctionne
- Helpers `sendWhatsApp.ts` et `sendEmail.ts` proprement factorises
- Edge Function `send-notification` complete avec gestion du consentement
- Templates pour signalement et digest

### Ce qui a derive
- **Partage cosmetique absent** — Story 5.3 definit un bouton "Partager" dans le detail dossier avec choix residents/CS, message pre-rempli, et loop solo. La feature est completement absente de `DossierDetail.tsx`. Pas de bouton, pas de modal, pas d'envoi.

### Ajustements necessaires
1. Implementer le partage cosmetique dans DossierDetail.tsx
2. UI : modal/sheet avec 2 choix, message editable, bouton envoyer -> send-notification loop solo

---

## Epic 6 : Dashboard & Digest

**Commit :** `a5a3107`
**Statut global :** Done (95%)

### Ce qui a fonctionne
- Dashboard complet avec toutes les sections prevues
- Greeting personnalise (copro + prenom)
- Carte hero assistant IA avec navigation
- Quick actions fonctionnels avec badge count
- Alerte dossiers bloques bien visible
- Activite recente avec remontee auto
- Send-digest Edge Function complete avec resume IA

### Ce qui a derive
- Rien de significatif. Le digest est en declenchement manuel (pas de cron), ce qui est conforme au PRD pour le MVP.

### Ajustements necessaires
- Aucun bloquant. Le cron est post-MVP.

---

## Epic 7 : Analytics

**Statut global :** Missing (0%)

### Ce qui a fonctionne
- Le package `posthog-js` est installe dans package.json
- Les variables d'environnement sont definies dans `.env.example`

### Ce qui a derive
- **Epic entierement non implemente** — Zero code PostHog dans le projet. Pas d'init, pas d'identify, pas de group, pas d'events custom. C'est le seul epic entierement absent.

### Cause probable
L'epic a ete implemente dans le commit `a5a3107` ("Epics 5-9") qui regroupe 5 epics en un seul commit. Le volume de features a probablement cause l'oubli de l'analytics.

### Ajustements necessaires
1. Creer `src/lib/posthog.ts` avec init
2. Ajouter `posthog.init()` dans main.tsx
3. Ajouter `posthog.identify()` apres auth
4. Ajouter `posthog.group('copro')` apres chargement profil
5. Ajouter les 5 events custom dans les pages concernees

---

## Epic 8 : Seed & Administration

**Commit :** `bb92f6a` (seed dans Epic 2)
**Statut global :** Partial (70%)

### Ce qui a fonctionne
- 3 dossiers seed realistes avec timelines et documents
- Chargement conditionnel (seulement si aucun dossier n'existe pour la copro)
- Les seed sont fonctionnels et credibles pour un testeur

### Ce qui a derive
- **Seed dans composant React au lieu de SQL** — Story 8.1 dit "via un script SQL ou une migration, pas via WhatsApp". Le seed est dans `StepPremierDoc.tsx` (logique JS), pas dans un script SQL. Ca fonctionne mais c'est un anti-pattern : les donnees de seed sont dans le frontend au lieu du backend.
- **Pas de badge "Exemple"** — Les dossiers seed ne sont pas visuellement distingues des vrais dossiers dans la liste.

### Ajustements necessaires
1. Extraire les seed dans un script SQL ou une Edge Function dediee
2. Ajouter un badge "Exemple" visible sur les dossiers seed

---

## Epic 9 : Assistant IA (Chat & Vocal)

**Commit :** `a5a3107`
**Statut global :** Done (95%)

### Ce qui a fonctionne
- Chat interface complete avec bulles user/agent
- Typing indicator avec 3 dots bounce stagger
- Delai proportionnel a la longueur de la reponse
- Suggestions initiales (3 chips)
- Actions contextuelles (consulter dossier, creer signalement)
- Voice input fonctionnel avec Web Speech API
- Idle state avec grand micro central
- Animations fluides (fade-in, slide-in)
- Edge Function RAG complete avec matched_dossiers et suggested_actions

### Ce qui a derive
- **Web Speech API au lieu de Whisper** — Story 9.4 mentionne "Whisper" pour la transcription. L'implementation utilise l'API Web Speech native du navigateur en mode francais (`fr-FR`). C'est fonctionnel et ne necessite pas de cle API supplementaire. Ecart mineur acceptable.

### Ajustements necessaires
- Rien de bloquant. Le choix Web Speech API est pragmatique pour le MVP.

---

## Stories transversales manquantes

### Bottom Navigation
- Source : UX Spec "Navigation globale"
- Impact : CRITIQUE — c'est le composant de navigation principal de toute l'app
- Cause probable : aucune story ne couvre ce composant dans les epics. Oubli au moment de la decomposition epic.

### Page Settings
- Source : UX Spec ecran 9
- Impact : MODERE — deconnexion actuellement dans le Dashboard (workaround)
- Cause probable : idem, pas de story dans les epics

### Auth guard conditionnel
- Source : UX Spec + PRD
- Impact : MODERE — l'utilisateur peut bypasser l'onboarding
- Cause probable : le guard basique (connecte/non connecte) a ete implemente, mais la couche onboarding_completed a ete oubliee

### Migration 001
- Source : Architecture "Modele de Donnees"
- Impact : CRITIQUE — les tables core n'ont pas de CREATE TABLE
- Cause probable : les tables existaient probablement dans le prototype brownfield original et n'ont pas ete formalisees en migration

---

## Synthese

| Metrique | Valeur |
|---|---|
| Epics complets (done) | 3/9 (Epics 3, 6, 9) |
| Epics partiels | 5/9 (Epics 1, 2, 4, 5, 8) |
| Epics manquants | 1/9 (Epic 7) |
| Stories done | 29/44 |
| Stories partial | 7/44 |
| Stories missing | 8/44 |
| Completion | 66% |

### Top 3 apprentissages

1. **Un commit par epic = risque d'oubli** — Le commit `a5a3107` regroupe 5 epics. L'Epic 7 (analytics) a ete entierement oublie dans ce batch. Des commits plus granulaires (1 par story ou par epic) auraient permis de verifier la completude.

2. **Les composants transversaux doivent avoir leur propre story** — La bottom nav et Settings sont des composants structurants qui n'appartenaient a aucun epic. Ils auraient du etre identifies comme stories transversales au moment du readiness check.

3. **Le readiness report aurait attrape 80% des ecarts** — Les 3 ecarts UX critiques (bottom nav, Settings, auth guard) auraient ete detectes a l'etape 4 (UX alignment) du readiness report. Le manque de migration 001 aurait ete detecte a l'etape 5 (epic quality review). Sauter le quality gate a un cout direct.
