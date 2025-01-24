# Site Web Cani-sport-Eure

## 🚀 Structure du projet

Ce projet est basé sur **Next.js** et **Supabase**. Il suit une structure de fichiers organisée pour assurer évolutivité et maintenabilité.

Dans le projet cani-sport-eure, vous retrouverez les dossiers et fichiers suivants :

```bash
/
├── public/
│   ├── assets/
│   │   └── logo.svg
│   │   └── logo.png
│   └── favicon.ico
│   └── robots.txt
│   └── toggle-theme.js
├── src/
│   ├── assets/
│   │   └── icons.ts
│   ├── components/
│   │   └── Header.tsx
│   │   └── Footer.tsx
│   ├── hooks/
│   │   └── useAuth.ts
│   ├── lib/
│   │   └── supabaseClient.ts
│   ├── pages/
│   │   └── api/
│   │       └── auth.ts
│   │   └── index.tsx
│   │   └── about.tsx
│   ├── styles/
│   │   └── globals.css
│   │   └── theme.css
│   └── utils/
│       └── helpers.ts
│   └── types/
│       └── index.ts
└── package.json
```

## 📁 Description des Dossiers

- `public/`
  Contient les fichiers statiques tels que les images, fichiers JavaScript ou autres ressources accessibles depuis la racine de l'application.

- `src/`
  Contient le code principal de l'application.
  - `assets/` : Ressources partagées, comme des icônes ou fichiers statiques de configuration.
  - `components/` : Composants réutilisables de l'interface utilisateur (ex. Header, Footer).
  - `hooks/` : Hooks React personnalisés, notamment pour la gestion de l'authentification.
  - `lib/` : Bibliothèques et clients, comme le client Supabase.
  - `pages/` : Toutes les pages de l'application, suivant les conventions de routage de Next.js.
  - `api/` : Fonctions serverless pour la logique backend.
  - `styles/` : Fichiers CSS globaux ou spécifiques à un thème.
  - `utils/` : Fonctions utilitaires utilisées dans l'ensemble de l'application.
  - `types/` : Types et interfaces pour TypeScript.

## 💻 Tech Stack

**Framework** - [Next.js](https://nextjs.org/)
**Stylisation** - [TailwindCSS](https://tailwindcss.com/)
**Component library** - [DaisyUI](https://daisyui.com/)
**UI/UX** - [Figma](https://figma.com)
**Icons** - [Boxicons](https://boxicons.com/) | [Tablers](https://tabler-icons.io/)
**Formatage du code** - [Prettier](https://prettier.io/)
**Hébergement et déploiement** - [Vercel](https://vercel.com/)

## 🧞 Commandes

All commands are run from the root of the project, from a terminal:

| Command                | Action                                                                                                                           |
| :--------------------- | :------------------------------------------------------------------------------------------------------------------------------- |
| `npm install`          | Installs dependencies                                                                                                            |
| `npm run dev`          | Starts local dev server at `localhost:4321`                                                                                      |
| `npm run build`        | Build your production site to `./dist/`                                                                                          |
| `npm run preview`      | Preview your build locally, before deploying                                                                                     |
| `npm run format:check` | Check code format with Prettier                                                                                                  |
| `npm run format`       | Format codes with Prettier                                                                                                       |
| `npm run sync`         | Generates TypeScript types for all Astro modules. [Learn more](https://docs.astro.build/en/reference/cli-reference/#astro-sync). |
| `npm run cz`           | Commit code changes with commitizen                                                                                              |
| `npm run lint`         | Lint with ESLint                                                                                                                 |
