import FSM from "@/lib/machine";

export type RobotStates = "green" | "yellow" | "red";
export type RobotEvents = "change";

const robot = new FSM<RobotStates, RobotEvents>({
  id: "robot",
  initial: "red",
  states: {
    red: {
      entry() {
        console.log("Entered red");
      },
      exit() {
        console.log("Exitted red");
      },
    },
    yellow: {},
    green: {},
  },
  transitions: {
    red: {
      on: {
        change: {
          target: "green",
        },
      },
    },
    green: {
      on: {
        change: {
          target: "yellow",
        },
      },
    },
    yellow: {
      on: {
        change: {
          target: "red",
        },
      },
    },
  },
});

export default robot;
