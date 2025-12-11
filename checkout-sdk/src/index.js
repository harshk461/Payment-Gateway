import Modal from "./modal.js";
import { tokenizeCard, confirmPayment } from "./api.js";
import modalCss from "./styles.css";

function injectStyles(css) {
  const style = document.createElement("style");
  style.innerHTML = css;
  document.head.appendChild(style);
}

injectStyles(modalCss);

class PaymentGateway {
  constructor(options) {
    this.key = options.key;
    this.baseUrl = options.baseUrl;
  }

  open(options) {
    this.options = options;
    Modal.open(options, async (cardDetails) => {
      const token = await tokenizeCard(this.baseUrl, cardDetails);

      const paymentResult = await confirmPayment(
        this.baseUrl,
        options.intentId,
        token
      );

      Modal.showResult(paymentResult);
    });
  }
}

window.PaymentGateway = PaymentGateway;
