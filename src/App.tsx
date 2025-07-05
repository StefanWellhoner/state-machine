import "./index.css";
import { robotMachine, registerMachine } from "@/machines";
import Register from "./pages/register";
import Robot from "./pages/robot/Robot";

export function App() {
  return (
    <div className="main">
      <div>
        <Register machine={registerMachine} />
      </div>
      <div>
        <Robot machine={robotMachine} />
      </div>
    </div>
  );
}

export default App;
