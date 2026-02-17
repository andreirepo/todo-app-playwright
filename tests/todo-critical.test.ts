import { test, expect } from '@playwright/test';
import { signIn } from './fixtures/auth';
import { PageFactory } from '../src/pages/page-factory';

const skipWithoutCredentials = () =>
  !process.env.TEST_USER_EMAIL || !process.env.TEST_USER_PASSWORD;

test.describe('Todo app – critical flows', () => {
  let loginPage: import('../src/pages/login.page').LoginPage;
  let todoPage: import('../src/pages/todo.page').TodoPage;

  test.beforeEach(async ({ page }, testInfo) => {
    if (skipWithoutCredentials()) {
      testInfo.skip(true, 'Requires TEST_USER_EMAIL and TEST_USER_PASSWORD in config/.env.dev');
      return;
    }
    
    loginPage = PageFactory.createLoginPage(page);
    todoPage = PageFactory.createTodoPage(page);
    
    await signIn(page);
  });

  test('user can sign in and sees the todo app', async ({ page }) => {
    // Verify todo app is loaded and ready
    await todoPage.verifyTodoListLoaded();
    
    // Verify todo input is visible and ready for interaction
    await expect(todoPage.todoInput).toBeVisible({ timeout: 5000 });
    await expect(todoPage.todoInput).toBeEnabled({ timeout: 5000 });
  });

  test('user can add a new todo and it appears in the list', async ({ page }) => {
    const newTodoText = `E2E test todo ${Date.now()}`;
    
    // Verify todo input is ready
    await expect(todoPage.todoInput).toBeVisible({ timeout: 5000 });
    await expect(todoPage.todoInput).toBeEnabled({ timeout: 5000 });
    
    // Add new todo
    await todoPage.addTodo(newTodoText);
    
    // Verify todo appears in the list
    const isTodoVisible = await todoPage.isTodoVisible(newTodoText);
    expect(isTodoVisible).toBe(true);
    
    // Additional verification - check todo count increased
    const initialCount = await todoPage.getTodoCount();
    expect(initialCount).toBeGreaterThan(0);
  });

  test('user can complete a todo', async ({ page }) => {
    const newTodoText = `Complete me ${Date.now()}`;
    
    // Verify todo input is ready
    await expect(todoPage.todoInput).toBeVisible({ timeout: 5000 });
    await expect(todoPage.todoInput).toBeEnabled({ timeout: 5000 });
    
    // Add new todo
    await todoPage.addTodo(newTodoText);
    
    // Verify todo appears in the list
    const isTodoVisible = await todoPage.isTodoVisible(newTodoText);
    expect(isTodoVisible).toBe(true);
    
    // Complete the todo
    await todoPage.completeTodo(newTodoText);
    
    // Verify todo is marked as completed
    const isTodoCompleted = await todoPage.isTodoCompleted(newTodoText);
    expect(isTodoCompleted).toBe(true);
    
    // Verify todo count statistics are updated
    const completedCount = await todoPage.getCompletedTodosCount();
    expect(completedCount).toBeGreaterThan(0);
  });

  test('user can delete a todo', async ({ page }) => {
    const newTodoText = `Delete me ${Date.now()}`;
    
    // Verify todo input is ready
    await expect(todoPage.todoInput).toBeVisible({ timeout: 5000 });
    await expect(todoPage.todoInput).toBeEnabled({ timeout: 5000 });
    
    // Add new todo
    await todoPage.addTodo(newTodoText);
    
    // Verify todo appears in the list
    const isTodoVisibleBefore = await todoPage.isTodoVisible(newTodoText);
    expect(isTodoVisibleBefore).toBe(true);
    
    // Delete the todo
    await todoPage.deleteTodo(newTodoText);
    
    // Verify todo is no longer visible
    const isTodoVisibleAfter = await todoPage.isTodoVisible(newTodoText);
    expect(isTodoVisibleAfter).toBe(false);
  });

  test('user can filter todos by status', async ({ page }) => {
    const todo1 = `Todo 1 ${Date.now()}`;
    const todo2 = `Todo 2 ${Date.now()}`;
    
    // Add todos
    await todoPage.addTodo(todo1);
    await todoPage.addTodo(todo2);
    
    // Complete first todo
    await todoPage.completeTodo(todo1);
    
    // Test completed filter
    await todoPage.filterTodos('completed');
    const isTodo1Visible = await todoPage.isTodoVisible(todo1);
    const isTodo2Visible = await todoPage.isTodoVisible(todo2);
    expect(isTodo1Visible).toBe(true);
    expect(isTodo2Visible).toBe(false);
    
    // Test active filter
    await todoPage.filterTodos('active');
    const isTodo1VisibleAfter = await todoPage.isTodoVisible(todo1);
    const isTodo2VisibleAfter = await todoPage.isTodoVisible(todo2);
    expect(isTodo1VisibleAfter).toBe(false);
    expect(isTodo2VisibleAfter).toBe(true);
    
    // Test all filter
    await todoPage.filterTodos('all');
    const isTodo1VisibleAll = await todoPage.isTodoVisible(todo1);
    const isTodo2VisibleAll = await todoPage.isTodoVisible(todo2);
    expect(isTodo1VisibleAll).toBe(true);
    expect(isTodo2VisibleAll).toBe(true);
  });

  test('user can clear completed todos', async ({ page }) => {
    const todo1 = `Todo 1 ${Date.now()}`;
    const todo2 = `Todo 2 ${Date.now()}`;
    
    // Add todos
    await todoPage.addTodo(todo1);
    await todoPage.addTodo(todo2);
    
    // Complete both todos
    await todoPage.completeTodo(todo1);
    await todoPage.completeTodo(todo2);
    
    // Verify both are completed
    const isTodo1Completed = await todoPage.isTodoCompleted(todo1);
    const isTodo2Completed = await todoPage.isTodoCompleted(todo2);
    expect(isTodo1Completed).toBe(true);
    expect(isTodo2Completed).toBe(true);
    
    // Clear completed todos
    await todoPage.clearCompletedTodos();
    
    // Verify todos are no longer visible
    const isTodo1Visible = await todoPage.isTodoVisible(todo1);
    const isTodo2Visible = await todoPage.isTodoVisible(todo2);
    expect(isTodo1Visible).toBe(false);
    expect(isTodo2Visible).toBe(false);
  });
});