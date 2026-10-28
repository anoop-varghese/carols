import React from "react";
import "./Header.css";

export default function Header() {
  return (
    <header className="hero">
      <div className="hero-sparkles" aria-hidden="true">
        <span>✦</span><span>✧</span><span>✦</span><span>✧</span>
      </div>
      <div className="church">St Mary's OSC</div>
      <div className="churchCity">Hyderabad</div>
      <h1 className="app-title">Carols {new Date().getFullYear()}</h1>
      <p className="lead">Join us to celebrate the season of wonder and joy</p>
    </header>
  );
}
