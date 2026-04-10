# Décisions Architecturales

**Partie 3/6** | [Sommaire](./00-sommaire-architecture.md) | [Document complet](../architecture.md)

---

## Authentification & Sécurité

**Auth :** Supabase Auth — inscription/connexion par email + mot de passe. Le numéro WhatsApp est collecté à l'onboarding (step profil) et sert de clé de matching (`sender_phone` → `profiles.whatsapp_phone` → `copro_id`).

**RLS :** Isolation par copropriété. Chaque table métier porte un `copro_id`. Les policies RLS filtrent par la copropriété de l'utilisateur connecté via `auth.uid() → profiles.copro_id`.

**Sécurisation accès copro :** Différée au post-MVP. Pour le MVP, l'utilisateur saisit sa copro à l'onboarding sans vérification (10 testeurs identifiés). Post-MVP : mécanisme d'invitation ou code d'accès à définir.

## Modèle de Données

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

## API & Flux de Communication

**Edge Functions :**

| Edge Function | Rôle | Statut |
|---|---|---|
| `whatsapp-webhook` | WhatsApp entrant → match `sender_phone` → `copro_id` → analyse IA → signalement + notification | Existante, à adapter |
| `analyze-document` | Upload app → analyse IA → pré-remplissage champs ou signalement | À créer |
| `send-notification` | Envoi WhatsApp sortant (template Meta) + email (Resend) au testeur | À créer |
| `send-digest` | Résumé IA des dossiers actifs → notification WhatsApp + email | À créer |

**Fonction partagée :** `analyzeMessage()` — pipeline d'analyse IA utilisé par `whatsapp-webhook` et `analyze-document`. Produit :

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

## Notifications

- **Canal MVP :** WhatsApp sortant (template pré-approuvé Meta) + email (Resend)
- **Loop solo :** Le testeur reçoit ses propres notifications uniquement
- **Déclencheurs :** nouveau signalement, digest, partage cosmétique
- **Pas de push PWA** pour le MVP
- **Post-MVP :** Multi-utilisateurs (tous les membres CS de la copro)

## Frontend

- **PWA :** Manifest + Service Worker pour installabilité uniquement (pas de push, pas d'offline complexe)
- **Onboarding :** Stepper 6 étapes — explication → inscription (numéro + mdp) → profil (prénom, copro, lots +/−) + opt-in notifications → install PWA → WhatsApp → premier document
- **Session :** Supabase Auth gère la session (JWT). Profil en base `profiles`.
- **PostHog :** `posthog.identify(user.id)` après auth + `posthog.group('copro', copro_name)`

## Infrastructure & Déploiement

- **Hébergement frontend :** Vercel (deploy auto sur push, support SPA natif)
- **Email :** Resend (notifications + SMTP auth Supabase). Free tier 100 emails/jour.
- **Backend :** Supabase free tier (Postgres + Edge Functions + Storage + Realtime + Auth)
- **WhatsApp :** Business API directe, template pré-approuvé pour les notifications sortantes

---
