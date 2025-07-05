import "./index.css";
import registerMachine from "@/machines";
import Register from "./pages/register";

export function App() {
  return (
    <div>
      <Register machine={registerMachine} />
    </div>
  );
}

export default App;
