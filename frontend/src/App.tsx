import React from "react";
import { BrowserRouter as Router } from "react-router-dom"; // Importando o Router
import { ToastContainer } from "react-toastify";
import "./App.css";
import NavBar from "./components/Navbar";
import AppRoutes from "./Routes"; // Roteamento

const App: React.FC = () => {
  return (
    <>
      <Router>
        <NavBar />
        <AppRoutes />
      </Router>
      <ToastContainer />
    </>
  );
};

export default App;
