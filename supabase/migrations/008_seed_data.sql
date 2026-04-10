-- Migration 008: Seed data for demo copropriété
-- These records are for the demo "Résidence Les Lilas" copro.
-- They will be visible to any user who joins that copro.

-- Use a fixed ID so we can reference it in other inserts
INSERT INTO public.coproprietes (id, name, lots_count)
VALUES ('seed-copro-lilas', 'Résidence Les Lilas', 42)
ON CONFLICT (id) DO NOTHING;

-- Seed dossiers
INSERT INTO public.dossiers (id, copro_id, name, status, urgency, description, next_step, last_action, timeline, created_at, updated_at)
VALUES
  (
    'seed-dossier-toiture',
    'seed-copro-lilas',
    'Réfection toiture Bâtiment B',
    'en_cours',
    'urgent',
    'Des infiltrations ont été signalées par plusieurs résidents du bâtiment B (appartements 301, 302, 304). Le syndic a été alerté le 10 mars. Un premier devis de réfection partielle a été demandé à l''entreprise Martin Couverture. Le montant estimé est de 18 000€ HT.',
    'Relancer le syndic pour obtenir le devis complet avant le 20 avril',
    'Devis demandé à Martin Couverture',
    '[{"label":"Signalement initial Mme Dupont (apt 302)","date":"2026-03-10T10:00:00Z","done":true},{"label":"Confirmation syndic — inspection prévue","date":"2026-03-15T14:00:00Z","done":true},{"label":"Inspection réalisée","date":"2026-03-22T09:00:00Z","done":true},{"label":"Devis demandé à Martin Couverture","date":"2026-03-28T11:00:00Z","done":true},{"label":"Réception du devis","date":"2026-04-20T00:00:00Z","done":false}]'::jsonb,
    '2026-03-10T10:00:00Z',
    '2026-03-28T11:00:00Z'
  ),
  (
    'seed-dossier-ascenseur',
    'seed-copro-lilas',
    'Panne ascenseur Bâtiment C',
    'bloque',
    'critique',
    'L''ascenseur du bâtiment C est en panne depuis le 2 mars 2026. L''intervention de TechLift est programmée mais repoussée deux fois. Mme Martin (5ème étage, 78 ans) et M. Lévy (4ème, mobilité réduite) sont fortement impactés.',
    'Exiger une date ferme d''intervention auprès de TechLift',
    'Intervention repoussée une 2ème fois',
    '[{"label":"Signalement panne par M. Lévy","date":"2026-03-02T08:30:00Z","done":true},{"label":"Appel TechLift — intervention prévue S11","date":"2026-03-04T10:00:00Z","done":true},{"label":"Intervention reportée à S12","date":"2026-03-10T16:00:00Z","done":true},{"label":"2ème report — TechLift invoque pièce manquante","date":"2026-03-18T09:00:00Z","done":true},{"label":"Mise en demeure TechLift","date":"2026-04-01T00:00:00Z","done":false}]'::jsonb,
    '2026-03-02T08:30:00Z',
    '2026-03-18T09:00:00Z'
  ),
  (
    'seed-dossier-parking',
    'seed-copro-lilas',
    'Éclairage parking souterrain',
    'en_cours',
    'normal',
    'Plusieurs néons défectueux au niveau -2 du parking souterrain. Zone sombre à proximité des places 45-52. Le gardien a fait un signalement au syndic. Remplacement prévu lors de la prochaine intervention de maintenance.',
    'Confirmer la date d''intervention avec le syndic',
    'Syndic informé',
    '[{"label":"Signalement gardien","date":"2026-03-25T07:00:00Z","done":true},{"label":"Syndic informé — ajouté au planning maintenance","date":"2026-03-27T10:00:00Z","done":true},{"label":"Intervention maintenance prévue","date":"2026-04-15T00:00:00Z","done":false}]'::jsonb,
    '2026-03-25T07:00:00Z',
    '2026-03-27T10:00:00Z'
  ),
  (
    'seed-dossier-portail',
    'seed-copro-lilas',
    'Remplacement digicode portail principal',
    'termine',
    'normal',
    'Le digicode du portail principal était hors service depuis janvier. Remplacement effectué le 5 mars par la société SecurAccès. Nouveau code distribué aux résidents via affichage hall.',
    NULL,
    'Digicode remplacé et opérationnel',
    '[{"label":"Signalement digicode HS","date":"2026-01-15T09:00:00Z","done":true},{"label":"Devis SecurAccès validé en CS","date":"2026-02-10T18:00:00Z","done":true},{"label":"Installation nouveau digicode","date":"2026-03-05T14:00:00Z","done":true},{"label":"Distribution nouveau code","date":"2026-03-06T08:00:00Z","done":true}]'::jsonb,
    '2026-01-15T09:00:00Z',
    '2026-03-06T08:00:00Z'
  );

-- Seed signalements (linked to dossiers)
INSERT INTO public.signalements (id, copro_id, name, urgency, location, summary, next_step, status, dossier_id, created_at)
VALUES
  (
    'seed-sig-toiture-1',
    'seed-copro-lilas',
    'Infiltrations toiture Bât B — Mme Dupont',
    'urgent',
    'Toiture',
    'Traces d''humidité au plafond de l''appartement 302, bâtiment B. Taches brunes qui s''étendent depuis une semaine. Mme Dupont signale une odeur de moisi.',
    'Faire inspecter par un couvreur',
    'qualifie',
    'seed-dossier-toiture',
    '2026-03-10T10:00:00Z'
  ),
  (
    'seed-sig-ascenseur-1',
    'seed-copro-lilas',
    'Ascenseur Bât C bloqué entre 2 et 3',
    'critique',
    'Ascenseur',
    'L''ascenseur du bâtiment C est immobilisé entre le 2ème et 3ème étage depuis ce matin. Personne n''était à l''intérieur. M. Lévy (4ème, mobilité réduite) ne peut plus sortir de chez lui.',
    'Contacter TechLift en urgence',
    'qualifie',
    'seed-dossier-ascenseur',
    '2026-03-02T08:30:00Z'
  ),
  (
    'seed-sig-parking-1',
    'seed-copro-lilas',
    'Néons grillés parking -2',
    'normal',
    'Parking',
    'Zone sombre au niveau -2, places 45 à 52. Au moins 4 néons sont hors service.',
    'Signaler au syndic pour maintenance',
    'qualifie',
    'seed-dossier-parking',
    '2026-03-25T07:00:00Z'
  );

-- A few unqualified signalements for the inbox
INSERT INTO public.signalements (id, copro_id, name, urgency, location, summary, next_step, status, created_at)
VALUES
  (
    'seed-sig-nouveau-1',
    'seed-copro-lilas',
    'Fissure façade Bâtiment A',
    'normal',
    'Façade',
    'Fissure verticale d''environ 1 mètre visible sur la façade est du bâtiment A, au niveau du 2ème étage. Apparue récemment selon M. Bernard.',
    'Faire évaluer par un expert',
    'nouveau',
    '2026-04-05T16:00:00Z'
  ),
  (
    'seed-sig-nouveau-2',
    'seed-copro-lilas',
    'Fuite robinet local poubelles',
    'urgent',
    'Parties communes',
    'Le robinet du local poubelles au RDC fuit en continu. Flaque d''eau persistante dans le couloir. Risque de glissade.',
    'Intervention plombier urgente',
    'nouveau',
    '2026-04-08T09:30:00Z'
  );
