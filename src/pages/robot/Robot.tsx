import FSM from "@/lib/machine"
import { RobotEvents, RobotStates } from "@/machines/robot"
import { FC, useEffect, useState } from "react"

type RobotProps = {
  machine: FSM<RobotStates, RobotEvents, "">
}

const Robot: FC<RobotProps> = ({ machine }) => {
  const [machineState, setMachineState] = useState<RobotStates>(() => machine.state)

  const determineInterval = (state: RobotStates): number => {
    switch (state) {
      case "red":
        return 5000
      case "yellow":
        return 1000;
      case "green":
        return 2000;
    }
  }
  useEffect(() => {
    let interval = determineInterval(machine.state)
    const intervalID = setInterval(() => {
      machine.send("change")
      setMachineState(machine.state)
    }, interval)

    return () => clearInterval(intervalID)
  }, [machine, machineState])

  return (
    <div className="light-container">
      <div className={machineState === "red" ? "light red" : "light off"}></div>
      <div className={machineState === "yellow" ? "light yellow" : "light off"}></div>
      <div className={machineState === "green" ? "light green" : "light off"}></div>
    </div>
  )
}

Robot.displayName = "Robot"

export default Robot
