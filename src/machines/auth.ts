import FSM, { Machine } from "@/lib/machine";

// Example: Authentication state machine with context
export type AuthStates = "idle" | "authenticating" | "authenticated" | "failed";
export type AuthEvents = "login" | "logout" | "retry" | "timeout";
export type AuthGuards = "hasCredentials" | "isTokenValid";

export interface AuthContext {
  username?: string;
  password?: string;
  token?: string;
  attempts: number;
  maxAttempts: number;
  lastError?: string;
}

const authMachineDefinition: Machine<AuthStates, AuthEvents, AuthGuards, AuthContext> = {
  id: "auth-machine",
  initial: "idle",
  states: {
    idle: {
      entry: (context) => {
        console.log("Ready to authenticate");
        if (context) {
          context.lastError = undefined;
        }
      },
    },
    authenticating: {
      entry: (context) => {
        console.log(`Authenticating user: ${context?.username || "Unknown"}`);
        console.log(`Attempt ${(context?.attempts || 0) + 1} of ${context?.maxAttempts || 3}`);
      },
    },
    authenticated: {
      entry: (context) => {
        console.log(`Welcome, ${context?.username}!`);
        if (context) {
          context.password = undefined; // Clear sensitive data
          context.attempts = 0; // Reset attempts on success
        }
      },
    },
    failed: {
      entry: (context) => {
        if (context) {
          context.attempts += 1; // Increment attempts on failure
        }
        
        const attempts = context?.attempts || 0;
        const maxAttempts = context?.maxAttempts || 3;
        
        if (attempts >= maxAttempts) {
          console.log("Maximum authentication attempts reached. Account locked.");
          if (context) {
            context.lastError = "Account locked due to too many failed attempts";
          }
        } else {
          console.log(`Authentication failed. ${maxAttempts - attempts} attempts remaining.`);
          if (context) {
            context.lastError = "Invalid credentials";
          }
        }
      },
    },
  },
  transitions: {
    idle: {
      on: {
        login: {
          target: "authenticating",
          guards: ["hasCredentials"],
        },
      },
    },
    authenticating: {
      on: {
        login: {
          target: "authenticated",
          guards: ["isTokenValid"],
        },
        timeout: {
          target: "failed",
        },
      },
    },
    authenticated: {
      on: {
        logout: {
          target: "idle",
        },
      },
    },
    failed: {
      on: {
        retry: {
          target: "authenticating",
          guards: ["hasCredentials"],
        },
        logout: {
          target: "idle",
        },
      },
    },
  },
  guards: {
    hasCredentials: (context) => {
      const hasUsername = !!(context?.username && context.username.length > 0);
      const hasPassword = !!(context?.password && context.password.length > 0);
      const belowMaxAttempts = (context?.attempts || 0) < (context?.maxAttempts || 3);
      
      return hasUsername && hasPassword && belowMaxAttempts;
    },
    isTokenValid: (context) => {
      // Simulate token validation based on context
      const validCredentials = 
        context?.username === "admin" && context?.password === "password123";
      
      if (validCredentials && context) {
        context.token = "mock-jwt-token-" + Date.now();
        return true;
      }
      
      return false;
    },
  },
};

export default authMachineDefinition;

// Example usage:
// const initialContext: AuthContext = {
//   username: "",
//   password: "",
//   attempts: 0,
//   maxAttempts: 3,
// };
// 
// const auth = new FSM(authMachine, initialContext);
// 
// // Update context with credentials
// auth.updateContext({
//   ...auth.context!,
//   username: "admin",
//   password: "password123"
// });
// 
// auth.send("login"); // Will transition to authenticating
// auth.send("login"); // Will transition to authenticated if credentials are valid