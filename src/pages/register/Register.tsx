import { Card } from "@/components";
import AddressDetails from "@/containers/address";
import Confirmation from "@/containers/confirmation";
import PersonalDetails from "@/containers/personal";
import FSM from "@/lib/machine";
import { FormEvents, FormGuards, FormStates } from "@/machines/register";
import { FC, useState } from "react";

type RegisterProps = {
  machine: FSM<FormStates, FormEvents, FormGuards>;
};

const Register: FC<RegisterProps> = ({ machine }) => {
  const [machineState, setMachineState] = useState<FormStates>(
    () => machine.state,
  );

  const handleNext = () => {
    machine.send("next");
    setMachineState(machine.state);
  };

  const handleBack = () => {
    machine.send("back");
    setMachineState(machine.state);
  };

  const handleSubmit = () => {
    machine.send("submit");
    setMachineState(machine.state);
    console.log("Submitted");
  };

  return (
    <Card title={machineState}>
      {machineState === "personal" && <PersonalDetails onNext={handleNext} />}
      {machineState === "address" && (
        <AddressDetails onNext={handleNext} onBack={handleBack} />
      )}
      {machineState === "confirmation" && (
        <Confirmation onBack={handleBack} onSubmit={handleSubmit} />
      )}
    </Card>
  );
};

export default Register;
