import { useEffect, useState } from "react";

import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

function Payment() {
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    axios
      .get("/config")
      .then(async (response) => {
        const { publishableKey } = response.data;

        console.log(publishableKey);
        setStripePromise(loadStripe(publishableKey));
      })
      .catch((error) => {
        console.error("Error fetching config:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .post("/create-payment-intent", {})
      .then(async (response) => {
        const { clientSecret } = response.data;

        console.log(clientSecret);
        setClientSecret(clientSecret);
      })
      .catch((error) => {
        console.error("Error creating payment intent:", error);
      });
  }, []);

   const [price, setPrice] = useState(199)

  return (
    <>
      <h1>React Stripe and the Payment Element</h1>
      <h1>Rs. {price}</h1>
      {clientSecret && stripePromise && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm  price={price}/>
        </Elements>
      )}
    </>
  );
}

export default Payment;
