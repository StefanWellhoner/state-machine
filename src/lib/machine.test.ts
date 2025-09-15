import FSM, { Machine } from "./machine";

type TestStates = "state1" | "state2" | "state3";
type TestEvents = "transition1" | "transition2" | "transition3";
type TestGuards = "guard1" | "guard2";
const mockedEntry = jest.fn();
const mockedExit = jest.fn();
const mockedGuard1 = jest.fn().mockReturnValue(true);
const mockedGuard2 = jest.fn().mockReturnValue(false);
const machine: Machine<TestStates, TestEvents, TestGuards> = {
  id: "test-machine",
  initial: "state1",
  states: {
    state1: {
      entry() {
        mockedEntry()
      },
      exit() {
        mockedExit()
      }
    },
    state2: {
    },
    state3: {}
  },
  transitions: {
    state1: {
      on: {
        transition1: { target: "state2", guards: ["guard1"] }
      }
    },
    state2: {
      on: {
        transition2: { target: "state3", guards: ["guard2"] }
      }
    },
    state3: {
      on: {
        transition3: { target: "state1" }
      }
    }
  },
  guards: {
    guard1: () => mockedGuard1(),
    guard2: () => mockedGuard2(),
  },
}

// Context-aware machine types and setup
type ContextTestStates = "idle" | "loading" | "success" | "error";
type ContextTestEvents = "start" | "succeed" | "fail" | "reset";
type ContextTestGuards = "hasData" | "isAuthorized";

interface TestContext {
  data?: any;
  isAuthenticated: boolean;
  userId?: string;
}

const mockedContextEntry = jest.fn();
const mockedContextExit = jest.fn();
const mockedContextGuard = jest.fn();

const contextMachine: Machine<ContextTestStates, ContextTestEvents, ContextTestGuards, TestContext> = {
  id: "context-test-machine",
  initial: "idle",
  states: {
    idle: {
      entry(context) {
        mockedContextEntry('idle', context);
      }
    },
    loading: {
      entry(context) {
        mockedContextEntry('loading', context);
      },
      exit(context) {
        mockedContextExit('loading', context);
      }
    },
    success: {
      entry(context) {
        mockedContextEntry('success', context);
      }
    },
    error: {
      entry(context) {
        mockedContextEntry('error', context);
      }
    }
  },
  transitions: {
    idle: {
      on: {
        start: { target: "loading", guards: ["isAuthorized"] }
      }
    },
    loading: {
      on: {
        succeed: { target: "success", guards: ["hasData"] },
        fail: { target: "error" }
      }
    },
    success: {
      on: {
        reset: { target: "idle" }
      }
    },
    error: {
      on: {
        reset: { target: "idle" }
      }
    }
  },
  guards: {
    hasData: (context) => {
      mockedContextGuard('hasData', context);
      return !!context?.data;
    },
    isAuthorized: (context) => {
      mockedContextGuard('isAuthorized', context);
      return !!context?.isAuthenticated;
    },
  },
}

