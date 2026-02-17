/**
 * Common selectors for global elements across the application
 */
export class CommonSelectors {
  // Header elements
  static readonly HEADER = '[data-id="header"]';
  static readonly LOGO = '[data-id="logo"]';
  static readonly USER_MENU = '[data-id="user-menu"]';
  static readonly NOTIFICATION_ICON = '[data-id="notification-icon"]';

  // Footer elements
  static readonly FOOTER = '[data-id="footer"]';
  static readonly COPYRIGHT_TEXT = '[data-id="copyright"]';

  // Modal elements
  static readonly MODAL_OVERLAY = '[data-id="modal-overlay"]';
  static readonly MODAL_CONTENT = '[data-id="modal-content"]';
  static readonly MODAL_TITLE = '[data-id="modal-title"]';

  // Form elements
  static readonly FORM_FIELD = (fieldName: string) => 
    `[data-id="form-field"][data-name="${fieldName}"]`;
  static readonly FORM_ERROR = (fieldName: string) => 
    `[data-id="form-error"][data-field="${fieldName}"]`;
  static readonly SUBMIT_BUTTON = '[data-id="submit-button"]';
  static readonly CANCEL_BUTTON = '[data-id="cancel-button"]';

  // Loading states
  static readonly SPINNER = '[data-id="spinner"]';
  static readonly PROGRESS_BAR = '[data-id="progress-bar"]';

  // Navigation
  static readonly BREADCRUMB = '[data-id="breadcrumb"]';
  static readonly PAGINATION = '[data-id="pagination"]';
  static readonly SEARCH_INPUT = '[data-id="search-input"]';
}