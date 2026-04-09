---
stepsCompleted:
  - "step-01-init"
  - "step-02-context"
  - "step-03-starter"
  - "step-04-decisions"
  - "step-05-patterns"
  - "step-06-structure"
  - "step-07-validation"
  - "step-08-complete"
status: 'complete'
completedAt: '2026-04-09'
inputDocuments:
  - "prd.md"
  - "product-brief-septrion.md"
  - "product-brief-septrion-distillate.md"
  - "research/00-sommaire-recherche.md"
  - "research/01-analyse-industrie.md"
  - "research/02-paysage-concurrentiel.md"
  - "research/03-cadre-reglementaire.md"
  - "research/04-tendances-techniques.md"
  - "research/05-synthese-strategique.md"
  - "research/06-recommandations.md"
workflowType: 'architecture'
project_name: 'Septrion'
user_name: 'David'
date: '2026-04-08'
---

# Architecture Decision Document — Septrion

_Ce document se construit collaborativement à travers un processus de découverte étape par étape. Les sections sont ajoutées au fur et à mesure des décisions architecturales._

## Analyse de Contexte Projet

### Vue d'ensemble des exigences

**Exigences fonctionnelles :** 39 FRs organisées en 9 domaines de capacités, se mappant à 6 composants architecturaux principaux : pipeline d'ingestion, triage, gestion des dossiers, notifications, onboarding, dashboard/digest.

**Exigences non-fonctionnelles :**
- Sécurité : stockage non public, HTTPS, chiffrement API Claude, conformité RGPD
- Fiabilité : zéro perte sur le webhook WhatsApp, gestion d'erreur gracieuse sur l'analyse IA
- Performance : analyse IA asynchrone, mises à jour temps réel via Supabase Realtime

**Échelle & complexité :**
- Domaine principal : Full-stack web (PWA + serverless)
- Niveau de complexité : Moyen — 5 intégrations externes, trafic faible
- Composants architecturaux estimés : 6 principaux + analytics + conformité

### Contraintes & Dépendances Techniques

- Stack décidé et prototype existant (brownfield)
- Pas d'authentification pour le MVP — identification par localStorage
- Dépendance Meta pour WhatsApp Business API (entrée + sortie)
- Dépendance Anthropic pour l'analyse IA (Claude Sonnet)
- Free tier Supabase (10MB storage par fichier, Edge Functions)
- Templates WhatsApp pré-approuvés nécessaires pour les notifications sortantes

### Préoccupations Transversales

1. **Pipeline IA partagé** — Le même flux d'analyse (Claude Sonnet) sert le webhook WhatsApp et l'upload app. Toute modification impacte les deux canaux.
2. **Temps réel** — Supabase Realtime utilisé dans la page signalements et l'onboarding écran 5. La souscription doit être fiable.
3. **Système de notifications** — WhatsApp sortant + email (Resend). Loop solo pour le MVP (testeur reçoit ses propres notifs).
4. **Gestion de fichiers** — Upload, stockage Supabase Storage, passage à Claude pour analyse, rattachement aux dossiers. Le fichier traverse 4 systèmes.
5. **Authentification & isolation** — Supabase Auth (numéro + mdp), RLS par copropriété. Le numéro lie le compte WhatsApp à l'app.

## Évaluation de la Base Existante

### Domaine technologique

Full-stack web (PWA + serverless). Projet brownfield — fondation existante documentée ci-dessous.

### Stack en place

**Language & Runtime :**
- TypeScript strict (tsconfig app + node séparées)
- React 18.3 + Vite 5.4 (SWC plugin)

**UI & Styling :**
- Tailwind CSS 3.4 + tailwindcss-animate
- shadcn/ui (20+ primitives Radix installées)
- Lucide React (icônes), Recharts (data viz)

**State & Data :**
- TanStack React Query (fetching/caching)
- React Hook Form + Zod (formulaires/validation)
- React Router DOM 6.30 (routing client-side)
- Supabase JS SDK 2.102