describe("Machine", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns an instance of FSM on constructor call", () => {
    const testMachine = new FSM<TestStates, TestEvents, TestGuards>(machine)
    expect(testMachine).toBeInstanceOf(FSM)
  })

  it("initializes with the correct initial state", () => {
    const testMachine = new FSM<TestStates, TestEvents, TestGuards>(machine)
    expect(testMachine.state).toBe("state1")
  })

  describe("transition", () => {
    it("transitions to the next state on valid event", () => {
      const testMachine = new FSM<TestStates, TestEvents, TestGuards>(machine)
      testMachine.send("transition1")
      expect(testMachine.state).toBe("state2")
    });

    it("throws an error when transitioning with invalid transition", () => {
      const testMachine = new FSM<TestStates, TestEvents, TestGuards>(machine)
      expect(() => testMachine.send("transition3")).toThrow(
        "Invalid transition from state1 on transition3"
      );
      expect(testMachine.state).toBe("state1");
    });
  })

  describe("state entry and exit", () => {
    it("calls entry function on entering a state", () => {
      const state1EntrySpy = jest.spyOn(machine.states.state1, "entry")
      const testMachine = new FSM<TestStates, TestEvents, TestGuards>(machine)
      testMachine.send("transition1")
      expect(state1EntrySpy).toHaveBeenCalled()
      expect(mockedEntry).toHaveBeenCalled()
    });

    it("calls exit function on exiting a state", () => {
      const state1ExitSpy = jest.spyOn(machine.states.state1, "exit")
      const testMachine = new FSM<TestStates, TestEvents, TestGuards>(machine)
      testMachine.send("transition1")
      expect(state1ExitSpy).toHaveBeenCalled()
      expect(mockedExit).toHaveBeenCalled()
    });
  })

  describe("guards", () => {
    it("allows transition if guard condition is met", () => {
      const testMachine = new FSM<TestStates, TestEvents, TestGuards>(machine)
      testMachine.send("transition1")
      expect(testMachine.state).toBe("state2")
    });

    it("prevents transition if guard condition is not met", () => {
      const testMachine = new FSM<TestStates, TestEvents, TestGuards>(machine)
      testMachine.send("transition1")
      testMachine.send("transition2")
      expect(mockedGuard1).toHaveBeenCalled();
      expect(mockedGuard2).toHaveBeenCalled();
      expect(testMachine.state).toBe("state2");
    });
  })

  describe("context support", () => {
    it("initializes with context and passes context to entry action", () => {
      const initialContext: TestContext = { isAuthenticated: true, userId: "123" };
      const testMachine = new FSM(contextMachine, initialContext);
      
      expect(testMachine.context).toEqual(initialContext);
      expect(mockedContextEntry).toHaveBeenCalledWith('idle', initialContext);
    });

    it("passes context to guards during transitions", () => {
      const context: TestContext = { isAuthenticated: true, userId: "123" };
      const testMachine = new FSM(contextMachine, context);
      
      testMachine.send("start");
      
      expect(mockedContextGuard).toHaveBeenCalledWith('isAuthorized', context);
      expect(testMachine.state).toBe("loading");
    });

    it("prevents transition when guard fails with context", () => {
      const context: TestContext = { isAuthenticated: false };
      const testMachine = new FSM(contextMachine, context);
      
      testMachine.send("start");
      
      expect(mockedContextGuard).toHaveBeenCalledWith('isAuthorized', context);
      expect(testMachine.state).toBe("idle");
    });

    it("passes context to entry and exit actions during transitions", () => {
      const context: TestContext = { isAuthenticated: true, data: { test: true } };
      const testMachine = new FSM(contextMachine, context);
      
      // Start transition (idle -> loading)
      testMachine.send("start");
      expect(mockedContextEntry).toHaveBeenCalledWith('loading', context);
      
      // Success transition (loading -> success)
      testMachine.send("succeed");
      expect(mockedContextExit).toHaveBeenCalledWith('loading', context);
      expect(mockedContextEntry).toHaveBeenCalledWith('success', context);
      expect(testMachine.state).toBe("success");
    });

    it("allows context updates", () => {
      const initialContext: TestContext = { isAuthenticated: false };
      const testMachine = new FSM(contextMachine, initialContext);
      
      const updatedContext: TestContext = { isAuthenticated: true, userId: "456" };
      testMachine.updateContext(updatedContext);
      
      expect(testMachine.context).toEqual(updatedContext);
      
      // Now transition should work since user is authenticated
      testMachine.send("start");
      expect(testMachine.state).toBe("loading");
    });

    it("works without context (backward compatibility)", () => {
      const testMachine = new FSM(contextMachine);
      
      expect(testMachine.context).toBeUndefined();
      expect(mockedContextEntry).toHaveBeenCalledWith('idle', undefined);
      
      // Should not be able to start without authentication
      testMachine.send("start");
      expect(testMachine.state).toBe("idle");
    });

    it("guards receive undefined when no context is provided", () => {
      const testMachine = new FSM(contextMachine);
      
      testMachine.send("start");
      expect(mockedContextGuard).toHaveBeenCalledWith('isAuthorized', undefined);
    });
  })
})
