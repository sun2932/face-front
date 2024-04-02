import React, { useState } from "react";
import Registration from "./pages/registration";
import "./app.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Homepage from "./pages/Homepage";

function App() {
  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [image1, setImage1] = useState("");
  return (
    <Router>
      <Routes>
        {/* <Route path="/web" element={<WebcamCapture/>}/> */}
        <Route
          path="/home"
          element={<Homepage name={name} mail={mail} image1={image1} />}
        />
        <Route path="/" element={<Registration />} />
        <Route
          path="/login"
          element={
            <Login setName={setName} setMail={setMail} setImage1={setImage1} />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
