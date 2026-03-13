# SkillsBench Task Validator

Upload a task ZIP file and get an automatic validation report against the pre-submission checklist.

## Features

- **38+ automated checks** across 6 categories: file structure, prompt quality, docker/environment, tests, rubrics, and test runner
- **Client-side only** - no data leaves your browser
- **Instant results** with green/red/yellow indicators
- **Heuristic warnings** for subjective checks that may need human review

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Deploy to Vercel

```bash
npx vercel
```

Or connect the repo to Vercel for automatic deployments.

## What it checks

| Section | Checks | Examples |
|---------|--------|---------|
| File Structure | 11 | Required files exist, rubrics.json is valid, skills present |
| Prompt / Instructions | 8 | No file paths, API names, skill names, prescriptive language |
| Environment & Docker | 8 | Bind-mount variables, named volumes, API services, skills |
| Tests | 7 | Test count, case sensitivity, process assertions, redundancy |
| Rubrics | 15 | Self-containedness, process-focused, framing, thresholds |
| Test Runner | 5 | Shebang, mkdir, reward.txt, ctrf.json, exit 0 |
