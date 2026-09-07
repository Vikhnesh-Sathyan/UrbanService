import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { categories } from "./Services";
import PaymentForm from '../Payment/PaymentForm';
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/ServiceDetails.css";

const serviceDetails = {
  "womens-salon": {
    services: [
      {
        name: "Haircut & Styling",
        description: "Professional haircut and styling services tailored to your preferences",
        duration: "45-60 mins",
        price: "₹500 - ₹1500",
        includes: [
          "Consultation with stylist",
          "Shampoo and conditioning",
          "Professional haircut",
          "Blow dry and styling",
          "Style recommendations"
        ]
      },
      {
        name: "Hair Coloring & Highlights",
        description: "Transform your look with our premium hair coloring services",
        duration: "2-3 hours",
        price: "₹2000 - ₹5000",
        includes: [
          "Color consultation",
          "Premium hair color products",
          "Highlights or full color",
          "Deep conditioning treatment",
          "Style finish"
        ]
      },
      {
        name: "Facial Treatments",
        description: "Rejuvenate your skin with our specialized facial treatments",
        duration: "60-90 mins",
        price: "₹1000 - ₹3000",
        includes: [
          "Skin analysis",
          "Deep cleansing",
          "Exfoliation",
          "Face massage",
          "Mask treatment"
        ]
      },
      {
        name: "Manicure & Pedicure",
        description: "Complete nail care and pampering for hands and feet",
        duration: "60-90 mins",
        price: "₹800 - ₹2000",
        includes: [
          "Nail shaping",
          "Cuticle care",
          "Hand/Foot massage",
          "Nail polish application",
          "Moisturizing treatment"
        ]
      },
      {
        name: "Full Body Massage",
        description: "Relaxing and therapeutic full body massage",
        duration: "60-90 mins",
        price: "₹1500 - ₹3000",
        includes: [
          "Full body massage",
          "Aromatherapy oils",
          "Hot stone therapy",
          "Relaxation music",
          "Post-massage care"
        ]
      },
      {
        name: "Bridal Makeup",
        description: "Complete bridal makeup and styling package",
        duration: "2-3 hours",
        price: "₹3000 - ₹5000",
        includes: [
          "Pre-bridal consultation",
          "Skin preparation",
          "Professional makeup",
          "Hair styling",
          "Touch-up kit"
        ]
      },
      {
        name: "Skin Treatments",
        description: "Advanced skin care treatments for various concerns",
        duration: "60-90 mins",
        price: "₹1500 - ₹4000",
        includes: [
          "Skin analysis",
          "Deep cleansing",
          "Treatment mask",
          "LED therapy",
          "Post-treatment care"
        ]
      },
      {
        name: "Waxing Services",
        description: "Professional hair removal services",
        duration: "30-60 mins",
        price: "₹500 - ₹2000",
        includes: [
          "Pre-waxing care",
          "Premium wax",
          "Post-waxing care",
          "Skin soothing treatment",
          "Aftercare instructions"
        ]
      }
    ],
    benefits: [
      "Professional Stylists",
      "Premium Products",
      "Relaxing Environment",
      "Customized Treatments"
    ],
    priceRange: "₹500 - ₹5000"
  },
  "mens-salon": {
    services: [
      {
        name: "Haircut & Beard Trim",
        description: "Professional haircut and beard grooming services for men",
        duration: "30-45 mins",
        price: "₹300 - ₹800",
        includes: [
          "Consultation with barber",
          "Hair wash",
          "Professional haircut",
          "Beard trimming and shaping",
          "Style finish"
        ]
      },
      {
        name: "Hair Coloring",
        description: "Premium hair coloring services for men",
        duration: "1.5-2 hours",
        price: "₹1500 - ₹3000",
        includes: [
          "Color consultation",
          "Premium hair color",
          "Deep conditioning",
          "Style finish",
          "Aftercare instructions"
        ]
      },
      {
        name: "Facial for Men",
        description: "Specialized facial treatments for men's skin",
        duration: "45-60 mins",
        price: "₹800 - ₹2000",
        includes: [
          "Skin analysis",
          "Deep cleansing",
          "Exfoliation",
          "Face massage",
          "Moisturizing treatment"
        ]
      },
      {
        name: "Head Massage",
        description: "Relaxing head and shoulder massage",
        duration: "30-45 mins",
        price: "₹500 - ₹1000",
        includes: [
          "Head massage",
          "Shoulder massage",
          "Aromatherapy oils",
          "Relaxation music",
          "Post-massage care"
        ]
      },
      {
        name: "Hair Spa",
        description: "Deep conditioning and hair treatment",
        duration: "45-60 mins",
        price: "₹1000 - ₹2500",
        includes: [
          "Hair analysis",
          "Deep conditioning",
          "Scalp treatment",
          "Hair massage",
          "Style finish"
        ]
      },
      {
        name: "Skin Treatments",
        description: "Advanced skin care for men",
        duration: "45-60 mins",
        price: "₹1200 - ₹3000",
        includes: [
          "Skin analysis",
          "Deep cleansing",
          "Treatment mask",
          "Face massage",
          "Aftercare instructions"
        ]
      },
      {
        name: "Grooming Services",
        description: "Complete grooming package for men",
        duration: "60-90 mins",
        price: "₹1500 - ₹3000",
        includes: [
          "Haircut",
          "Beard trim",
          "Facial",
          "Hair spa",
          "Style consultation"
        ]
      }
    ],
    benefits: [
      "Expert Barbers",
      "Modern Techniques",
      "Men's Grooming Products",
      "Quick Service"
    ],
    priceRange: "₹300 - ₹3000"
  },
  "ac-repair": {
    services: [
      {
        name: "AC Installation",
        description: "Professional AC installation services",
        duration: "2-3 hours",
        price: "₹1000 - ₹3000",
        includes: [
          "Site inspection",
          "Installation",
          "Testing",
          "Basic maintenance tips",
          "Warranty registration"
        ]
      },
      {
        name: "Regular Maintenance",
        description: "Scheduled AC maintenance service",
        duration: "1-2 hours",
        price: "₹500 - ₹1500",
        includes: [
          "Filter cleaning",
          "Coil cleaning",
          "Drain pipe cleaning",
          "Performance check",
          "Service report"
        ]
      },
      {
        name: "Gas Refilling",
        description: "AC gas refilling service",
        duration: "1-2 hours",
        price: "₹800 - ₹2000",
        includes: [
          "Gas leak check",
          "Gas refilling",
          "Pressure testing",
          "Performance check",
          "Service report"
        ]
      },
      {
        name: "Part Replacement",
        description: "AC part replacement service",
        duration: "1-3 hours",
        price: "₹1000 - ₹5000",
        includes: [
          "Part diagnosis",
          "Part replacement",
          "Testing",
          "Warranty check",
          "Service report"
        ]
      },
      {
        name: "Emergency Repair",
        description: "24/7 emergency AC repair service",
        duration: "1-2 hours",
        price: "₹800 - ₹3000",
        includes: [
          "Quick diagnosis",
          "Emergency repair",
          "Basic maintenance",
          "Testing",
          "Service report"
        ]
      },
      {
        name: "Deep Cleaning",
        description: "Complete AC deep cleaning service",
        duration: "2-3 hours",
        price: "₹1500 - ₹3000",
        includes: [
          "Complete disassembly",
          "Deep cleaning",
          "Sanitization",
          "Reassembly",
          "Performance testing"
        ]
      }
    ],
    benefits: [
      "Certified Technicians",
      "Same Day Service",
      "Warranty on Repairs",
      "Quality Spare Parts"
    ],
    priceRange: "₹500 - ₹5000"
  },
  "cleaning": {
    services: [
      {
        name: "Deep House Cleaning",
        description: "Complete deep cleaning of your home",
        duration: "4-6 hours",
        price: "₹2000 - ₹5000",
        includes: [
          "Floor cleaning",
          "Bathroom cleaning",
          "Kitchen cleaning",
          "Dusting",
          "Window cleaning"
        ]
      },
      {
        name: "Carpet Cleaning",
        description: "Professional carpet cleaning service",
        duration: "2-3 hours",
        price: "₹1000 - ₹3000",
        includes: [
          "Stain removal",
          "Deep cleaning",
          "Sanitization",
          "Drying",
          "Deodorizing"
        ]
      },
      {
        name: "Window Cleaning",
        description: "Professional window cleaning service",
        duration: "2-4 hours",
        price: "₹800 - ₹2500",
        includes: [
          "Glass cleaning",
          "Frame cleaning",
          "Screen cleaning",
          "Track cleaning",
          "Polish finish"
        ]
      },
      {
        name: "Pest Control",
        description: "Complete pest control service",
        duration: "2-3 hours",
        price: "₹1500 - ₹4000",
        includes: [
          "Inspection",
          "Treatment",
          "Preventive measures",
          "Follow-up",
          "Warranty"
        ]
      },
      {
        name: "Sanitization",
        description: "Complete home sanitization service",
        duration: "2-3 hours",
        price: "₹1500 - ₹3000",
        includes: [
          "Surface sanitization",
          "Air sanitization",
          "Bathroom sanitization",
          "Kitchen sanitization",
          "Sanitization report"
        ]
      },
      {
        name: "Post Construction Cleaning",
        description: "Cleaning after construction or renovation",
        duration: "4-6 hours",
        price: "₹3000 - ₹8000",
        includes: [
          "Debris removal",
          "Deep cleaning",
          "Window cleaning",
          "Floor cleaning",
          "Final inspection"
        ]
      }
    ],
    benefits: [
      "Eco-friendly Products",
      "Trained Staff",
      "Flexible Scheduling",
      "Satisfaction Guaranteed"
    ],
    priceRange: "₹1000 - ₹8000"
  },
  "electrician": {
    services: [
      {
        name: "Electrical Repairs",
        description: "Professional electrical repair services",
        duration: "1-3 hours",
        price: "₹300 - ₹2000",
        includes: [
          "Fault diagnosis",
          "Repair work",
          "Testing",
          "Safety check",
          "Service report"
        ]
      },
      {
        name: "New Installations",
        description: "New electrical installation services",
        duration: "2-4 hours",
        price: "₹1000 - ₹5000",
        includes: [
          "Site inspection",
          "Installation",
          "Testing",
          "Safety check",
          "Warranty"
        ]
      },
      {
        name: "Plumbing Services",
        description: "Complete plumbing services",
        duration: "1-3 hours",
        price: "₹500 - ₹3000",
        includes: [
          "Leak detection",
          "Repair work",
          "Installation",
          "Testing",
          "Service report"
        ]
      },
      {
        name: "Carpentry Work",
        description: "Professional carpentry services",
        duration: "2-4 hours",
        price: "₹1000 - ₹5000",
        includes: [
          "Consultation",
          "Material selection",
          "Installation",
          "Finishing",
          "Quality check"
        ]
      },
      {
        name: "Emergency Services",
        description: "24/7 emergency repair services",
        duration: "1-2 hours",
        price: "₹500 - ₹3000",
        includes: [
          "Quick response",
          "Emergency repair",
          "Testing",
          "Safety check",
          "Service report"
        ]
      },
      {
        name: "Home Renovation",
        description: "Complete home renovation services",
        duration: "As per project",
        price: "₹5000 - ₹10000",
        includes: [
          "Planning",
          "Material selection",
          "Execution",
          "Quality check",
          "Final inspection"
        ]
      }
    ],
    benefits: [
      "Licensed Professionals",
      "24/7 Emergency Service",
      "Quality Workmanship",
      "Safety First Approach"
    ],
    priceRange: "₹300 - ₹10000"
  },
  "water-purifier": {
    services: [
      {
        name: "Installation",
        description: "Professional water purifier installation",
        duration: "1-2 hours",
        price: "₹2000 - ₹5000",
        includes: [
          "Site inspection",
          "Installation",
          "Testing",
          "User training",
          "Warranty registration"
        ]
      },
      {
        name: "Regular Maintenance",
        description: "Scheduled maintenance service",
        duration: "1-2 hours",
        price: "₹500 - ₹1500",
        includes: [
          "Filter check",
          "Cleaning",
          "Performance check",
          "Water quality test",
          "Service report"
        ]
      },
      {
        name: "Filter Replacement",
        description: "Water purifier filter replacement",
        duration: "1-2 hours",
        price: "₹1000 - ₹3000",
        includes: [
          "Filter check",
          "Replacement",
          "Testing",
          "Cleaning",
          "Service report"
        ]
      },
      {
        name: "Repair Services",
        description: "Water purifier repair services",
        duration: "1-2 hours",
        price: "₹800 - ₹3000",
        includes: [
          "Fault diagnosis",
          "Repair work",
          "Testing",
          "Cleaning",
          "Service report"
        ]
      },
      {
        name: "Water Quality Testing",
        description: "Professional water quality testing",
        duration: "1-2 hours",
        price: "₹500 - ₹1500",
        includes: [
          "Water sampling",
          "Quality analysis",
          "Report generation",
          "Recommendations",
          "Follow-up"
        ]
      },
      {
        name: "Annual Service",
        description: "Complete annual maintenance service",
        duration: "2-3 hours",
        price: "₹1500 - ₹3000",
        includes: [
          "Complete checkup",
          "Filter replacement",
          "Deep cleaning",
          "Performance check",
          "Service report"
        ]
      }
    ],
    benefits: [
      "Genuine Parts",
      "Expert Technicians",
      "Regular Maintenance",
      "Water Quality Assurance"
    ],
    priceRange: "₹2000 - ₹15000"
  },
  "painting": {
    services: [
      {
        name: "Interior Painting",
        description: "Professional interior painting services",
        duration: "As per project",
        price: "₹2000 - ₹10000",
        includes: [
          "Color consultation",
          "Surface preparation",
          "Painting",
          "Clean up",
          "Final inspection"
        ]
      },
      {
        name: "Exterior Painting",
        description: "Professional exterior painting services",
        duration: "As per project",
        price: "₹3000 - ₹15000",
        includes: [
          "Color consultation",
          "Surface preparation",
          "Weather protection",
          "Painting",
          "Clean up"
        ]
      },
      {
        name: "Wall Texturing",
        description: "Professional wall texturing services",
        duration: "As per project",
        price: "₹3000 - ₹12000",
        includes: [
          "Design consultation",
          "Surface preparation",
          "Texturing",
          "Finishing",
          "Clean up"
        ]
      },
      {
        name: "Waterproofing",
        description: "Professional waterproofing services",
        duration: "As per project",
        price: "₹5000 - ₹20000",
        includes: [
          "Surface inspection",
          "Preparation",
          "Waterproofing",
          "Testing",
          "Warranty"
        ]
      },
      {
        name: "Wallpaper Installation",
        description: "Professional wallpaper installation",
        duration: "As per project",
        price: "₹3000 - ₹15000",
        includes: [
          "Design consultation",
          "Surface preparation",
          "Installation",
          "Finishing",
          "Clean up"
        ]
      },
      {
        name: "Color Consultation",
        description: "Professional color consultation service",
        duration: "1-2 hours",
        price: "₹500 - ₹2000",
        includes: [
          "Color analysis",
          "Design consultation",
          "Color selection",
          "Sample testing",
          "Recommendations"
        ]
      }
    ],
    benefits: [
      "Premium Paints",
      "Experienced Painters",
      "Clean Work",
      "Color Matching"
    ],
    priceRange: "₹2000 - ₹20000"
  },
  "wall-panels": {
    services: [
      {
        name: "3D Wall Panels",
        description: "Modern 3D wall panel installation",
        duration: "As per project",
        price: "₹5000 - ₹25000",
        includes: [
          "Design consultation",
          "Material selection",
          "Installation",
          "Finishing",
          "Clean up"
        ]
      },
      {
        name: "Wooden Panels",
        description: "Premium wooden wall panel installation",
        duration: "As per project",
        price: "₹8000 - ₹40000",
        includes: [
          "Design consultation",
          "Wood selection",
          "Installation",
          "Finishing",
          "Warranty"
        ]
      },
      {
        name: "PVC Panels",
        description: "PVC wall panel installation",
        duration: "As per project",
        price: "₹5000 - ₹30000",
        includes: [
          "Design consultation",
          "Panel selection",
          "Installation",
          "Finishing",
          "Clean up"
        ]
      },
      {
        name: "Custom Designs",
        description: "Custom wall panel design and installation",
        duration: "As per project",
        price: "₹10000 - ₹50000",
        includes: [
          "Design consultation",
          "Custom design",
          "Material selection",
          "Installation",
          "Finishing"
        ]
      },
      {
        name: "Installation",
        description: "Professional wall panel installation",
        duration: "As per project",
        price: "₹5000 - ₹30000",
        includes: [
          "Site inspection",
          "Installation",
          "Finishing",
          "Quality check",
          "Clean up"
        ]
      },
      {
        name: "Maintenance",
        description: "Wall panel maintenance service",
        duration: "1-2 hours",
        price: "₹1000 - ₹5000",
        includes: [
          "Inspection",
          "Cleaning",
          "Repair work",
          "Finishing",
          "Service report"
        ]
      }
    ],
    benefits: [
      "Modern Designs",
      "Quality Materials",
      "Expert Installation",
      "Durable Finish"
    ],
    priceRange: "₹5000 - ₹50000"
  }
};

