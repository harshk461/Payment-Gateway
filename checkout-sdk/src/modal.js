import { confirmPayment, tokenizeCard, tokenizeUpi } from "./api";

// modal.js
const Modal = {
  open(options, onPay) {
    const root = document.createElement("div");
    root.id = "pg-root";

    root.innerHTML = `
      <div class="pg-backdrop"></div>

      <div class="pg-box pg-animate-in">
        <button class="pg-close-btn" aria-label="Close payment modal">&times;</button>

        <div class="pg-header">
          <div>
            <h2>Complete your payment</h2>
            <p class="pg-subtitle">${options.merchantName ?? "Secure checkout"}</p>
          </div>
          <div class="pg-amount-chip">
            <span>Payable</span>
            <strong>₹${(options.amount / 100).toFixed(2)}</strong>
          </div>
        </div>

        <div class="pg-tabs">
          <button class="pg-tab pg-tab-active" data-tab="card">Cards</button>
          <button class="pg-tab" data-tab="upi">UPI</button>
          <button class="pg-tab" data-tab="wallet">Wallets</button>
          <button class="pg-tab" data-tab="netbanking">Netbanking</button>
          <button class="pg-tab" data-tab="cod">Cash on delivery</button>
        </div>

        <div class="pg-body">
          <!-- Card form -->
          <div class="pg-tab-panel" data-panel="card">
            <div class="pg-card-row">
              <input class="pg-input" id="pg-card-num" placeholder="Card number" />
              <div class="pg-card-brands">
                <span class="pg-pill">VISA</span>
                <span class="pg-pill">Mastercard</span>
                <span class="pg-pill">RuPay</span>
              </div>
            </div>

            <div class="pg-row">
              <input class="pg-input small" id="pg-exp-month" placeholder="MM" />
              <input class="pg-input small" id="pg-exp-year" placeholder="YY" />
              <input class="pg-input small" id="pg-cvv" placeholder="CVV" />
            </div>

            <label class="pg-save-card">
              <input type="checkbox" id="pg-save-card" />
              <span>Securely save this card for faster checkout</span>
            </label>
          </div>

          <!-- UPI -->
          <div class="pg-tab-panel pg-hidden" data-panel="upi">
            <p class="pg-hint">Pay instantly using your UPI app.</p>
            <div class="pg-chip-row">
              <button class="pg-chip">GPay</button>
              <button class="pg-chip">PhonePe</button>
              <button class="pg-chip">Paytm</button>
              <button class="pg-chip">Other UPI</button>
            </div>
            <input class="pg-input" id="pg-upi-id" placeholder="name@bank or UPI ID" />
          </div>

          <!-- Wallets -->
          <div class="pg-tab-panel pg-hidden" data-panel="wallet">
            <p class="pg-hint">Use one of your favourite wallets.</p>
            <div class="pg-chip-row">
              <button class="pg-chip">Amazon Pay</button>
              <button class="pg-chip">PhonePe Wallet</button>
              <button class="pg-chip">Paytm Wallet</button>
            </div>
          </div>

          <!-- Netbanking -->
          <div class="pg-tab-panel pg-hidden" data-panel="netbanking">
            <p class="pg-hint">Pay directly from your bank account.</p>
            <select class="pg-input" id="pg-bank">
              <option value="">Select your bank</option>
              <option value="hdfc">HDFC Bank</option>
              <option value="sbi">State Bank of India</option>
              <option value="icici">ICICI Bank</option>
              <option value="axis">Axis Bank</option>
              <option value="kotak">Kotak Mahindra Bank</option>
            </select>
          </div>

          <!-- COD -->
          <div class="pg-tab-panel pg-hidden" data-panel="cod">
            <p class="pg-hint">
              Pay in cash or card when the order is delivered. 
            </p>
            <label class="pg-save-card">
              <input type="checkbox" id="pg-cod-confirm" />
              <span>I will keep exact change ready, if possible.</span>
            </label>
          </div>
        </div>

        <div class="pg-footer">
          <div class="pg-secure">
            <span class="pg-lock">🔒</span>
            <span>256-bit SSL encryption. Your data is secure.</span>
          </div>
          <button id="pg-pay-btn" class="pg-btn">
            Pay ₹${(options.amount / 100).toFixed(2)}
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(root);

    // Close handlers
    const close = () => {
      document.getElementById("pg-root")?.remove();
    };
    root.querySelector(".pg-close-btn").onclick = close;
    root.querySelector(".pg-backdrop").onclick = close;

    // Tabs logic
    const tabs = root.querySelectorAll(".pg-tab");
    const panels = root.querySelectorAll(".pg-tab-panel");

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const target = tab.getAttribute("data-tab");

        tabs.forEach((t) => t.classList.remove("pg-tab-active"));
        tab.classList.add("pg-tab-active");

        panels.forEach((panel) => {
          if (panel.getAttribute("data-panel") === target) {
            panel.classList.remove("pg-hidden");
          } else {
            panel.classList.add("pg-hidden");
          }
        });
      });
    });

    // Pay handler
    document.getElementById("pg-pay-btn").onclick = () => {
      const activeTab = root
        .querySelector(".pg-tab.pg-tab-active")
        .getAttribute("data-tab");

      const payload = { method: activeTab };

      if (activeTab === "card") {
        payload.card = {
          number: document.getElementById("pg-card-num").value,
          expMonth: document.getElementById("pg-exp-month").value,
          expYear: document.getElementById("pg-exp-year").value,
          cvv: document.getElementById("pg-cvv").value,
        };
      }

      if (activeTab === "upi") {
        payload.upi = {
          id: document.getElementById("pg-upi-id").value,
        };
      }

      if (activeTab === "netbanking") {
        payload.netbanking = {
          bank: document.getElementById("pg-bank").value,
        };
      }

      if (activeTab === "wallet") {
        payload.wallet = {};
      }

      onPay(payload); // 🔥 ONLY emit
    };


  },

  showResult(result) {
    const box = document.querySelector(".pg-box");
    if (!box) return;

    box.classList.remove("pg-animate-in");
    box.classList.add("pg-animate-out");

    setTimeout(() => {
      box.innerHTML = `
        <button class="pg-close-btn" aria-label="Close payment modal" onclick="document.getElementById('pg-root').remove()">&times;</button>
        <div class="pg-header pg-center">
          <h2>${result.status}</h2>
          <p class="pg-provider">Reference: ${result.providerReference ?? "-"}</p>
        </div>
        <div class="pg-body pg-center">
          <p class="pg-hint">${result.message ?? "You can safely close this window now."}</p>
        </div>
        <div class="pg-footer pg-center">
          <button class="pg-btn" onclick="document.getElementById('pg-root').remove()">Close</button>
        </div>
      `;
      box.classList.remove("pg-animate-out");
      box.classList.add("pg-animate-in");
    }, 200);
  },
};

export default Modal;