**Backend :**
- Supabase Edge Functions (Deno) — `whatsapp-webhook` existant
- SQL schemas existants (dossiers, signalements)

**Testing :**
- Vitest + Testing Library + jsdom

### Décisions architecturales héritées

- SPA avec client-side routing (pas de SSR)
- Pas de state management global (React Query suffit)
- Composants Radix/shadcn — design system cohérent
- Edge Functions pour la logique serveur
- Pas de couche API intermédiaire — le client parle directement à Supabase

### Gap analysis MVP

| Besoin MVP | Existant | À faire |
|---|---|---|
| Authentification (numéro + mdp) | ❌ | Supabase Auth + formulaires inscription/connexion |
| Onboarding stepper 6 étapes | ❌ | À créer |
| Webhook WhatsApp | ✅ | Adapter : matching sender_phone → copro_id, ajout location |
| Création in-app (3 modes) | ❌ (page SignalerIncident existe) | Adapter : upload fichier + auto-complétion IA |
| Inbox signalements | ✅ `Signalements.tsx` | Adapter : ajout copro_id, RLS |
| Détail dossier | ✅ `DossierDetail.tsx` | Adapter : retrait notes, ajout transitions statut |
| Dashboard | ✅ `Dashboard.tsx` | Adapter : remontée auto depuis dossiers, boutons "Prochainement" |
| Notifications WhatsApp + email | ❌ | Edge Function + Resend + template Meta |
| Partage cosmétique | ❌ | UI avec placeholders, loop solo |
| Digest manuel | ❌ | Edge Function + UI trigger |
| PostHog | ❌ | npm install + init |
| PWA manifest + SW | ❌ complet | Manifest + SW installabilité (sans push) |
| Tables coproprietes + profiles | ❌ | Migration SQL + RLS par copro |

## Décisions Architecturales

### Authentification & Sécurité

**Auth :** Supabase Auth — inscription/connexion par numéro de téléphone + mot de passe. Le numéro sert de clé de matching avec WhatsApp (`sender_phone` → `profiles.whatsapp_phone` → `copro_id`).

**RLS :** Isolation par copropriété. Chaque table métier porte un `copro_id`. Les policies RLS filtrent par la copropriété de l'utilisateur connecté via `auth.uid() → profiles.copro_id`.

**Sécurisation accès copro :** Différée au post-MVP. Pour le MVP, l'utilisateur saisit sa copro à l'onboarding sans vérification (10 testeurs identifiés). Post-MVP : mécanisme d'invitation ou code d'accès à définir.

### Modèle de Données

**Nouvelles tables :**

```sql
-- Copropriétés
create table public.coproprietes (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  lots_count integer,
  created_at timestamptz not null default now()
);

-- Profils utilisateurs (extension de auth.users)
create table public.profiles (
  id text primary key references auth.users(id) on delete cascade,
  first_name text not null,
  copro_id text not null references public.coproprietes(id),
  whatsapp_phone text not null,
  email text,
  notification_consent boolean not null default false,
  created_at timestamptz not null default now()
);
```

**Tables existantes modifiées :**

| Table | Modification |
|---|---|
| `dossiers` | Ajout `copro_id text references coproprietes(id)`. RLS par copro. |
| `signalements` | Ajout `copro_id text references coproprietes(id)`, `location text` (nullable). RLS par copro. |
| `published_updates` | Ajout `copro_id`. RLS par copro. |
| `pending_dossiers` | Ignorée pour le MVP. |

**RLS policies type :**
```sql
create policy "Users see own copro data" on public.dossiers
  for all using (
    copro_id = (select copro_id from public.profiles where id = auth.uid())
  );
```

### API & Flux de Communication

**Edge Functions :**

| Edge Function | Rôle | Statut |
|---|---|---|
| `whatsapp-webhook` | WhatsApp entrant → match `sender_phone` → `copro_id` → analyse IA → signalement + notification | Existante, à adapter |
| `analyze-document` | Upload app → analyse IA → pré-remplissage champs ou signalement | À créer |
| `send-notification` | Envoi WhatsApp sortant (template Meta) + email (Resend) au testeur | À créer |
| `send-digest` | Résumé IA des dossiers actifs → notification WhatsApp + email | À créer |
| `assistant-query` | Question utilisateur → charge contexte dossiers copro → prompt RAG → Claude → réponse + actions | À créer |

