import { confirmPayment, tokenizeCard, tokenizeUpi } from "./api.js";
import Modal from "./modal.js";
import modalCss from "./styles.css";

function injectStyles(css) {
  const style = document.createElement("style");
  style.innerHTML = css;
  document.head.appendChild(style);
}

injectStyles(modalCss);

class PaymentGateway {
  constructor({ key, baseUrl }) {
    this.key = key;
    this.baseUrl = baseUrl;
  }

  open(options) {
    Modal.open(options, async (payload) => {
      let confirmPayload = {};

      if (payload.method === "card") {
        const token = await tokenizeCard(this.baseUrl, payload, this.key);

        confirmPayload = {
          paymentMethodToken: token,
          paymentMethod: "CARD",
          cardNetwork: detectCardNetwork(payload.card.number),
        };
      }

      else if (payload.method === "upi") {
        const token = await tokenizeUpi(this.baseUrl, payload.upi.id, this.key);

        confirmPayload = {
          paymentMethodToken: token,
          paymentMethod: "UPI",
          upiApp: detectUpiApp(payload.upi.id),
        };
      }

      else if (payload.method === "netbanking") {
        confirmPayload = {
          paymentMethodToken: "netbanking_dummy",
          paymentMethod: "NET_BANKING",
          bankCode: payload.netbanking.bank,
        };
      }

      else if (payload.method === "wallet") {
        confirmPayload = {
          paymentMethodToken: "wallet_dummy",
          paymentMethod: "WALLET",
        };
      }

      const result = await confirmPayment(
        this.baseUrl,
        options.intentId,
        confirmPayload,
        this.key
      );

      Modal.showResult(result);
    });

  }
}

// ---------------- HELPERS ----------------

function detectCardNetwork(cardNumber = "") {
  if (cardNumber.startsWith("4")) return "VISA";
  if (cardNumber.startsWith("5")) return "MASTERCARD";
  if (cardNumber.startsWith("6")) return "RUPAY";
  return "UNKNOWN";
}

function detectUpiApp(upiId = "") {
  if (upiId.includes("okhdfc")) return "gpay";
  if (upiId.includes("ybl")) return "phonepe";
  if (upiId.includes("paytm")) return "paytm";
  return "other";
}

window.PaymentGateway = PaymentGateway;
