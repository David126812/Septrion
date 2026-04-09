# Structure Projet & Frontières

**Partie 5/6** | [Sommaire](./00-sommaire-architecture.md) | [Document complet](../architecture.md)

---

## Arborescence complète

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
│       └── _shared/
│           ├── analyzeMessage.ts    ← NOUVEAU — pipeline IA partagé
│           ├── sendWhatsApp.ts      ← NOUVEAU
│           └── sendEmail.ts         ← NOUVEAU — helper Resend
│
├── docs/
└── test-documents/
```

## Mapping FRs → Structure

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

## Frontières d'intégration

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

---
