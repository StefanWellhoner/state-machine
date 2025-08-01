import FSM, { Machine } from "./machine";

type TestStates = "state1" | "state2" | "state3"
type TestEvents = "transition1" | "transition2" | "transition3"
type TestGuards = "guard1" | "guard2"
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
    }, state3: {}
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

describe("Machine", () => {
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
})
