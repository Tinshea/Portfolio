# TODO

## Répondre en tant que `contact@malekbouzarkouna.com` (~15 min, gratuit)

Aujourd'hui : les réponses aux messages du formulaire partent du Gmail perso.
Objectif : recevoir ET répondre via `contact@malekbouzarkouna.com`, depuis Gmail.

**Brique 1 — Réception (redirection d'adresse chez Squarespace)**
1. account.squarespace.com (connexion via compte Google) → Domains → `malekbouzarkouna.com` → **Email forwarding**.
2. Créer l'alias `contact@malekbouzarkouna.com` → transfert vers `malekbouzarkouna58@gmail.com`.
   (Squarespace ajoute les MX du domaine racine tout seul ; aucun conflit avec les
   enregistrements Resend, qui sont sur le sous-domaine `send.`.)
3. Bonus : `contact@` devient une vraie adresse joignable directement.

**Brique 2 — Envoi (alias Gmail via le SMTP de Resend)**
1. Gmail → Paramètres → Comptes et importation → « Envoyer des e-mails en tant que » → Ajouter.
2. Adresse : `contact@malekbouzarkouna.com`.
3. SMTP : `smtp.resend.com`, port 465 (SSL), utilisateur `resend` (littéral),
   mot de passe : une clé API Resend **dédiée** (Resend → API Keys, ne pas réutiliser celle de Vercel).
4. Gmail envoie un code de vérification à `contact@` → il arrive dans Gmail grâce à la brique 1 → valider.
5. Cocher « Répondre depuis l'adresse à laquelle le message a été envoyé ».

## Contenu (via l'admin `/keystatic`)

- [ ] Remplir la rubrique **Formations** (diplômes, écoles).
- [ ] Écrire des articles de blog (idées : homelab, retour d'expérience Go vs Java, un bug intéressant).
