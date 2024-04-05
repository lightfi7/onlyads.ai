import React from "react";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function Paypal({ amount, onMessage, approved, apiKey }) {
  const initialOptions = {
    clientId: apiKey, //"ATJpwIkJr_iFNaUjlSxR_uY_GA1WyL4RHAyHMzQSVVMPUHXZP4mbIODrks71xNBGoABBg0gC9pST74LO",
    currency: "USD",
  };
  const createOrder = (data, actions) => {
    return actions.order
      .create({
        k: '####',
        purchase_units: [
          {
            amount: {
              value: amount,
            },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  };

  const onApprove = (data, actions) => {
    return actions.order.capture().then(function (details) {
      approved();
    });
  };

  const onError = (err) => {
    const message = {
      s: "warning",
      t: "Something went wrong, please try again.",
    };
    onMessage(message);
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <PayPalButtons
        createOrder={createOrder}
        onApprove={onApprove}
        onError={onError}
      />
    </PayPalScriptProvider>
  );
}
