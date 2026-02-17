/**
 * Todo app specific selectors
 */
export class TodoSelectors {
  // Todo form
  static readonly TODO_INPUT = '[data-id="todo-input"]';
  static readonly TODO_SUBMIT_BUTTON = '[data-id="todo-submit"]';
  static readonly TODO_CLEAR_BUTTON = '[data-id="todo-clear"]';

  // Todo list
  static readonly TODO_LIST_CONTAINER = '[data-id="todo-list-container"]';
  static readonly TODO_ITEM_CONTAINER = '[data-id="todo-item-container"]';
  static readonly TODO_ITEM_TEXT = '[data-id="todo-item-text"]';
  static readonly TODO_ITEM_CHECKBOX = '[data-id="todo-item-checkbox"]';
  static readonly TODO_ITEM_DELETE = '[data-id="todo-item-delete"]';
  static readonly TODO_ITEM_EDIT = '[data-id="todo-item-edit"]';

  // Todo filters
  static readonly FILTER_ALL = '[data-id="filter-all"]';
  static readonly FILTER_ACTIVE = '[data-id="filter-active"]';
  static readonly FILTER_COMPLETED = '[data-id="filter-completed"]';
  static readonly FILTER_CLEAR_COMPLETED = '[data-id="filter-clear-completed"]';

  // Todo statistics
  static readonly TODO_COUNT = '[data-id="todo-count"]';
  static readonly TODO_REMAINING = '[data-id="todo-remaining"]';
  static readonly TODO_COMPLETED = '[data-id="todo-completed"]';
}