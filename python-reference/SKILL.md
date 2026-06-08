---
name: python-reference
description: >
  Griff's curated Python ops toolkit. Load this when choosing Python libraries,
  building local scripts, planning data cleanup, RSS/feed workflows, Google
  Sheets work, scraping/crawling, scheduling, local storage, or skill/workflow
  references. This includes only the approved "keep" items from the Python Ops
  Toolkit Cards.
---

# Python Reference

## Purpose

Use this as the first-pass library guide for practical Python workflow builds.
Prefer these tools before broad package searching unless the task clearly needs
something else.

## Keep Stack

### pandas

Default for CSV cleanup, dedupe, joins, export maps, and spreadsheet prep.

- Use for table shaping before Airtable, Google Sheets, or CSV exports.
- Pair with `openpyxl` for Excel work.
- Keep scripts explicit and boring.

### feedparser

Default for RSS and Atom ingestion.

- Use to collect feed entries into JSON or CSV.
- Enrich feed entries with article extraction when needed.
- Good MCP candidates: `read_feed`, `summarize_feed`, and `watch_feed`.

### gspread

Lightweight Google Sheets API for CLI scripts and import/export helpers.

- Use when a script needs simple spreadsheet read/write behavior.
- Use `google-api-python-client` for broader Google APIs such as Drive or Gmail.
- Expect OAuth scopes to be the real setup work.

### Scrapy

Use for serious crawling.

- Best when there are many pages, pagination, queues, retries, or structured
  extraction.
- Overkill for one page or a few links.
- Pair with a focused extraction library when the output needs clean article text.

### MechanicalSoup

Use for simple website interactions.

- Good for basic forms, links, and sessions.
- Do not use for JavaScript-heavy sites.
- Escalate to Playwright when the page behaves like an app.

### APScheduler / schedule

Use for local recurring jobs before reaching for heavier orchestration.

- Use `schedule` for tiny scripts.
- Use `APScheduler` for more control and persistence.
- Use cron or launchd when the operating system should own the job.

### TinyDB / SQLite

Use for local storage.

- TinyDB is fine for prototypes and simple JSON document stores.
- SQLite is usually better for durable local ledgers, contacts, and queryable
  project databases.
- Avoid pickleDB for anything that needs serious querying.

### google/skills + pm-skills

Use as references for skill packaging and workflow design.

- Mine these repositories for structure and workflow patterns.
- Do not install whole skill bundles casually.
- Install only specific skills that pass risk review.

## Build Bias

Start small:

1. Pick the narrowest tool that solves the task.
2. Build a local script or MCP tool around the workflow.
3. Add scheduling or persistence only when the workflow repeats.
4. Add orchestration only when jobs become a system.
