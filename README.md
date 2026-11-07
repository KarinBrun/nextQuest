# NextQuest

NextQuest is a responsive game discovery web application built with React and the IGDB API. Users can explore video games, search by title, filter by genre and platform, view detailed game information, and create a personal Want to Play list.

The application features a curated selection of popular PC and console games while providing access to the broader IGDB catalog through search and filtering.

## Live Application

NextQuest is deployed on Vercel.

**Live Site:** https://nextquest-o8ec0osi1-classwork1.vercel.app/

## Features

- **Game Discovery:** Browse a curated collection of 20 games across multiple genres.
- **Game Search:** Search the IGDB catalog by game title.
- **Genre and Platform Filters:** Narrow results using genre and platform selections.
- **Game Details:** View game descriptions, ratings, release dates, genres, and supported platforms in a modal.
- **Want to Play List:** Add and remove games from a personal list using React Context.
- **Responsive Design:** Desktop and mobile layouts with navigation adapted for smaller screens.

## Technologies Used

**Frontend**
- React 19
- Vite
- JavaScript (JSX)
- React Router
- SCSS
- Lucide React

**Backend and API**
- Vercel Serverless Functions
- IGDB API
- Twitch OAuth 2.0

**Testing and Development**
- Vitest
- React Testing Library
- ESLint
- Git and GitHub

**Deployment**
- Vercel

## Project Structure

```text
nextquest/
├── api/                 # Vercel serverless API endpoints
├── public/              # Public assets
├── src/
│   ├── assets/          # Images and other assets
│   ├── components/      # Reusable React components
│   ├── context/         # Want to Play state management
│   ├── pages/           # Application pages
│   ├── services/        # IGDB data fetching and normalization
│   ├── styles/          # Shared SCSS styles
│   └── test/            # Test configuration
├── eslint.config.js
├── vite.config.js
└── package.json
```

## Getting Started

### Prerequisites

- Node.js and npm
- A Twitch Developer application with a Client ID and Client Secret
- Vercel CLI for local API development

### Installation

Clone the repository:

```bash
git clone https://github.com/KarinBrun/nextquest.git
cd nextquest
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file in the project root:

```env
TWITCH_CLIENT_ID=your_client_id
TWITCH_CLIENT_SECRET=your_client_secret
```

The Twitch credentials are used by the serverless API endpoints and are not exposed to the React frontend.

### Run Locally

Start the application using Vercel CLI:

```bash
npx vercel dev
```

Open the local URL displayed in the terminal, typically `http://localhost:3000`.

Vercel CLI runs both the React application and the serverless API endpoints.

## Testing

Run the unit tests:

```bash
npm run test -- --run
```

The test suite covers game card rendering, navigation links, and Want to Play list functionality, including adding, removing, and preventing duplicate games.

Run ESLint:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

## API Integration

NextQuest uses the IGDB API to retrieve game information.

Vercel serverless functions handle Twitch authentication and communicate with IGDB. The React frontend requests data through these endpoints rather than accessing IGDB directly.

The application retrieves live game information, including cover images, ratings, descriptions, genres, platforms, and release dates.

## Current Scope

NextQuest was developed as a React course project focused on component-based architecture, API integration, routing, state management, responsive design, and testing.

The Want to Play list is managed in React Context and is stored in memory, meaning it resets when the application is refreshed. User authentication and persistent account storage are not implemented in the current version.

## Author

**Karin Brun**

- Portfolio: https://karinbrun.name
- GitHub: https://github.com/KarinBrun