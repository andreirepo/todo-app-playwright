# Cursor setup for this project

## Playwright MCP (`mcp.json`)

The [Playwright MCP](https://www.npmjs.com/package/@playwright/mcp) server is configured so the AI can control a real browser from chat.

### Why it helps

| Benefit | What it does |
|--------|----------------|
| **See the app** | Uses accessibility snapshots of pages (no screenshots), so the model understands structure, roles, and labels. |
| **Generate tests from the UI** | You can say “add a test for the login form” and the AI can navigate to the page and write tests that match real selectors and behavior. |
| **Debug failing tests** | The AI can open the same URL, inspect the DOM, and suggest fixes (e.g. better locators or waits). |
| **Exploration** | Ask to “open the todo app and list what’s on the page” to drive discovery and test ideas. |
| **Consistency with your stack** | Same Playwright runtime as your existing E2E tests, so generated code fits your `playwright.config.ts` and patterns. |

After reloading Cursor, use the Playwright tools from chat (e.g. “Use Playwright to open BASE_URL and describe the page”) or let the agent suggest them when relevant.

**Requirement:** Playwright browsers must be installed (`pnpm exec playwright install` or `npx playwright install`).

---

## After-file-edit hook (`hooks.json` + `after-file-edit.js`)

Runs `pnpm exec playwright test <file>` when the agent creates or edits a test file (`*.test.ts`, `*.spec.ts`, or under `tests/`). See `after-file-edit.js` for details.
