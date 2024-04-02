import axios from "axios";
import * as faceapi from "face-api.js";
import { WebcamCapture } from "./Webapp";
import openEye from "../images/open-eye.svg";
import { Circles } from "react-loader-spinner";
import closeEye from "../images/close-eye.svg";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";

const Login = ({ setName, setMail, setImage1 }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [dbImage, setDbImage] = useState("");
  const [takePhoto, setTakePhoto] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    image: "",
  });

  //  Image Matching States
  const img1Ref = useRef();
  const img2Ref = useRef();

  const handleSubmit = async () => {
    if (formData.email && formData.password) {
      setLoading(true);
      try {
        await axios
          .post("https://face-back-cv17.onrender.com/api/Login", {
            email: formData.email,
            password: formData.password,
          })
          .then((res) => {
            if (res.data.message === "login successfully") {
              setDbImage(res.data.user.image);
              setName(res.data.user.name);
              setMail(res.data.user.mail);
              setImage1(res.data.user.image);
            } else {
              setFormData({ ...formData, ["image"]: "" });
              setDbImage("");
              alert("Invalid email or password");
              setLoading(false);
            }
            console.log("succes", res.data);
          })
          .catch((e) => {
            setFormData({ ...formData, ["image"]: "" });
            setDbImage("");
            alert("Network Error");
            setLoading(false);
            console.log("err-->", e);
          });
      } catch (e) {
        console.log(e);
      }
    }
  };

  function convertBase64ToFile(base64String, filename) {
    const base64WithoutMetadata = base64String.replace(
      /^data:image\/[a-zA-Z]*;base64,/,
      ""
    );

    const binaryString = atob(base64WithoutMetadata);
    const buffer = new ArrayBuffer(binaryString.length);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < binaryString.length; i++) {
      view[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([view], { type: "image/png" });
    const file = new File([blob], filename, { type: "image/png" });
    return blob;
  }

  const matchFace = async () => {
    await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
    await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
    await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
    await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
    await faceapi.nets.faceExpressionNet.loadFromUri("/models");

    const img1Element = img1Ref.current;
    const img2Element = img2Ref.current;

    if (!img1Element || !img2Element) {
      alert("Image elements are not loaded.");
      return;
    }

    const idCardFacedetection = await faceapi
      .detectSingleFace(img1Element, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();
    const selfieFacedetection = await faceapi
      .detectSingleFace(img2Element, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (idCardFacedetection && selfieFacedetection) {
      const distance = faceapi.euclideanDistance(
        idCardFacedetection.descriptor,
        selfieFacedetection.descriptor
      );
      console.log(distance);
      if (distance < 0.4) {
        alert("Face Matched")
        navigate("/home");
      } else {
        setFormData({ ...formData, ["image"]: "" });
        alert("Face Not Matched");
      }
    } else {
      setFormData({ ...formData, ["image"]: "" });
      setDbImage("");
      alert("Image is not Clear");
    }

    setLoading(false);
  };

  useEffect(() => {
    if (formData.image !== "" && dbImage !== "") {
      matchFace();
    }
  }, [formData, dbImage]);

  return (
    <>
      {loading ? (
        <div className="blur-background">
          <div
            style={{
              margin: "auto",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Circles
              height="80"
              width="80"
              color="#0077C2"
              ariaLabel="circles-loading"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
            />
          </div>
        </div>
      ) : null}
      <div className="reg-container">
        <h1>Login here</h1>

        <div className="container">
          <input
            type="email"
            name="mail"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, [`email`]: e.target.value });
            }}
            placeholder="Enter Your Email"
          />
        </div>
        <div className="container">
          <input
            type={show ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={(e) => {
              setFormData({ ...formData, [`password`]: e.target.value });
            }}
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

        <div style={{ marginTop: "10px" }}>
          {formData.image !== "" && (
            <img
              ref={img1Ref}
              // src={require("../images/tombhai.jpg")}
              src={URL.createObjectURL(
                convertBase64ToFile(formData.image, "img1")
              )}
              style={{ heigth: 100, width: 100 }}
              // style={{ display: "none" }}
            />
          )}
          {dbImage !== "" && (
            <img
              ref={img2Ref}
              // src={require("../images/tombhai2.jpg")}
              src={URL.createObjectURL(convertBase64ToFile(dbImage, "img2"))}
              // style={{ display: "none" }}
              style={{ heigth: 100, width: 100, display: "none" }}
            />
          )}
        </div>

        {formData.image !== "" && (
          <div className="capture-btn" style={{ marginTop: "10px" }}>
            <button className="containerbutton" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        )}
        <h4 className="container1">
          Not Registered Yet{" "}
          <u>
            <Link to="/">click here</Link>
          </u>{" "}
          for Registration{" "}
        </h4>
      </div>
    </>
  );
};

export default Login;
