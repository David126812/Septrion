# Évaluation de la Base Existante

**Partie 2/6** | [Sommaire](./00-sommaire-architecture.md) | [Document complet](../architecture.md)

---

## Domaine technologique

Full-stack web (PWA + serverless). Projet brownfield — fondation existante documentée ci-dessous.

## Stack en place

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

## Décisions architecturales héritées

- SPA avec client-side routing (pas de SSR)
- Pas de state management global (React Query suffit)
- Composants Radix/shadcn — design system cohérent
- Edge Functions pour la logique serveur
- Pas de couche API intermédiaire — le client parle directement à Supabase

## Gap analysis MVP

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

---
