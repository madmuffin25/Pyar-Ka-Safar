import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "6927445e8bb50d23fd3a1582", 
  requiresAuth: true // Ensure authentication is required for all operations
});
