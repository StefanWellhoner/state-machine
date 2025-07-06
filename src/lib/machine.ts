type State<S extends PropertyKey, G extends PropertyKey> = {
  target: S;
  guards?: G[];
};

type Transition<
  S extends PropertyKey,
  E extends PropertyKey,
  G extends PropertyKey = never,
> = {
  on: {
    [key in E]?: State<S, G>;
  };
};

type StateDef = {
  entry?: () => void;
  exit?: () => void;
};

type Machine<
  S extends PropertyKey,
  E extends PropertyKey,
  G extends PropertyKey = never,
> = {
  id: string;
  initial: S;
  transitions: {
    [key in S]: Transition<S, E, G>;
  };
  guards?: {
    [key in G]: () => boolean;
  };
  states: {
    [key in S]: StateDef;
  };
};

class FSM<
  S extends PropertyKey,
  E extends PropertyKey,
  G extends PropertyKey = never,
> {
  private machine: Machine<S, E, G>;
  state: S;

  constructor(machine: Machine<S, E, G>) {
    this.machine = machine;
    this.state = machine.initial;
  }

  send(event: E) {
    const nextState = this.machine.transitions[this.state].on[event];
    if (nextState) {
      const { target, guards } = nextState;
      let passed = true;

      if (guards) {
        passed = this.validateGuards(guards);
      }

      if (passed) {
        this.machine.states[this.state].exit?.();
        this.state = target;
        this.machine.states[this.state].entry?.();
      }
    } else {
      throw new Error(
        `Invalid transistion from ${this.state.toString()} on ${event.toString()}`,
      );
    }
  }

  private validateGuards(guards: G[]) {
    if (!this.machine.guards) {
      if (guards.length > 0) {
        throw new Error(
          "No guards defined on the machine, but guards array is not empty.",
        );
      }
      return true;
    }
    for (let i = 0; i < guards.length; i++) {
      const guardKey = guards[i];
      const guard = this.machine.guards[guardKey];
      if (!guard) {
        throw new Error(`Guard function '${String(guardKey)}' is not defined`);
      }
      if (!guard()) return false;
    }
    return true;
  }
}

export default FSM;
