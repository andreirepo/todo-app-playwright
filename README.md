# [WIP] Playwright Test Suite

[![Playwright Tests](https://github.com/andreirepo/todo-app-playwright/actions/workflows/playwright.yml/badge.svg)](https://github.com/andreirepo/todo-app-playwright/actions/workflows/playwright.yml)

This repository contains automated tests for the [Todo App](https://github.com/andreirepo/todo-app) using Playwright.

## What is tested

This test suite validates the functionality of the Todo App available at https://todo.andreiqa.click

- ✅ End-to-end user workflows
- ✅ API endpoints validation
- ✅ Database state verification
- ✅ Automated data seeding

## Running Tests

```bash
pnpm i
pnpm exec playwright install
pnpm test
```
