import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import "./App.css";
import Home from "./components/Home";
import Admin from "./components/Admin";
import User from "./components/User";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <BrowserRouter>
        <Routes>  
          <Route path="/" element={<Home />}>
            <Route index element={<Admin />} />
            <Route path="admin" element={<Admin />} />
            <Route path="user" element={<User />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
