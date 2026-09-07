import React from "react";
import Navbar from "./Navbar";
import { Services } from "../Customer/Services";
import AboutUs from "./AboutUs";
import Footer from "../Common/Footer";

function Homepage() {
  return (
    <div>
      <Navbar />

      {/* <section className="hero-section bg-primary text-white text-center py-5">
        <div className="container">
          <h1 className="display-4 fw-bold">
            Find the Best Urban Services in One Place!
          </h1>

          <p className="lead mb-4">
            Your marketplace for cleaners, electricians, plumbers, and more.
          </p>

          <a href="/services" className="btn btn-light btn-lg shadow">
            Explore Services
          </a>
        </div>
      </section>

      <Services />

      <AboutUs />

      <Footer /> */}
    </div>
  );
}

export default Homepage;