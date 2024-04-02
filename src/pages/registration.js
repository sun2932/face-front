import React, { useState } from "react";
import "./registration.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { WebcamCapture } from "./Webapp";
import closeEye from "../images/close-eye.svg";
import openEye from "../images/open-eye.svg";

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [takePhoto, setTakePhoto] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    mail: "",
    password: "",
    confirmPassword: "",
    image: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const upevent = () => {
    setShow(!show);
  };
  const upevent1 = () => {
    setShow1(!show1);
  };

  const handlelogin = () => {
    navigate("/login");
  };

  const handleSubmit = async () => {
    const { name, mail, password, confirmPassword, image } = formData;
    if (
      name.length &&
      mail.length &&
      password.length &&
      confirmPassword.length &&
      image.length
    ) {
      if (password === confirmPassword) {
        await axios
          .post("https://face-back-cv17.onrender.com/api/Register", formData, {
            headers: { "Content-Type": "application/json" },
          })
          .then((res) => {
            console.log("-->", res.data);
            alert(res.data.message);
            navigate("/login");
          })
          .catch((e) => {
            console.log("err-->", e);
          });
        setFormData({
          name: "",
          mail: "",
          password: "",
          confirmPassword: "",
        });
      } else {
        alert("password does not matched");
      }
    } else {
      alert("Please fill all section");
    }
  };

  return (
    <div className="reg-container">
      <div className="container">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter Your Name"
        />
      </div>
      <div className="container">
        <input
          type="email"
          name="mail"
          value={formData.mail}
          onChange={handleChange}
          placeholder="Enter Your Email"
        />
      </div>

      <div className="container">
        <input
          type={show ? "text" : "password"}
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter Your Password"
        />
        <div
          onClick={() => {
            setShow(!show);
          }}
        >
          <img
            src={!show ? openEye : closeEye}
            alt="SVG Image"
            style={{ height: "30px", width: "30px" }}
          />
        </div>
      </div>

      <div className="container">
        <input
          type={show1 ? "text" : "password"}
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm Password"
        />
        <div
          onClick={() => {
            setShow1(!show1);
          }}
        >
          <img
            src={!show1 ? openEye : closeEye}
            alt="SVG Image"
            style={{ height: "30px", width: "30px" }}
          />
        </div>
      </div>

      <div>
        {takePhoto ? (
          <WebcamCapture formData={formData} setFormData={setFormData} />
        ) : (
          <div className="capture-btn" style={{ marginTop: "10px" }}>
            <button
              onClick={() => {
                setTakePhoto(true);
              }}
            >
              Take Photo
            </button>
          </div>
        )}
      </div>

      <div className="capture-btn" style={{ marginTop: "10px" }}>
        <button onClick={handleSubmit}>Submit</button>
      </div>

      <h4 className="container1">
        Already Registered{" "}
        <u>
          <Link to="/login">click here</Link>
        </u>{" "}
        for login{" "}
      </h4>
    </div>
  );
};

export default RegistrationForm;
