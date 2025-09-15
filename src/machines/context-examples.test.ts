import FSM from "@/lib/machine";
import authMachineDefinition, { AuthContext } from "@/machines/auth";
import { registerMachineWithContextDef, RegisterContext } from "@/machines/register";

describe("Context Examples", () => {
  describe("Authentication Machine", () => {
    it("should handle authentication flow with context", () => {
      const context: AuthContext = {
        username: "admin",
        password: "password123",
        attempts: 0,
        maxAttempts: 3,
      };

      const auth = new FSM(authMachineDefinition, context);
      
      expect(auth.state).toBe("idle");
      expect(auth.context).toEqual(context);

      // Attempt login
      auth.send("login");
      expect(auth.state).toBe("authenticating");
      expect(auth.context?.attempts).toBe(0); // Not incremented on entry

      // Complete authentication
      auth.send("login");
      expect(auth.state).toBe("authenticated");
      expect(auth.context?.attempts).toBe(0); // Reset to 0 on success
      expect(auth.context?.token).toBeTruthy();
      expect(auth.context?.password).toBeUndefined(); // Should be cleared

      // Logout
      auth.send("logout");
      expect(auth.state).toBe("idle");
    });

    it("should handle failed authentication", () => {
      const context: AuthContext = {
        username: "admin",
        password: "wrongpassword",
        attempts: 0,
        maxAttempts: 3,
      };

      const auth = new FSM(authMachineDefinition, context);

      auth.send("login");
      expect(auth.state).toBe("authenticating");

      auth.send("login"); // Will fail due to wrong password
      expect(auth.state).toBe("authenticating"); // Should stay in authenticating since guard fails

      auth.send("timeout"); // Simulate timeout
      expect(auth.state).toBe("failed");
      expect(auth.context?.attempts).toBe(1);
    });

    it("should prevent login when max attempts reached", () => {
      const context: AuthContext = {
        username: "admin",
        password: "password123",
        attempts: 3,
        maxAttempts: 3,
      };

      const auth = new FSM(authMachineDefinition, context);

      auth.send("login"); // Should not transition due to max attempts
      expect(auth.state).toBe("idle");
    });
  });

  describe("Registration Machine with Context", () => {
    it("should handle registration flow with context validation", () => {
      const context: RegisterContext = {
        personalData: {
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
        },
        addressData: {
          street: "123 Main St",
          city: "Anytown",
          zipCode: "12345",
        },
      };

      const registration = new FSM(registerMachineWithContextDef, context);
      
      expect(registration.state).toBe("personal");

      // Should be able to proceed to address step
      registration.send("next");
      expect(registration.state).toBe("address");

      // Should be able to proceed to confirmation
      registration.send("next");
      expect(registration.state).toBe("confirmation");

      // Submit form
      registration.send("submit");
      expect(registration.state).toBe("personal");
      expect(registration.context?.isSubmitting).toBe(true);
    });

    it("should prevent progression without required data", () => {
      const context: RegisterContext = {
        personalData: {
          firstName: "John",
          // Missing lastName and email
        },
      };

      const registration = new FSM(registerMachineWithContextDef, context);

      registration.send("next"); // Should not proceed
      expect(registration.state).toBe("personal");
    });

    it("should allow context updates during flow", () => {
      const registration = new FSM(registerMachineWithContextDef, {});

      // Initially can't proceed
      registration.send("next");
      expect(registration.state).toBe("personal");

      // Update context with personal data
      registration.updateContext({
        personalData: {
          firstName: "Jane",
          lastName: "Smith",
          email: "jane@example.com",
        },
      });

      // Now should be able to proceed
      registration.send("next");
      expect(registration.state).toBe("address");
    });
  });
});