**Fonction partagée :** `analyzeMessage()` — pipeline d'analyse IA utilisé par `whatsapp-webhook` et `analyze-document`.

**Fonction partagée :** `regenerateDossierSummary()` — appelée quand un signalement est rattaché à un dossier. Envoie à Claude le contexte complet du dossier (tous les signalements, documents, timeline) et régénère le résumé + prochaine action.

`analyzeMessage()` produit :

```json
{
  "name": "Panne ascenseur Bât B",
  "urgency": "urgent",
  "location": "Ascenseur — Bâtiment B",
  "nextStep": "Contacter le prestataire ascenseur",
  "summary": "Signalement d'une panne d'ascenseur dans le bâtiment B"
}
```

`location` est nullable — si l'IA ne détecte pas de localisation dans le contenu, le champ reste vide pour complétion manuelle.

**Flux webhook WhatsApp mis à jour :**
```
Message WhatsApp entrant
  → Edge Function whatsapp-webhook
  → Match sender_phone → profiles.whatsapp_phone → copro_id
  → Upload fichier → Supabase Storage
  → analyzeMessage() → Claude Sonnet
  → INSERT signalement (avec copro_id, location)
  → send-notification → WhatsApp sortant + email au testeur
```

**Flux upload app :**
```
Bouton "+" → page "Signaler un incident"
  → Mode 1 : saisie manuelle → INSERT signalement
  → Mode 2 : saisie manuelle + pièce jointe → upload Storage → INSERT signalement
  → Mode 3 : upload + clic "Analyser avec l'IA" → Edge Function analyze-document
    → analyzeMessage() → pré-remplissage champs → utilisateur valide → INSERT signalement
  → send-notification → WhatsApp + email au testeur
```

### Notifications

- **Canal MVP :** WhatsApp sortant (template pré-approuvé Meta) + email (Resend)
- **Loop solo :** Le testeur reçoit ses propres notifications uniquement
- **Déclencheurs :** nouveau signalement, digest, partage cosmétique
- **Pas de push PWA** pour le MVP
- **Post-MVP :** Multi-utilisateurs (tous les membres CS de la copro)

### Frontend

