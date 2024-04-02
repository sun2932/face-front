import React from "react";
import { Link } from "react-router-dom";

const Homepage = ({ name, mail, image1 }) => {
  return (
    <div className="reg-container">
      <h1>Welcome to Homepage</h1>
      {console.log(image1)}
      <img src={image1} height={220} width={200} />
      <p>Name: {name}</p>
      <p>Mail: {mail}</p>
      <h4>
        <u>
          <Link to="/login">Logout</Link>
        </u>{" "}
      </h4>
    </div>
  );
};

export default Homepage;
