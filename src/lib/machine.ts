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

export type StateDef<C = unknown> = {
  entry?: (context?: C) => void;
  exit?: (context?: C) => void;
};

export type Machine<
  S extends PropertyKey,
  E extends PropertyKey,
  G extends PropertyKey = never,
  C = unknown,
> = {
  id: string;
  initial: S;
  transitions: {
    [key in S]: Transition<S, E, G>;
  };
  guards?: {
    [key in G]: (context?: C) => boolean;
  };
  states: {
    [key in S]: StateDef<C>;
  };
};

class FSM<
  State extends PropertyKey,
  Event extends PropertyKey,
  Guards extends PropertyKey = never,
  Context = unknown,
> {
  private machine: Machine<State, Event, Guards, Context>;
  state: State;
  context?: Context;

  constructor(machine: Machine<State, Event, Guards, Context>, context?: Context) {
    this.machine = machine;
    this.state = machine.initial;
    this.context = context;
    this.machine.states[this.state].entry?.(this.context);
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
        this.machine.states[this.state].exit?.(this.context);
        this.state = target;
        this.machine.states[this.state].entry?.(this.context);
      }
    } else {
      throw new Error(
        `Invalid transition from ${this.state.toString()} on ${event.toString()}`,
      );
    }
  }

  updateContext(newContext: Context) {
    this.context = newContext;
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
      if (!guard(this.context)) return false;
    }
    return true;
  }
}

export default FSM;
