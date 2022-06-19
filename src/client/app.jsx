import javascript from "babel-polyfill";
import React from "react";
import ReactDOM from "react-dom";
import Container from "./component/Container";

window.dbg = require("debug");

document.addEventListener("DOMContentLoaded", () => {
  ReactDOM.render((window._tv = <Container />), document.getElementById("tv"));
});
