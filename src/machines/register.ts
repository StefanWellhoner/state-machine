import FSM, { Machine } from "@/lib/machine";

export type FormStates = "personal" | "address" | "confirmation";
export type FormEvents = "next" | "back" | "submit";
export type FormGuards = "hasPersonalData" | "hasAddressData";

// Context interface for the registration form
export interface RegisterContext {
  personalData?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  addressData?: {
    street?: string;
    city?: string;
    zipCode?: string;
  };
  isSubmitting?: boolean;
}

// Original machine without context for backward compatibility
const registerMachine = new FSM<FormStates, FormEvents, FormGuards>({
  id: "register",
  initial: "personal",
  states: {
    personal: {},
    address: {},
    confirmation: {},
  },
  transitions: {
    personal: {
      on: {
        next: {
          target: "address",
          guards: ["hasPersonalData"],
        },
      },
    },
    address: {
      on: {
        next: {
          target: "confirmation",
          guards: ["hasAddressData"],
        },
        back: {
          target: "personal",
        },
      },
    },
    confirmation: {
      on: {
        back: {
          target: "address",
        },
        submit: {
          target: "personal",
        },
      },
    },
  },
  guards: {
    hasAddressData: () => {
      return false;
    },
    hasPersonalData: () => {
      return true;
    },
  },
});

// Enhanced machine definition with context support
export const registerMachineWithContextDef: Machine<FormStates, FormEvents, FormGuards, RegisterContext> = {
  id: "register-with-context",
  initial: "personal",
  states: {
    personal: {
      entry: (context) => {
        console.log("Entering personal step", context?.personalData ? "with existing data" : "fresh start");
      },
    },
    address: {
      entry: (context) => {
        console.log("Entering address step for user:", context?.personalData?.firstName || "Unknown");
      },
    },
    confirmation: {
      entry: (context) => {
        console.log("Reviewing registration for:", {
          name: `${context?.personalData?.firstName} ${context?.personalData?.lastName}`,
          address: `${context?.addressData?.street}, ${context?.addressData?.city}`,
        });
      },
      exit: (context) => {
        if (context) {
          context.isSubmitting = true;
          console.log("Starting submission process...");
        }
      },
    },
  },
  transitions: {
    personal: {
      on: {
        next: {
          target: "address",
          guards: ["hasPersonalData"],
        },
      },
    },
    address: {
      on: {
        next: {
          target: "confirmation",
          guards: ["hasAddressData"],
        },
        back: {
          target: "personal",
        },
      },
    },
    confirmation: {
      on: {
        back: {
          target: "address",
        },
        submit: {
          target: "personal",
        },
      },
    },
  },
  guards: {
    hasPersonalData: (context) => {
      const personal = context?.personalData;
      return !!(personal?.firstName && personal?.lastName && personal?.email);
    },
    hasAddressData: (context) => {
      const address = context?.addressData;
      return !!(address?.street && address?.city && address?.zipCode);
    },
  },
};

// Create a new FSM instance with context for use in examples
export const registerMachineWithContext = new FSM(registerMachineWithContextDef);

export default registerMachine;
