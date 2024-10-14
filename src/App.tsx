import React from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import UserPage from "./pages/UserPage";
import StartPage from "./pages/StartPage";

const NotFound: React.FC = () => <h2 className="text-2xl">404 Not Found</h2>;

const App: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
