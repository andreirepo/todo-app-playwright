import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { TodoSelectors } from '../selectors/todo.selectors';

/**
 * Todo page object implementation with data-id selectors
 */
export class TodoPage extends BasePage {
  // Todo form elements
  get todoInput(): Locator {
    return this.page.locator(TodoSelectors.TODO_INPUT);
  }

  get todoSubmitButton(): Locator {
    return this.page.locator(TodoSelectors.TODO_SUBMIT_BUTTON);
  }

  get todoClearButton(): Locator {
    return this.page.locator(TodoSelectors.TODO_CLEAR_BUTTON);
  }

  // Todo list container
  private get todoListContainer(): Locator {
    return this.page.locator(TodoSelectors.TODO_LIST_CONTAINER);
  }

  // Todo filters
  private get filterAll(): Locator {
    return this.page.locator(TodoSelectors.FILTER_ALL);
  }

  private get filterActive(): Locator {
    return this.page.locator(TodoSelectors.FILTER_ACTIVE);
  }

  private get filterCompleted(): Locator {
    return this.page.locator(TodoSelectors.FILTER_COMPLETED);
  }

  private get filterClearCompleted(): Locator {
    return this.page.locator(TodoSelectors.FILTER_CLEAR_COMPLETED);
  }

  // Todo statistics
  private get todoCount(): Locator {
    return this.page.locator(TodoSelectors.TODO_COUNT);
  }

  private get todoRemaining(): Locator {
    return this.page.locator(TodoSelectors.TODO_REMAINING);
  }

  private get todoCompleted(): Locator {
    return this.page.locator(TodoSelectors.TODO_COMPLETED);
  }

  constructor(page: Page) {
    super(page);
  }

  /**
   * Add a new todo item
   */
  async addTodo(todoText: string): Promise<void> {
    await this.todoInput.fill(todoText);
    await this.todoSubmitButton.click();
  }

  /**
   * Clear the todo input field
   */
  async clearTodoInput(): Promise<void> {
    await this.todoClearButton.click();
  }

  /**
   * Get all todo items
   */
  async getAllTodos(): Promise<Locator[]> {
    return await this.todoListContainer.locator(TodoSelectors.TODO_ITEM_CONTAINER).all();
  }

  /**
   * Get todo item by text
   */
  async getTodoByText(todoText: string): Promise<Locator> {
    return this.todoListContainer.locator(TodoSelectors.TODO_ITEM_CONTAINER).filter({
      hasText: todoText
    });
  }

  /**
   * Complete a todo item
   */
  async completeTodo(todoText: string): Promise<void> {
    const todoItem = await this.getTodoByText(todoText);
    const checkbox = todoItem.locator(TodoSelectors.TODO_ITEM_CHECKBOX);
    await checkbox.check();
  }

  /**
   * Delete a todo item
   */
  async deleteTodo(todoText: string): Promise<void> {
    const todoItem = await this.getTodoByText(todoText);
    const deleteButton = todoItem.locator(TodoSelectors.TODO_ITEM_DELETE);
    await deleteButton.click();
  }

  /**
   * Edit a todo item
   */
  async editTodo(todoText: string, newText: string): Promise<void> {
    const todoItem = await this.getTodoByText(todoText);
    const editButton = todoItem.locator(TodoSelectors.TODO_ITEM_EDIT);
    await editButton.click();
    
    const editInput = todoItem.locator('input[type="text"]');
    await editInput.fill(newText);
    await editInput.press('Enter');
  }

  /**
   * Filter todos by status
   */
  async filterTodos(filterType: 'all' | 'active' | 'completed'): Promise<void> {
    switch (filterType) {
      case 'all':
        await this.filterAll.click();
        break;
      case 'active':
        await this.filterActive.click();
        break;
      case 'completed':
        await this.filterCompleted.click();
        break;
    }
  }

  /**
   * Clear completed todos
   */
  async clearCompletedTodos(): Promise<void> {
    await this.filterClearCompleted.click();
  }

  /**
   * Get todo count
   */
  async getTodoCount(): Promise<number> {
    const countText = await this.todoCount.textContent();
    return parseInt(countText || '0', 10);
  }

  /**
   * Get remaining todos count
   */
  async getRemainingTodosCount(): Promise<number> {
    const countText = await this.todoRemaining.textContent();
    return parseInt(countText || '0', 10);
  }

  /**
   * Get completed todos count
   */
  async getCompletedTodosCount(): Promise<number> {
    const countText = await this.todoCompleted.textContent();
    return parseInt(countText || '0', 10);
  }

  /**
   * Verify todo is visible
   */
  async isTodoVisible(todoText: string): Promise<boolean> {
    const todoItem = await this.getTodoByText(todoText);
    return await todoItem.isVisible();
  }

  /**
   * Verify todo is completed
   */
  async isTodoCompleted(todoText: string): Promise<boolean> {
    const todoItem = await this.getTodoByText(todoText);
    const checkbox = todoItem.locator(TodoSelectors.TODO_ITEM_CHECKBOX);
    return await checkbox.isChecked();
  }

  /**
   * Verify todo list is loaded
   */
  async verifyTodoListLoaded(): Promise<void> {
    await this.waitForElementVisible(this.todoListContainer);
    await this.waitForElementVisible(this.todoInput);
    await this.waitForElementVisible(this.todoSubmitButton);
  }
}