# Community Strategy Board

A prototype board of peer-contributed strategies for navigating course systems as a
first-year international graduate student at the University of Washington. Built for
usability testing: students choose the difficulty they are facing, read strategies
contributed by students in comparable programs, discuss them, and save a few to try
that quarter.

**Live prototype:** https://raj-ryan.github.io/community-strategy-board/

This is student coursework, not an official University of Washington service. It uses
the UW web colour palette (PMS 273 purple `#39275B`, PMS 117 gold `#C79900`) because the
concept is designed to live inside UW course systems.

## What is in it

- **51 strategies** across **30 graduate programs** in 15 schools and colleges, each one
  a single specific action rather than general advice.
- **Challenge-first browsing.** Concept testing showed a wall of cards makes choosing
  harder, so the board opens with nine strategies and narrows when you pick a difficulty.
- **An expanded view** with the steps, when to use it, what the numbers mean, and a
  discussion thread beside it — questions, experiences, replies.
- **Rankings that name their measure.** Most liked and most saved are kept separate and
  never merged into one score. Strategies are ranked; students are not.
- **My Quarter**, a saved list rather than a workflow to maintain.
- **A contribution form** that puts your strategy on the board immediately, flagged as
  in review until the team approves and publishes it.

State is held in memory, so a refresh returns the prototype to its starting condition.
That is deliberate: it gives every usability-test participant the same first screen.

## Design decisions that came from research

The concept test with two international graduate students (A5) drove several choices:

| Finding | What the interface does |
| --- | --- |
| Participants disagreed about whether likes or continued use was the trustworthy signal | Ranking splits into most liked and most saved, each labelled; likes described as recording interest, not effectiveness |
| One participant wanted the denominator kept visible | Counts always read "161 of 190", never a bare percentage |
| Public recognition felt embarrassing rather than motivating | Strategies are ranked, students are not; no contributor leaderboard, no points, anonymity on every post |
| "Too many cards makes choosing difficult" | Nine strategies on first load, challenge chips carrying counts |
| "I would not open another website" | Framed as a Canvas-linked resource, readable without signing in |
| "My Workflow" was not understood | Replaced with My Quarter, a two-or-three item saved list |

## Running it locally

```bash
npm install
npm run dev
```

Then open the URL Vite prints, usually http://localhost:5173.

To produce a production build:

```bash
npm run build
npm run preview
```

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the site and
publishes it to GitHub Pages. The build sets `GITHUB_PAGES=true` so Vite uses the
`/community-strategy-board/` base path; local builds keep `/`.

## Stack

Vite, React 18, TypeScript, Tailwind CSS v4, lucide-react icons. Application code lives
in `src/app`: `data/` holds the strategies, seeded discussion, search and ranking logic;
`components/` holds the interface.
