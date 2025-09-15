# State Machine with Context Support

A lightweight, type-safe finite state machine implementation with context support for JavaScript/TypeScript.

## Features

- ✅ Type-safe state definitions
- ✅ Guard functions for conditional transitions  
- ✅ Entry/exit actions for states
- ✅ Context support for shared state across actions and guards
- ✅ Backward compatibility with existing machines
- ✅ Zero dependencies

## Installation

```bash
bun install
```

## Basic Usage

### Simple State Machine (No Context)

```typescript
import FSM from './src/lib/machine';

type States = "idle" | "loading" | "success";
type Events = "start" | "complete";

const machine = new FSM({
  id: "simple-machine",
  initial: "idle",
  states: {
    idle: {},
    loading: {},
    success: {}
  },
  transitions: {
    idle: {
      on: { start: { target: "loading" } }
    },
    loading: {
      on: { complete: { target: "success" } }
    },
    success: {
      on: { start: { target: "loading" } }
    }
  }
});

machine.send("start"); // transitions to "loading"
```

### Context-Aware State Machine

```typescript
import FSM from './src/lib/machine';

interface AuthContext {
  username?: string;
  token?: string;
  attempts: number;
}

const authMachine = new FSM({
  id: "auth-machine", 
  initial: "idle",
  states: {
    idle: {
      entry: (context) => console.log("Ready to authenticate")
    },
    authenticated: {
      entry: (context) => console.log(`Welcome ${context?.username}!`)
    }
  },
  transitions: {
    idle: {
      on: { 
        login: { 
          target: "authenticated", 
          guards: ["hasCredentials"] 
        } 
      }
    }
  },
  guards: {
    hasCredentials: (context) => {
      return !!(context?.username && context.attempts < 3);
    }
  }
}, { username: "admin", attempts: 0 }); // Initialize with context

// Update context
authMachine.updateContext({ 
  ...authMachine.context!, 
  username: "newuser" 
});

authMachine.send("login");
```

## Context Features

### Guards with Context
Guards can access context to make conditional decisions:

```typescript
guards: {
  hasValidData: (context) => {
    return context?.data && context.data.length > 0;
  },
  isAuthorized: (context) => {
    return context?.user?.role === "admin";
  }
}
```

### Actions with Context
Entry and exit actions receive context:

```typescript
states: {
  loading: {
    entry: (context) => {
      console.log(`Loading data for user: ${context?.userId}`);
    },
    exit: (context) => {
      console.log(`Finished loading`);
    }
  }
}
```

### Context Updates
Update context during runtime:

```typescript
machine.updateContext({
  ...machine.context,
  newProperty: "value"
});
```

## Development

To start a development server:

```bash
bun dev
```

To run tests:

```bash
npm test
```

To run for production:

```bash
bun start
```

This project was created using `bun init` in bun v1.2.17. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