- **PWA :** Manifest + Service Worker pour installabilité uniquement (pas de push, pas d'offline complexe)
- **Onboarding :** Stepper 5 étapes — explication → inscription + profil fusionnés (numéro, mdp, email optionnel, prénom, copro, opt-in) → install PWA → WhatsApp → premier document. Lots dans Settings.
- **Session :** Supabase Auth gère la session (JWT). Profil en base `profiles`.
- **PostHog :** `posthog.identify(user.id)` après auth + `posthog.group('copro', copro_name)`
- **Assistant IA :** Edge Function `assistant-query` (prompt RAG avec contexte dossiers). Speech-to-Text via Whisper API. Historique conversations stateless (React state en mémoire, pas de table en base).

### Infrastructure & Déploiement

- **Hébergement frontend :** Vercel (deploy auto sur push, support SPA natif)
- **Email :** Resend (notifications + SMTP auth Supabase). Free tier 100 emails/jour.
- **Backend :** Supabase free tier (Postgres + Edge Functions + Storage + Realtime + Auth)
- **WhatsApp :** Business API directe, template pré-approuvé pour les notifications sortantes

## Patterns d'Implémentation & Règles de Cohérence

### Nommage

**Base de données :** (hérité du prototype)
- Tables : `snake_case` pluriel → `dossiers`, `signalements`, `coproprietes`, `profiles`
- Colonnes : `snake_case` → `copro_id`, `created_at`, `sender_phone`
- FK : `{table_singulier}_id` → `copro_id`, `dossier_id`

**Edge Functions :**
- Nommage : `kebab-case` → `whatsapp-webhook`, `analyze-document`, `send-notification`, `send-digest`
- Fonction partagée : `camelCase` → `analyzeMessage()`

**Frontend React :** (hérité du prototype)
- Composants : `PascalCase.tsx` → `DossierDetail.tsx`, `SignalerIncident.tsx`
- Hooks : `camelCase.ts` → `useDossiers.ts`, `useSignalements.ts`
- Utilitaires : `camelCase.ts` dans `lib/` → `supabaseClient.ts`
- Pages : `PascalCase.tsx` dans `pages/`

**JSON échangé entre frontend et backend :**
- `snake_case` pour les données venant de Supabase (convention Postgres)
- Pas de transformation camelCase côté frontend — on utilise les noms Postgres directement

### Structure Projet

```
src/
  pages/           → pages routes (PascalCase.tsx)
  components/      → composants réutilisables
    ui/            → shadcn/ui (ne pas modifier)
  hooks/           → hooks custom React Query + Supabase
  lib/             → utilitaires, client Supabase, config
  data/            → données statiques / mocks
  test/            → tests unitaires
supabase/
  functions/       → Edge Functions (1 dossier par fonction)
    whatsapp-webhook/
    analyze-document/
    send-notification/
    send-digest/
    _shared/       → code partagé (analyzeMessage, etc.)
```

### Format des réponses Edge Functions

**Succès :**
```json
{ "success": true, "data": { ... } }
```

**Erreur :**
```json
{ "success": false, "error": { "code": "ANALYSIS_FAILED", "message": "..." } }
```

Codes d'erreur standards : `ANALYSIS_FAILED`, `DOCUMENT_TOO_LARGE`, `INVALID_PHONE`, `UNAUTHORIZED`, `INTERNAL_ERROR`.

### Patterns Supabase côté frontend

**Requêtes :** Toujours via React Query + Supabase client. Pas de `fetch` direct.

```typescript
// Pattern standard pour un hook de données
const useDossiers = () => {
  return useQuery({
    queryKey: ['dossiers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dossiers')
        .select('*')
        .order('updated_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });
};
```

**Mutations :** Via `useMutation` de React Query avec invalidation du cache.

**Realtime :** Souscription Supabase dans un `useEffect` avec cleanup. Utilisé pour la page signalements et l'onboarding.

### Gestion d'erreurs

**Edge Functions :**
- Try/catch global dans chaque fonction
- Si l'analyse IA échoue → créer le signalement avec `status: 'erreur'` et `raw_analysis: null`
- Jamais de perte silencieuse de données

**Frontend :**
- Erreurs réseau → toast notification (sonner, déjà installé)
- Erreurs de formulaire → validation Zod inline
- Pas de page d'erreur globale pour le MVP — toast suffit

### UI Patterns

**Boutons "Prochainement" :**
```typescript
<Button disabled className="opacity-50">
  Créer un événement
  <Badge variant="outline">Prochainement</Badge>
</Button>
```

**Éléments dummy :**
- Visuellement distingués (badge "Exemple" ou couleur atténuée)
- Le testeur doit comprendre que c'est du contenu de démonstration

## Structure Projet & Frontières

### Arborescence complète

```
copro-pilote/
├── README.md
├── package.json
├── vite.config.ts
├── vitest.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── eslint.config.js
├── components.json
├── index.html
├── vercel.json                      ← NOUVEAU — config SPA rewrites
├── .env.example                     ← NOUVEAU — variables d'environnement template
├── .gitignore
│
├── public/
│   ├── manifest.json                ← NOUVEAU — PWA manifest
│   ├── sw.js                        ← NOUVEAU — Service Worker (installabilité)
│   ├── icons/                       ← NOUVEAU — icônes PWA (192, 512)
│   └── favicon.ico
│
├── src/
│   ├── main.tsx                     ← init PostHog + Supabase Auth listener
│   ├── App.tsx                      ← routing + auth guard
│   ├── index.css
│   │
│   ├── pages/
│   │   ├── Auth.tsx                 ← NOUVEAU — inscription + connexion
│   │   ├── Onboarding.tsx           ← NOUVEAU — stepper 6 étapes
│   │   ├── Dashboard.tsx            ← ADAPTER — remontée auto dossiers
│   │   ├── DossiersList.tsx         ← ADAPTER — filtrage par copro_id
│   │   ├── DossierDetail.tsx        ← ADAPTER — transitions statut, retrait notes
│   │   ├── Signalements.tsx         ← ADAPTER — realtime + copro_id
│   │   ├── SignalerIncident.tsx      ← ADAPTER — 3 modes (manuel, pj, IA)
│   │   ├── Digest.tsx               ← NOUVEAU — déclenchement digest (admin)
│   │   ├── Settings.tsx
│   │   └── NotFound.tsx
│   │
│   ├── components/
│   │   ├── ui/                      ← shadcn/ui (ne pas modifier)
│   │   ├── auth/
│   │   │   └── AuthGuard.tsx        ← NOUVEAU
│   │   ├── onboarding/
│   │   │   ├── Stepper.tsx          ← NOUVEAU
│   │   │   ├── StepExplication.tsx
│   │   │   ├── StepInscription.tsx
│   │   │   ├── StepProfil.tsx       ← prénom, copro, lots +/−, opt-in
│   │   │   ├── StepInstallPWA.tsx
│   │   │   ├── StepWhatsApp.tsx
│   │   │   └── StepPremierDoc.tsx   ← détection realtime
│   │   ├── dossiers/
│   │   │   ├── DossierCard.tsx
│   │   │   ├── StatusBadge.tsx      ← NOUVEAU
│   │   │   ├── StatusTransition.tsx ← NOUVEAU
│   │   │   └── Timeline.tsx
│   │   ├── signalements/
│   │   │   ├── SignalementCard.tsx
│   │   │   └── QualificationActions.tsx
│   │   ├── partage/
│   │   │   └── PartageCosmetique.tsx ← NOUVEAU — UI placeholders, loop solo
│   │   └── dashboard/
│   │       ├── DossiersSummary.tsx   ← NOUVEAU — remontée auto
│   │       └── ComingSoonButton.tsx  ← NOUVEAU — pattern "Prochainement"
│   │
│   ├── hooks/
│   │   ├── useAuth.ts               ← NOUVEAU
│   │   ├── useDossiers.ts           ← ADAPTER — filtre copro_id
│   │   ├── useSignalements.ts       ← ADAPTER — filtre copro_id + realtime
│   │   ├── useProfile.ts            ← NOUVEAU
│   │   └── useRealtimeSignalements.ts ← NOUVEAU
│   │
│   ├── lib/
│   │   ├── supabase.ts
│   │   ├── posthog.ts               ← NOUVEAU
│   │   └── constants.ts             ← NOUVEAU
│   │
│   ├── types/
│   │   └── database.ts              ← NOUVEAU — types TypeScript des tables
│   │
│   └── test/
│
├── supabase/
│   ├── config.toml
│   ├── migrations/
│   │   ├── 001_initial_schema.sql
│   │   ├── 002_coproprietes.sql     ← NOUVEAU
│   │   ├── 003_profiles.sql         ← NOUVEAU
│   │   ├── 004_add_copro_id.sql     ← NOUVEAU
│   │   ├── 005_add_location.sql     ← NOUVEAU
│   │   └── 006_rls_policies.sql     ← NOUVEAU
│   └── functions/
│       ├── whatsapp-webhook/
│       │   └── index.ts             ← ADAPTER — matching phone → copro_id
│       ├── analyze-document/
│       │   └── index.ts             ← NOUVEAU
│       ├── send-notification/
│       │   └── index.ts             ← NOUVEAU — WhatsApp + Resend
│       ├── send-digest/
│       │   └── index.ts             ← NOUVEAU
│       ├── assistant-query/
│       │   └── index.ts             ← NOUVEAU — prompt RAG + contexte dossiers
│       └── _shared/
│           ├── analyzeMessage.ts    ← NOUVEAU — pipeline IA partagé
│           ├── sendWhatsApp.ts      ← NOUVEAU
│           └── sendEmail.ts         ← NOUVEAU — helper Resend
│
├── docs/
└── test-documents/
```

### Mapping FRs → Structure

| Domaine FR | Pages | Composants | Hooks | Edge Functions |
|---|---|---|---|---|
| Auth (FR1-4) | `Auth.tsx` | `auth/AuthGuard.tsx` | `useAuth.ts` | — |
| Onboarding (FR5-10) | `Onboarding.tsx` | `onboarding/*` | `useProfile.ts`, `useRealtimeSignalements.ts` | — |
| Ingestion (FR11-18) | `SignalerIncident.tsx` | — | — | `whatsapp-webhook`, `analyze-document`, `_shared/analyzeMessage.ts` |
| Triage (FR19-23) | `Signalements.tsx` | `signalements/*` | `useSignalements.ts` | — |
| Dossiers (FR24-29) | `DossierDetail.tsx`, `DossiersList.tsx` | `dossiers/*` | `useDossiers.ts` | — |
| Notifications (FR30-32) | — | `partage/PartageCosmetique.tsx` | — | `send-notification` |
| Dashboard (FR33-36) | `Dashboard.tsx`, `Digest.tsx` | `dashboard/*` | — | `send-digest` |
| Analytics (FR37-39) | — | — | — | — (PostHog SDK) |
| Admin (FR40-41) | — | — | — | Via `whatsapp-webhook` |
| Conformité (FR42-44) | onboarding + footer | — | — | — |

### Frontières d'intégration

**Flux de données principal :**
```
WhatsApp/Upload → Edge Function → Supabase Storage + Claude API → INSERT signalements
                                                                      ↓
                                                            send-notification
                                                            (WhatsApp + email)
                                                                      ↓
                                                              Testeur reçoit
```

**Frontière auth :**
- `AuthGuard.tsx` protège toutes les routes sauf `/auth`
- Le routing dans `App.tsx` redirige vers `/auth` si pas de session
- Après auth, redirige vers `/onboarding` (si pas complété) ou `/dashboard`

**Frontière données :**
- Toutes les requêtes Supabase passent par les hooks dans `hooks/`
- Les hooks utilisent React Query pour le cache
- Le RLS filtre automatiquement par `copro_id` — le frontend n'a pas besoin de filtrer

## Validation Architecture

### Cohérence ✅

- Stack compatible : React 18 + Vite + Supabase + Claude + Resend + PostHog + Vercel — aucun conflit
- Patterns cohérents : snake_case DB → snake_case JSON → pas de transformation frontend
- Structure alignée avec les décisions et les patterns

### Couverture des exigences ✅

- **44/44 FRs** couvertes architecturalement
- **NFRs** supportées (Auth + RLS, error handling, React Query + Realtime)

### Gaps mineurs

1. Ajouter une page statique pour la politique de confidentialité (FR42)
2. `.env.example` à documenter : `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `POSTHOG_KEY`, `RESEND_API_KEY`, `ANTHROPIC_API_KEY`, `WHATSAPP_VERIFY_TOKEN`, `WHATSAPP_ACCESS_TOKEN`
3. Template WhatsApp Meta à définir et soumettre pour approbation avant le test

### Checklist de complétude

- [x] Contexte projet analysé
- [x] Contraintes techniques identifiées
- [x] Authentification et sécurité décidées
- [x] Modèle de données formalisé (tables, FK, RLS)
- [x] Edge Functions définies (5 + _shared)
- [x] Flux de communication documentés
- [x] Notifications spécifiées (WhatsApp + email, loop solo)
- [x] Patterns d'implémentation établis
- [x] Structure projet complète avec mapping FRs
- [x] Frontières d'intégration documentées
- [x] 44/44 FRs couvertes
- [x] NFRs supportées

**Statut : PRÊT POUR L'IMPLÉMENTATION**
**Confiance : Élevée**
