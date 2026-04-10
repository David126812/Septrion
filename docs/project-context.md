---
status: 'complete'
completedAt: '2026-04-10'
inputDocuments:
  - "architecture.md"
  - "ux-design-specification.md"
  - "epics.md"
workflowType: 'project-context'
---

# Project Context — Septrion

Regles et conventions d'implementation pour l'agent dev. Ce document est la source de verite pour toutes les decisions de code.

---

## Stack & Runtime

| Composant | Technologie | Version |
|---|---|---|
| Language | TypeScript (strict) | 6.0 |
| Framework | React | 19.x |
| Bundler | Vite (plugin React Oxc) | 8.x |
| Styling | Tailwind CSS + CSS variables | 3.4 |
| UI Components | shadcn/ui (style base-nova) | Latest |
| Icons | Lucide React | 1.8 |
| Routing | React Router DOM | 7.x |
| State/Fetching | TanStack React Query | 5.x |
| Forms | React Hook Form + Zod | 7.x + 4.x |
| Toasts | Sonner | 2.x |
| Backend | Supabase (Postgres + Edge Functions + Storage + Auth + Realtime) | JS SDK 2.x |
| Edge Functions | Deno runtime (Supabase) | Latest |
| Analytics | PostHog | 1.366 |
| Deployment | Vercel (SPA mode) | N/A |

---

## Structure du projet

```
src/
  pages/              ← 1 fichier par route, nom = PascalCase du concept
  components/
    ui/               ← shadcn/ui primitives (ne pas modifier)
    auth/             ← composants lies a l'authentification
    onboarding/       ← composants des etapes onboarding
    layout/           ← composants de layout globaux (bottom nav, etc.)
  hooks/              ← custom hooks (useAuth, useProfile, etc.)
  lib/
    supabase.ts       ← client Supabase (singleton)
    utils.ts          ← utilitaires shadcn (cn())
    posthog.ts        ← init PostHog (a creer)
  assets/             ← images statiques
  App.tsx             ← routes + providers
  main.tsx            ← point d'entree (PostHog init, SW registration)
  index.css           ← tokens CSS (light/dark themes)

supabase/
  functions/
    _shared/          ← fonctions partagees entre Edge Functions
      analyzeMessage.ts
      sendWhatsApp.ts
      sendEmail.ts
      regenerateDossierSummary.ts
    analyze-document/ ← Edge Function : analyse IA de document
    assistant-query/  ← Edge Function : RAG assistant IA
    send-notification/← Edge Function : notification WhatsApp + email
    send-digest/      ← Edge Function : digest IA periodique
    whatsapp-webhook/ ← Edge Function : reception messages WhatsApp
  migrations/         ← SQL migrations numerotees (001_, 002_, etc.)

docs/                 ← documentation BMAD (ne pas modifier depuis le code)
public/               ← manifest.json, sw.js, icones PWA
```

---

## Conventions de nommage

| Element | Convention | Exemple |
|---|---|---|
| Fichiers pages | PascalCase.tsx | `DossierDetail.tsx` |
| Fichiers composants | PascalCase.tsx | `StepProfil.tsx` |
| Fichiers hooks | camelCase.ts avec prefix `use` | `useAuth.ts` |
| Fichiers lib | camelCase.ts | `supabase.ts` |
| Variables / fonctions | camelCase | `handleSubmit`, `isLoading` |
| Types / Interfaces | PascalCase | `Dossier`, `Signalement` |
| Tables SQL | snake_case | `coproprietes`, `published_updates` |
| Colonnes SQL | snake_case | `copro_id`, `created_at` |
| CSS variables | kebab-case | `--primary-foreground` |
| Routes URL | kebab-case | `/signaler-incident`, `/dossiers/:id` |
| Edge Functions | kebab-case (dossier) | `analyze-document/`, `send-notification/` |
| Shared functions | camelCase.ts | `analyzeMessage.ts`, `sendEmail.ts` |

**Pas de transformation** entre DB et frontend : snake_case partout cote donnees.

---

## Patterns d'implementation

### Pages

- Chaque page est un composant fonctionnel default-exported
- Les pages gerent leur propre state et data fetching
- Les pages utilisent `useAuth()` pour acceder a l'utilisateur courant
- Les pages qui ont besoin de `copro_id` le recupent via une query sur `profiles`

```tsx
// Pattern type pour une page
const MaPage = () => {
  const { user } = useAuth();
  // ... fetch data via supabase
  // ... render
};
export default MaPage;
```

### Data fetching

- **Requetes Supabase directes** dans les composants (pas de couche API intermediaire)
- **React Query** pour le cache et les mutations quand utile
- **Supabase Realtime** pour les mises a jour temps reel (signalements, onboarding step 5)
- Le RLS filtre automatiquement par `copro_id` — le frontend ne filtre jamais manuellement

### Formulaires

- **React Hook Form** pour la gestion du state formulaire
- **Zod** pour la validation
- **Toast Sonner** pour les messages de succes/erreur
- Pattern : `const { register, handleSubmit } = useForm({ resolver: zodResolver(schema) })`

### Navigation

- **React Router DOM** pour le routing client-side
- **AuthGuard** wrapper pour les routes protegees
- **Navigate** component pour les redirections
- **useNavigate()** pour la navigation programmatique

### Styling