function ServiceDetails() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const service = categories.find(item => item.path === `/${serviceId}`);
  const details = serviceDetails[serviceId];
  const [selectedService, setSelectedService] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem("isLoggedIn") === "true"
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  if (!service || !details) {
    return (
      <div className="container my-5">
        <h2>Service not found</h2>
      </div>
    );
  }

  const handleServiceClick = (service) => {
    setSelectedService(service);
    setShowPayment(false);
  };

  const handleCloseDetails = () => {
    setSelectedService(null);
    setShowPayment(false);
  };

  const handleBookNow = () => {
    if (!isLoggedIn) {
      alert("Please login to continue to payment.");
      navigate("/login");
      return;
    }

    setShowPayment(true);
  };

  const handlePaymentSuccess = (paymentData) => {
    // Handle successful payment
    console.log('Payment successful:', paymentData);
    // You can redirect to a success page or show a success message
    setShowPayment(false);
    setSelectedService(null);
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
  };

  return (
    <div className="container my-5 service-details-container">
      <div className="row">
        <div className="col-12 text-center mb-4 service-header">
          <h1 className="display-4">{service.icon} {service.title}</h1>
          <p className="lead">{service.description}</p>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">Our Services</h3>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                {details.services.map((service, index) => (
                  <li 
                    key={index} 
                    className="list-group-item d-flex justify-content-between align-items-center cursor-pointer"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleServiceClick(service)}
                  >
                    <div>
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      {service.name}
                    </div>
                    <i className="bi bi-chevron-right"></i>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header bg-success text-white">
              <h3 className="mb-0">Benefits</h3>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                {details.benefits.map((benefit, index) => (
                  <li key={index} className="list-group-item">
                    <i className="bi bi-star-fill text-warning me-2"></i>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {selectedService && !showPayment && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedService.name}</h5>
                <button type="button" className="btn-close" onClick={handleCloseDetails}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6>Description</h6>
                    <p>{selectedService.description}</p>
                    <h6>Duration</h6>
                    <p>{selectedService.duration}</p>
                    <h6>Price Range</h6>
                    <p>{selectedService.price}</p>
                  </div>
                  <div className="col-md-6">
                    <h6>Includes</h6>
                    <ul className="list-unstyled">
                      {selectedService.includes.map((item, index) => (
                        <li key={index} className="mb-2">
                          <i className="bi bi-check2-circle text-success me-2"></i>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={handleBookNow}>Book This Service</button>
                <button className="btn btn-secondary" onClick={handleCloseDetails}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPayment && selectedService && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Payment</h5>
                <button type="button" className="btn-close" onClick={handlePaymentCancel}></button>
              </div>
              <div className="modal-body">
                <PaymentForm
                  service={selectedService}
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentCancel={handlePaymentCancel}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-info text-white">
              <h3 className="mb-0">Price Range</h3>
            </div>
            <div className="card-body">
              <h4 className="text-center">{details.priceRange}</h4>
              <p className="text-center text-muted">*Prices may vary based on specific requirements</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12 text-center">
          <button className="btn btn-primary btn-lg">Book Now</button>
          <button className="btn btn-outline-primary btn-lg ms-3">Contact Us</button>
        </div>
      </div>
    </div>
  );
}

export default ServiceDetails; 