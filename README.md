# Playwright Test Suite

[![CI: E2E Tests on Code Changes](https://github.com/andreirepo/todo-app-playwright/actions/workflows/playwright-e2e.yml/badge.svg)](https://github.com/andreirepo/todo-app-playwright/actions/workflows/playwright-e2e.yml)

Automated tests for [Todo App](https://github.com/andreirepo/todo-app) using Playwright.

## Quick Start

```bash
pnpm i
pnpm exec playwright install
pnpm test
```

## Test User Setup

For critical E2E tests, create a test user at [todo.andreiqa.click](https://todo.andreiqa.click/) and set in `config/.env.dev`:
- `TEST_USER_EMAIL`
- `TEST_USER_PASSWORD`

## Test Coverage

- ✅ End-to-end user workflows
- ✅ API endpoints validation
- ✅ Database state verification

## Reports

View test results: `pnpm test:report`
