# Todo App E2E Testing

This project contains end-to-end tests for the Todo application using Playwright and TypeScript.

## Project Structure

```
todo-app-playwright/
├── src/
│   ├── pages/                    # Page Object Model implementation
│   │   ├── base.page.ts         # Base page class with common functionality
│   │   ├── login.page.ts        # Login page object
│   │   ├── todo.page.ts         # Todo page object
│   │   ├── page-factory.ts      # Factory for creating page objects
│   │   └── index.ts             # Exports for all page objects
│   └── selectors/               # Data-id selectors following best practices
│       ├── common.selectors.ts  # Common selectors across the application
│       ├── login.selectors.ts   # Login page specific selectors
│       └── todo.selectors.ts    # Todo app specific selectors
├── tests/
│   ├── fixtures/               # Test fixtures and utilities
│   │   └── auth.ts             # Authentication fixtures
│   ├── todo-critical.test.ts   # Main test suite
│   └── locators.ts             # Legacy locators (deprecated)
├── config/                     # Configuration files
│   └── .env.example           # Environment variables template
└── docs/                      # Documentation
    ├── DATA_ID_SELECTORS_GUIDE.md
    ├── PLAYWRIGHT_BEST_PRACTICES.md
    └── SAFETY_RULES.md
```

## Features

### Page Object Model (POM)
- **BasePage**: Common functionality for all page objects
- **LoginPage**: Login page interactions and validations
- **TodoPage**: Todo app interactions and validations
- **PageFactory**: Factory pattern for creating page objects

### Data-ID Selectors
- All selectors use data-id attributes for stability
- Follow consistent naming conventions
- Support parameterized selectors for dynamic content

### Test Organization
- **Critical flows**: Core user journeys
- **Authentication**: Login/logout functionality
- **Todo operations**: Add, complete, delete, filter todos
- **Error handling**: Invalid credentials, missing data

## Setup

### Prerequisites
- Node.js 18+
- Playwright

### Installation
```bash
npm install
```

### Configuration
1. Copy the environment template:
```bash
cp config/.env.example config/.env.dev
```

2. Update `config/.env.dev` with your test credentials:
```bash
TEST_USER_EMAIL=your-email@example.com
TEST_USER_PASSWORD=your-password
```

### Running Tests

#### Run all tests
```bash
npm test
```

#### Run specific test file
```bash
npx playwright test tests/todo-critical.test.ts
```

#### Run with UI mode
```bash
npx playwright test --ui
```

#### Run with debugging
```bash
npx playwright test --debug
```

#### Run specific test
```bash
npx playwright test -g "user can add a new todo"
```

## Test Coverage

### Critical User Flows
1. **Authentication**
   - User can sign in with valid credentials
   - System handles invalid credentials gracefully
   - Login form validation

2. **Todo Management**
   - Add new todos
   - Complete todos
   - Delete todos
   - Filter todos by status
   - Clear completed todos

3. **Todo Statistics**
   - Todo count updates
   - Remaining todos count
   - Completed todos count

### Test Best Practices

#### Page Object Model
- Each page has its own class with encapsulated functionality
- Private selectors with getter methods
- Reusable methods for common operations
- Clear separation of concerns

#### Data-ID Selectors
- Stable selectors that don't break with UI changes
- Consistent naming conventions
- Parameterized selectors for dynamic content
- Centralized selector management

#### Error Handling
- Proper error messages for failed operations
- Timeout handling for slow operations
- Network idle waiting
- Element visibility validation

#### Test Organization
- Clear test descriptions
- Setup and teardown in beforeEach/afterEach
- Conditional test skipping when credentials are missing
- Comprehensive assertions with meaningful messages

## Development Guidelines

### Adding New Tests
1. Create page objects for new pages in `src/pages/`
2. Add selectors to appropriate selector files in `src/selectors/`
3. Use the PageFactory to create page objects in tests
4. Follow the existing test structure and naming conventions
5. Add appropriate error handling and assertions

### Adding New Page Objects
1. Extend the BasePage class
2. Use private selectors with getter methods
3. Implement page-specific methods
4. Add proper error handling and validation
5. Export the page object in `src/pages/index.ts`

### Adding New Selectors
1. Use data-id attributes for all selectors
2. Follow the naming convention: `data-id="component-name"`
3. Add parameterized selectors for dynamic content
4. Group related selectors in appropriate files
5. Update the selectors guide documentation

## Troubleshooting

### Common Issues

#### Tests fail due to missing credentials
- Ensure `config/.env.dev` exists and contains valid credentials
- Check that the test user exists in the application

#### Tests timeout
- Check network connectivity
- Verify the application is running and accessible
- Increase timeout values if needed

#### Element not found errors
- Verify data-id attributes exist in the application
- Check selector syntax in the selector files
- Use Playwright Inspector to debug selectors

#### Authentication failures
- Verify test credentials are correct
- Check that the test user has the required permissions
- Ensure the login flow hasn't changed

### Debugging Tools

#### Playwright Inspector
```bash
npx playwright test --debug
```

#### Playwright Codegen
```bash
npx playwright codegen https://your-app-url.com
```

#### Screenshot on failure
Screenshots are automatically saved to `screenshots/` directory on test failure.

## Contributing

1. Follow the existing code style and conventions
2. Use meaningful test names and descriptions
3. Add appropriate error handling and assertions
4. Update documentation for new features
5. Run tests locally before submitting changes

## License

This project is licensed under the MIT License.