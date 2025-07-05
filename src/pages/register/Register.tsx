import { Card } from "@/components"
import AddressDetails from "@/containers/address"
import Confirmation from "@/containers/confirmation"
import PersonalDetails from "@/containers/personal"
import FSM from "@/lib/machine"
import { FormEvents, FormStates } from "@/machines/register"
import { FC, useState } from "react"

type RegisterProps = {
  machine: FSM<FormStates, FormEvents>
}

const Register: FC<RegisterProps> = ({ machine }) => {
  const [machineState, setMachineState] = useState<FormStates>(() => machine.state)

  const handleNext = () => {
    machine.send("next")
    setMachineState(machine.state)
  }

  const handleBack = () => {
    machine.send("back")
    setMachineState(machine.state)
  }

  const handleSubmit = () => {
    console.log("Submitted")
  }

  return (
    <Card title="Register">
      {machineState}
      {machineState === "personal" && <PersonalDetails onNext={handleNext} />}
      {machineState === "address" && <AddressDetails onNext={handleNext} onBack={handleBack} />}
      {machineState === "confirmation" && <Confirmation onBack={handleBack} onSubmit={handleSubmit} />}
    </Card>)
}

export default Register
