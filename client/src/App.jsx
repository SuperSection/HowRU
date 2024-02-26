import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<p>Home</p>} />
        <Route path="/chat" element={<p>Let's chat</p>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
