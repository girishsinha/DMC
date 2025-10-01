import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import { Outlet } from "react-router-dom";
import { ModeToggle } from "./components/toggle-mode";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="h-[100vh] w-[100vw]  flex justify-center items-center ">
      {/* <ModeToggle /> */}

      <Outlet />
    </div>
  );
}

export default App;
