import "./index.css";
import { robotMachine, registerMachine } from "@/machines";
import Register from "./pages/register";
import Robot from "./pages/robot/Robot";

export function App() {
  return (
    <>
      <div>
        <Register machine={registerMachine} />
      </div>
      <div className="main">
        <Robot machine={robotMachine} />
      </div>
    </>
  );
}

export default App;
