import React from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import Services from "./Services";
import HowItWorks from "./HowItWorks";
import WhyChooseUs from "./WhyChooseUs";
import Footer from "./Footer";

function Homepage() {
  return (
    <div>
      <Navbar />

      <Hero />

      <Services />

      <HowItWorks />

      <WhyChooseUs />

      <Footer />
      
    </div>
  );
}

export default Homepage;