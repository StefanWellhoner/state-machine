type State<S extends string, G extends string> = {
  target: S;
  guards?: G[]
}

type Transition<S extends string, E extends string, G extends string> = {
  on: {
    [key in E]?: State<S, G>
  }
}

type Machine<S extends string, E extends string, G extends string> = {
  id: string;
  initial: S;
  transitions: {
    [key in S]: Transition<S, E, G>
  },
  guards?: {
    [key in G]: () => boolean
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
    const nextState = this.machine.transitions[this.state].on[event]
    if (nextState) {
      const { target, guards } = nextState
      let passed = true;

      if (guards) {
        passed = this.validateGuards(guards)
      }

      if (passed) {
        this.state = target;
      }
    } else {
      throw new Error(`Invalid transistion from ${this.state} on ${event}`)
    }
  }

  private validateGuards(guards: G[]) {
    if (this.machine.guards) {
      let passed = true
      for (let i = 0; i < guards.length; i++) {
        const guardKey = guards[i]
        const guard = this.machine.guards[guardKey]
        let result = guard()
        passed = result
        if (!result) break;
      }
      return passed;
    }
    return true
  }
}

export default FSM;
