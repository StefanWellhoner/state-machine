export type State<S extends PropertyKey, G extends PropertyKey> = {
  target: S;
  guards?: G[];
};

export type Transition<
  S extends PropertyKey,
  E extends PropertyKey,
  G extends PropertyKey = never,
> = {
  on: {
    [key in E]?: State<S, G>;
  };
};

export type StateDef = {
  entry?: () => void;
  exit?: () => void;
};

export type Machine<
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
  State extends PropertyKey,
  Event extends PropertyKey,
  Guards extends PropertyKey = never,
> {
  private machine: Machine<State, Event, Guards>;
  state: State;

  constructor(machine: Machine<State, Event, Guards>) {
    this.machine = machine;
    this.state = machine.initial;
    this.machine.states[this.state].entry?.();
  }

  send(event: Event) {
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
        `Invalid transition from ${this.state.toString()} on ${event.toString()}`,
      );
    }
  }

  private validateGuards(guards: Guards[]) {
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
