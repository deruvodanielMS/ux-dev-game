// Global type declarations for E2E tests
declare global {
  interface Window {
    __mockAuth0?: {
      isAuthenticated: boolean;
      user: {
        sub: string;
        name: string;
        email: string;
        picture: string;
      } | null;
    };
  }
}

export {};
