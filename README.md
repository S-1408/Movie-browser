# Movie Browser

A movie discovery app built with **Next.js 16 (App Router)**, **React 19**, **TypeScript** and **Tailwind CSS v4**, powered by the [TMDB API](https://www.themoviedb.org/documentation/api).

## Features

- **Trending movies** – home page shows this week's trending titles
- **Movie details** – poster, overview, ratings, genres and an embedded YouTube trailer (lazy-loaded)
- **Search** – find movies by title, with pagination and an empty state for no results
- **Browse by genre** – genre list with paginated results for each genre
- **Light & dark mode**
- **Loading, error and 404 pages** using App Router conventions
- **Server-side data fetching with caching** – responses are revalidated per endpoint (e.g. trending hourly, genres/details daily, search uncached)

## Tech Stack

| Area      | Tool                       |
| --------- | -------------------------- |
| Framework | Next.js 16 (App Router)    |
| UI        | React 19, Tailwind CSS v4  |
| Language  | TypeScript                 |
| Data      | TMDB API v3                |

## Getting Started

### Prerequisites

- Node.js 20+
- A free TMDB account and an **API Read Access Token** (v4 auth) from [TMDB settings → API](https://www.themoviedb.org/settings/api)

### Installation

```bash
git clone https://github.com/S-1408/Movie-browser.git
cd Movie-browser/movie-browser
npm install
```

### Environment variables

Create a `.env.local` file inside `movie-browser/`:

```env
TMDB_API_TOKEN=your_tmdb_read_access_token
```

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Other scripts

```bash
npm run build   # production build
npm run start   # run the production build
npm run lint    # lint with ESLint
```

## Project Structure

```
movie-browser/src
├── app/
│   ├── page.tsx              # Home – trending movies
│   ├── movie/[id]/           # Movie detail page + loading state
│   ├── genre/[id]/           # Movies by genre
│   ├── search/               # Search results
│   ├── error.tsx             # Error boundary
│   ├── loading.tsx           # Global loading UI
│   └── not-found.tsx         # 404 page
├── components/               # Navbar, SearchBar, MovieCard, MovieGrid, GenreList, Pagination
├── lib/tmdb.ts               # TMDB fetch helper and API functions
├── types/movie.ts            # TypeScript types for TMDB responses
└── utils/                    # URL builders, image/trailer helpers, pagination
```

## Deployment

The app can be deployed to [Vercel](https://vercel.com). Set the root directory to `movie-browser` and add `TMDB_API_TOKEN` under **Project Settings → Environment Variables**.

## Credits

This product uses the TMDB API but is not endorsed or certified by TMDB.
