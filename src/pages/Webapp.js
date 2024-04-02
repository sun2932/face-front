import React from "react";
import Webcam from "react-webcam";

const videoConstraints = {
  width: 220,
  height: 200,
  facingMode: "user",
};

export const WebcamCapture = ({ formData, setFormData, isLogin }) => {
  const webcamRef = React.useRef(null);

  const getImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setFormData({ ...formData, [`image`]: imageSrc });

    if (isLogin) {
    }
  };

  return (
    <div className="webcam-container">
      <div className="webcam-img">
        {formData.image === "" ? (
          <Webcam
            audio={false}
            height={200}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={220}
            videoConstraints={videoConstraints}
          />
        ) : (
          <img src={formData.image} alt="Captured" />
        )}
      </div>
      <div className="capture-btn" >
        <button
          onClick={() => {
            if (formData.image === "") {
              getImage();
            } else {
              setFormData({ ...formData, [`image`]: "" });
            }
          }}
        >
          {formData.image === "" ? "Capture" : "Retake"}
        </button>
      </div>
    </div>
  );
};
