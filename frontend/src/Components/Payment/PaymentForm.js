import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import "../../styles/PaymentForm.css";

const PaymentForm = ({ service, onPaymentSuccess, onPaymentCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [stripeReady, setStripeReady] = useState(false);

  useEffect(() => {
    if (stripe && elements) {
      setStripeReady(true);
    }
  }, [stripe, elements]);

  const getAmountValue = () => {
    if (typeof service.price === 'number') {
      return service.price;
    }

    const firstValue = (service.price || '').toString().split(' - ')[0];
    const numeric = parseInt(firstValue.replace(/[^\d]/g, ''), 10);
    return Number.isFinite(numeric) ? numeric : 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements || !stripeReady) {
      setError('Payment system is not ready. Please try again.');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const cardElement = elements.getElement(CardElement);
      
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (stripeError) {
        setError(stripeError.message);
        setProcessing(false);
        return;
      }

      // Here you would typically make an API call to your backend
      // For now, we'll simulate a successful payment
      try {
        const response = await axios.post('/api/create-payment', {
          paymentMethodId: paymentMethod.id,
          amount: getAmountValue(),
          service: service.name,
          currency: 'inr'
        });

        if (response.data.success) {
          setPaymentSuccess(true);
          onPaymentSuccess(response.data);
        } else {
          setError('Payment failed. Please try again.');
        }
      } catch (apiError) {
        console.error('API Error:', apiError);
        setError('Payment processing failed. Please try again.');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError('An error occurred. Please try again.');
    }

    setProcessing(false);
  };

  if (paymentSuccess) {
    return (
      <div className="payment-success">
        <div className="success-icon">✓</div>
        <h3>Payment Successful!</h3>
        <p>Thank you for booking {service.name}</p>
        <p>We'll send you a confirmation email shortly.</p>
        <button 
          className="btn btn-primary mt-3"
          onClick={() => onPaymentSuccess({ service })}
        >
          Continue
        </button>
      </div>
    );
  }

  if (!stripeReady) {
    return (
      <div className="payment-loading">
        <p>Loading payment system...</p>
      </div>
    );
  }

  return (
    <div className="payment-form-container">
      <div className="payment-header">
        <h3>Payment Details</h3>
        <p>Booking: {service.name}</p>
        <p>Amount: {service.price}</p>
      </div>

      <form onSubmit={handleSubmit} className="payment-form">
        <div className="form-group">
          <label>Card Details</label>
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>

        {error && (
          <div className="payment-error">
            {error}
          </div>
        )}

        <div className="payment-buttons">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!stripeReady || processing}
          >
          {processing ? 'Processing...' : `Pay ₹${getAmountValue()}`}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onPaymentCancel}
            disabled={processing}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm; 