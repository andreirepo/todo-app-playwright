/**
 * Shared locator patterns for the todo app. Keeps tests DRY and consistent.
 */

/** Placeholder regex for the "new todo" input (login page has different placeholders). */
export const TODO_INPUT_PLACEHOLDER = /what|todo|add|new|type|enter/i;

/** Text shown when login fails. Fail fast when this appears. */
export const INVALID_CREDENTIALS_TEXT = /invalid credentials/i;
