const Lazerpay = require("lazerpay-node-sdk");

// const lazerpay = new Lazerpay(process.env.LAZER_PUBLIC_KEY, process.env.LAZER_SECRET_KEY);

exports.lazerpaypayment = async (req, res) => {
  try {
    const {name,email,amount} = req.body;
    ///initialize payment

    const payment_tx = async () => {
      try {
        const transaction_payload = {
          reference: '', // Replace with a reference you generated
          customer_name: name,
          customer_email: email,
          coin: "BUSD", // BUSD, DAI, USDC or USDT
          currency: "USD", // NGN, AED, GBP, EUR
          amount: amount,
          accept_partial_payment: true, // By default it's false
          metadata: {
            type: "Wallet fund",
          }, // Metadata is an optional param
        };

        const response = await lazer.Payment.initializePayment(
          transaction_payload
        );

        
      } catch (error) {
        
      }
    };
  } catch (err) {
    res.status(400).send({
      message: err.message,
      success: false,
    });
  }
};

exports.paystack = async (req, res) => {
  try {
    ///initialize payment

    const payment_tx = async () => {
      try {
        const transaction_payload = {
          reference: "YOUR_REFERENCE", // Replace with a reference you generated
          customer_name: "Njoku Emmanuel",
          customer_email: "kalunjoku123@gmail.com",
          coin: "BUSD", // BUSD, DAI, USDC or USDT
          currency: "USD", // NGN, AED, GBP, EUR
          amount: 100,
          accept_partial_payment: true, // By default it's false
          metadata: {
            type: "Wallet fund",
          }, // Metadata is an optional param
        };

        const response = await lazer.Payment.initializePayment(
          transaction_payload
        );

        
      } catch (error) {
        
      }
    };
  } catch (err) {
    res.status(400).send({
      message: err.message,
      success: false,
    });
  }
};
