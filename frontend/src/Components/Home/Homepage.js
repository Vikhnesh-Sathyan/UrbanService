import React from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import Services from "./Services";
import HowItWorks from "./HowItWorks";


function Homepage() {
  return (
    <div>
      <Navbar />

      <Hero />

      <Services />

      <HowItWorks />

    </div>
  );
}

export default Homepage;