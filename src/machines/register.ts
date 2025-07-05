import FSM from "@/lib/machine";

export type FormStates = "personal" | "address" | "confirmation";
export type FormEvents = "next" | "back" | "submit";

const registerMachine = new FSM<FormStates, FormEvents, "">({
  id: "register",
  initial: "personal",
  transistions: {
    personal: {
      on: {
        next: { target: "address" },
      }
    },
    address: {
      on: {
        next: { target: "confirmation" },
        back: { target: "personal" }
      }
    },
    confirmation: {
      on: {
        back: { target: "address" },
        submit: { target: "personal" }
      }
    }
  }
})

export default registerMachine
