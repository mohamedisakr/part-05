import React from "react";

const Success = ({ message }) =>
  message ? <div className="success">{message}</div> : null;

export default Success;
