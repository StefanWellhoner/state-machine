type State<S extends string, G extends string> = {
  target: S;
  guards?: {
    [key in G]: () => boolean
  }
}

type Transition<S extends string, E extends string, G extends string> = {
  on: {
    [key in E]?: State<S, G>
  }
}

type Machine<S extends string, E extends string, G extends string> = {
  id: string;
  initial: S;
  transistions: {
    [key in S]: Transition<S, E, G>
  }
}

class FSM<S extends string, E extends string, G extends string> {
  machine: Machine<S, E, G>
  state: S;

  constructor(machine: Machine<S, E, G>) {
    this.machine = machine
    this.state = machine.initial
  }

  send(event: E) {
    const nextState = this.machine.transistions[this.state].on[event]
    if (nextState) {
      this.state = nextState.target;
    } else {
      throw new Error(`Invalid transistion from ${this.state} on ${event}`)
    }
  }
}

export default FSM;
