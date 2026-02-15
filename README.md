# [WIP] Playwright Test Suite

[![Playwright Tests](https://github.com/andreirepo/todo-app-playwright/actions/workflows/playwright.yml/badge.svg)](https://github.com/andreirepo/todo-app-playwright/actions/workflows/playwright.yml)

This repository contains automated tests for the [Todo App](https://github.com/andreirepo/todo-app) using Playwright.

## What is tested

This test suite validates the functionality of the Todo App available at https://todo.andreiqa.click

- ✅ End-to-end user workflows
- ✅ API endpoints validation
- ✅ Database state verification
- ✅ Automated data seeding

## Test user (for critical E2E tests)

The critical todo flows (sign-in, add todo, complete todo) use a **dedicated test user** so tests don’t depend on shared or ad‑hoc accounts.

1. **Register** a user at [https://todo.andreiqa.click/](https://todo.andreiqa.click/) via **Create an account**.
2. **Copy** `config/.env.example` to `config/.env.dev`.
3. **Set** in `config/.env.dev`:
   - `TEST_USER_EMAIL` – email of that user
   - `TEST_USER_PASSWORD` – password

If `TEST_USER_EMAIL` or `TEST_USER_PASSWORD` are missing, the critical tests in `tests/todo-critical.test.ts` are skipped.

## Running Tests

```bash
pnpm i
pnpm exec playwright install
pnpm test
```

To open the last HTML report after a run: `pnpm test:report` (or `pnpm exec playwright show-report`).

## Troubleshooting test failures

### "Executable doesn't exist" / "chromium_headless_shell"

Playwright browsers are not installed. Run:

```bash
pnpm exec playwright install
```

On a self-hosted CI runner, ensure this step runs and has network access to download browsers. If the runner is ephemeral or was reset, re-run the workflow so the install step runs again.

### Invalid credentials

If the app shows "Invalid credentials", the test run **fails immediately** with a clear error (no 15s wait). Fix `TEST_USER_EMAIL` and `TEST_USER_PASSWORD` in `config/.env.dev` and ensure the user exists at the app.

### Critical tests skipped

If you see "Requires TEST_USER_EMAIL and TEST_USER_PASSWORD in config/.env.dev", set those in `config/.env.dev` locally. In CI, configure the repo variables `TEST_USER_EMAIL` and `TEST_USER_PASSWORD` (or use a secrets file) and pass them into the "Run Playwright tests" step so the critical todo flows run.
