# Critères de Succès

**Partie 2/9** | [Sommaire](./00-sommaire-prd.md) | [Document complet](../prd.md)

---

## Succès Utilisateur

Le MVP est testé avec **10 membres CS** de copropriétés réelles sur **5 jours**. Le succès se mesure par des comportements spontanés, pas des réponses à des questionnaires.

| Signal | Seuil de validation (5 jours) | Seuil d'abandon |
|--------|-------------------------------|-----------------|
| Forward spontané de documents | 3+ docs en 5 jours sans sollicitation | 0 doc après jour 2 |
| Retour dans l'app | Le testeur revient au moins 3 jours sur 5 | Ouvre l'app une seule fois |
| Usage du partage/notification | Au moins 1 partage en 5 jours | Jamais utilisé |
| Qualité des résumés IA | Le testeur ne corrige pas plus de 20% des résumés | >50% jugés inutiles ou incorrects |

**Moment "aha" en deux temps :**
1. **Ingestion (jour 1)** — Le testeur forward un document et le retrouve structuré en moins d'une minute. Wow immédiat.
2. **Retrieval (jours 3-5)** — Le testeur ouvre Septrion pour retrouver une info au lieu de fouiller ses emails et WhatsApp. Le pré-chargement de 3-4 dossiers seed à partir de documents dummy est **critique** pour que ce moment arrive en 5 jours. Le testeur peut aussi ajouter ses propres documents s'il le souhaite.

## Succès Business

| Métrique | Cible | Pourquoi c'est le bon indicateur |
|----------|-------|----------------------------------|
| **Rétention J+5** | >40% (4+ testeurs sur 10 encore actifs) | Signal fort que l'outil s'intègre dans les habitudes du bénévole |
| **Debrief qualitatif jour 5** | Majorité des testeurs disent qu'ils continueraient | Validation du problem-solution fit — le signal le plus fiable |
| **Volume de dossiers** | 5+ dossiers par copro test (seed inclus) | Seuil à partir duquel la valeur retrieval se déclenche |

Pas de métriques de revenus au stade MVP — le produit est gratuit. La question de willingness-to-pay sera explorée lors du debrief jour 5.

## Succès Technique

Pas de seuils de performance arbitraires. Le principe directeur est : **bien fait, pas vite fait**. Les critères techniques sont qualitatifs au stade MVP :

- L'analyse IA produit des résultats cohérents et exploitables sur des documents réels (PDF, images, emails forwardés, scans)
- Le flux WhatsApp → signalement fonctionne de bout en bout sans intervention manuelle
- Les push notifications arrivent sur les appareils des testeurs (Android confirmé, iOS après install PWA)
- Les données sont correctement stockées et persistantes dans Supabase
- Le digest hebdo se déclenche manuellement et contient un résumé pertinent

## Résultats Mesurables

**Analytics PostHog** (autocapture + events custom) :
- `signalement_qualified` — signalement transformé en dossier
- `dossier_viewed` — consultation d'un dossier
- `notification_sent` — push envoyée aux membres CS
- `link_shared` — lien partageable copié
- `document_uploaded` — fichier ajouté manuellement
- `digest_clicked` — clic depuis la notification du digest
- Rétention J+1, J+3, J+5 par utilisateur identifié (prénom + copro)

---
