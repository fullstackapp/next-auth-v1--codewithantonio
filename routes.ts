/**
 * An array of routes that are accessible without authentication.
 * Available for logged-in and logged-out users
 * @type {string[]}
 */
export const publicRoutes = ['/', '/auth/new-verification'];

/**
 * An array of routes that require authentication.
 * These routes will redirect logged-in users to /settings.
 * Only available for logged-out users.
 * @type {string[]}
 */
export const authRoutes = [
  '/auth/login',
  '/auth/register',
  '/auth/error',
  '/auth/reset',
  '/auth/new-password',
];

/**
 * The prefix for API authentication routes.
 * Routes that start with this prefix are used for API authentication purposes.
 * @type {string}
 */
export const apiAuthPrefix = '/api/auth';

/**
 * Default redirect path after successful login.
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = '/settings';
