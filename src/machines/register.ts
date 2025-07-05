import FSM from "@/lib/machine";

export type FormStates = "personal" | "address" | "confirmation";
export type FormEvents = "next" | "back" | "submit";
export type FormGuards = "hasPersonalData" | "hasAddressData"

const registerMachine = new FSM<FormStates, FormEvents, FormGuards>({
  id: "register",
  initial: "personal",
  transitions: {
    personal: {
      on: {
        next: {
          target: "address",
          guards: ["hasPersonalData"]
        },
      }
    },
    address: {
      on: {
        next: {
          target: "confirmation",
          guards: ["hasAddressData"]
        },
        back: {
          target: "personal"
        }
      }
    },
    confirmation: {
      on: {
        back: {
          target: "address"
        },
        submit: {
          target: "personal"
        }
      }
    }
  },
  guards: {
    "hasAddressData": () => { return false },
    "hasPersonalData": () => { return true }
  }
})

export default registerMachine
