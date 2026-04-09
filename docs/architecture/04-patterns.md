# Patterns d'Implémentation & Règles de Cohérence

**Partie 4/6** | [Sommaire](./00-sommaire-architecture.md) | [Document complet](../architecture.md)

---

## Nommage

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

## Structure Projet

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

## Format des réponses Edge Functions

**Succès :**
```json
{ "success": true, "data": { ... } }
```

**Erreur :**
```json
{ "success": false, "error": { "code": "ANALYSIS_FAILED", "message": "..." } }
```

Codes d'erreur standards : `ANALYSIS_FAILED`, `DOCUMENT_TOO_LARGE`, `INVALID_PHONE`, `UNAUTHORIZED`, `INTERNAL_ERROR`.

## Patterns Supabase côté frontend

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

## Gestion d'erreurs

**Edge Functions :**
- Try/catch global dans chaque fonction
- Si l'analyse IA échoue → créer le signalement avec `status: 'erreur'` et `raw_analysis: null`
- Jamais de perte silencieuse de données

**Frontend :**
- Erreurs réseau → toast notification (sonner, déjà installé)
- Erreurs de formulaire → validation Zod inline
- Pas de page d'erreur globale pour le MVP — toast suffit

## UI Patterns

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

---
