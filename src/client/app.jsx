import React from "react";
import ReactDOM from "react-dom";
import Container from "./component/Container";

window.dbg = require("debug");

document.addEventListener("DOMContentLoaded", () => {
  window._tv = (<Container/>)
  ReactDOM.render(window._tv, document.getElementById("tv"));
});