- **Tailwind CSS** exclusivement (pas de CSS modules, pas de styled-components)
- **CSS variables** via `hsl(var(--token))` pour le theming
- **shadcn/ui** pour les primitives (Button, etc.) — ne pas modifier les fichiers dans `ui/`
- **Classes conditionnelles** via `cn()` de `lib/utils.ts`
- **Mobile-first** : designer pour mobile, adapter pour desktop si necessaire
- **Touch targets** : minimum 44px pour les zones de tap
- **Animations** : `tailwindcss-animate` plugin pour les transitions

### Couleurs semantiques

| Token | Usage |
|---|---|
| `primary` | Actions principales, liens, boutons CTA |
| `destructive` | Suppression, rejet, erreurs |
| `muted` | Texte secondaire, fonds legers |
| `accent` | Survol, selection |
| `card` | Fond des cartes |
| `border` | Bordures |

### Badges de statut (dossiers)

| Statut | Couleur |
|---|---|
| `en_cours` | `bg-blue-50 text-blue-700` |
| `bloque` | `bg-red-50 text-red-700` |
| `termine` | `bg-gray-100 text-gray-500` |

### Badges d'urgence

| Urgence | Couleur |
|---|---|
| `normal` | `bg-green-100 text-green-700` |
| `urgent` | `bg-amber-100 text-amber-700` |
| `critique` | `bg-red-100 text-red-700` |

---

## Edge Functions (Deno)

- Chaque Edge Function est dans son propre dossier `supabase/functions/<name>/index.ts`
- Les fonctions partagees sont dans `supabase/functions/_shared/`
- Import Supabase client via `createClient` avec `Deno.env.get()`
- CORS headers sur chaque reponse
- Pattern de reponse : `new Response(JSON.stringify(data), { headers: corsHeaders })`
- Gestion d'erreur : toujours retourner une reponse JSON avec `error` plutot qu'une exception

---

## Supabase conventions

### Migrations

- Numerotees : `001_`, `002_`, etc.
- Chaque migration est idempotente quand possible (`CREATE TABLE IF NOT EXISTS`)
- RLS active sur toutes les tables metier (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`)
- Policies RLS filtrent par `copro_id` via `auth.uid() -> profiles.copro_id`

### Storage

- Bucket : `copro-documents`
- Path : `{copro_id}/{filename}`
- Limite : 10MB par fichier
- Types acceptes : PDF, images (JPEG, PNG), texte

### Auth

- Methode : email + mot de passe (implementation actuelle)
- Note : le PRD specifie telephone + mot de passe. A migrer si necessaire.
- Session persistante via JWT Supabase
- `useAuth()` hook pour acceder au user/session dans les composants

---

## PostHog conventions

- Init dans `main.tsx` avec cle API et host EU (`https://eu.posthog.com`)
- `posthog.identify(user.id)` apres authentification
- `posthog.group('copro', copro_name)` pour grouper par copropriete
- Autocapture active (pas besoin de tracker les clics manuellement)
- Events custom a tracker explicitement :
  - `signalement_qualified` — signalement transforme en dossier
  - `dossier_viewed` — consultation d'un dossier
  - `notification_sent` — notification WhatsApp/email envoyee
  - `document_uploaded` — fichier ajoute manuellement
  - `digest_clicked` — clic depuis notification digest

---

## Regles strictes

1. **Pas de state management global** — React Query suffit. Pas de Redux, Zustand, etc.
2. **Pas de SSR** — SPA pure avec client-side routing
3. **Pas de hover states** — mobile-first, touch-based
4. **Pas de push notifications** — pas dans le MVP
5. **Pas de couche API** — le client parle directement a Supabase
6. **Pas de sous-dossiers dans les dossiers** — structure plate (un dossier = un sujet)
7. **Loop solo pour les notifications** — seul le testeur recoit ses propres notifications
8. **Mentions IA visibles** — tout resume IA doit porter la mention "Resume genere par IA"
9. **RGPD minimum** — politique de confidentialite accessible, mention IA, pas de stockage cote IA

---

## Environment variables

### Frontend (Vite — prefix `VITE_`)

| Variable | Usage |
|---|---|
| `VITE_SUPABASE_URL` | URL du projet Supabase |
| `VITE_SUPABASE_ANON_KEY` | Cle publique Supabase |
| `VITE_POSTHOG_KEY` | Cle API PostHog |
| `VITE_POSTHOG_HOST` | Host PostHog (`https://eu.posthog.com`) |

### Edge Functions (Deno — `Deno.env.get()`)

| Variable | Usage |
|---|---|
| `SUPABASE_URL` | URL Supabase (injecte automatiquement) |
| `SUPABASE_SERVICE_ROLE_KEY` | Cle service role (injecte automatiquement) |
| `ANTHROPIC_API_KEY` | Cle API Claude pour l'analyse IA |
| `RESEND_API_KEY` | Cle API Resend pour les emails |
| `WHATSAPP_ACCESS_TOKEN` | Token Meta WhatsApp Business API |
| `WHATSAPP_VERIFY_TOKEN` | Token de verification webhook |
| `WHATSAPP_PHONE_NUMBER_ID` | ID du numero WhatsApp Business |

**IMPORTANT :** Ne jamais hardcoder de credentials dans le code source. Utiliser `.env` pour le dev local et les variables Vercel/Supabase pour la production.
