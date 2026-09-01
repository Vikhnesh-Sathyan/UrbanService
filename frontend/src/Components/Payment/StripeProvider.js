import React, { useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const StripeProvider = ({ children }) => {
  const [stripeLoaded, setStripeLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [stripePromise, setStripePromise] = useState(null);

  useEffect(() => {
    const stripeKey = process.env.REACT_APP_STRIPE_KEY;
    
    // Check if Stripe key is configured
    if (!stripeKey || stripeKey.trim() === '') {
      setError('Stripe key is not configured. Please set REACT_APP_STRIPE_KEY in your .env file.');
      return;
    }

    // Load Stripe with timeout
    const timeoutId = setTimeout(() => {
      if (!stripeLoaded) {
        setError('Stripe failed to load. Please check your internet connection and try again.');
      }
    }, 10000); // 10 second timeout

    const promise = loadStripe(stripeKey);
    setStripePromise(promise);

    promise
      .then((stripe) => {
        clearTimeout(timeoutId);
        if (stripe) {
          setStripeLoaded(true);
        } else {
          setError('Failed to initialize Stripe. Please check your Stripe key.');
        }
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        console.error('Error loading Stripe:', error);
        setError('Failed to load Stripe payment system. Please check your configuration.');
      });

    return () => clearTimeout(timeoutId);
  }, []);

  if (error) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center', 
        color: '#dc3545',
        backgroundColor: '#f8d7da',
        border: '1px solid #f5c6cb',
        borderRadius: '4px',
        margin: '20px'
      }}>
        <h4>Payment System Error</h4>
        <p>{error}</p>
        <p style={{ fontSize: '14px', marginTop: '10px', color: '#721c24' }}>
          Note: This is a configuration issue. Please contact the administrator.
        </p>
      </div>
    );
  }

  if (!stripeLoaded || !stripePromise) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Loading payment system...</p>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  );
};

export default StripeProvider; 