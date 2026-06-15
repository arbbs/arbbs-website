(function () {
  // Highlight active nav link
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("[data-nav]").forEach(a => {
    if (a.getAttribute("href") === path) a.classList.add("active");
  });

  // Stripe payment links (placeholders) + Pay Now button on signup page
  const STRIPE_LINKS = {
    "5 Mbps — JMD 3,500 / month": "YOUR_STRIPE_LINK_5MBPS",
    "10 Mbps — JMD 4,000 / month": "YOUR_STRIPE_LINK_10MBPS",
    "15 Mbps — JMD 6,000 / month": "YOUR_STRIPE_LINK_15MBPS",
    "25 Mbps — JMD 6,500 / month": "YOUR_STRIPE_LINK_25MBPS"
  };

  const planSelect = document.getElementById("plan");
  const payBtn = document.getElementById("payNowBtn");
  if (planSelect && payBtn) {
    const updatePay = () => {
      const v = planSelect.value;
      payBtn.href = STRIPE_LINKS[v] || "#";
      payBtn.style.opacity = STRIPE_LINKS[v] ? "1" : ".5";
      payBtn.style.pointerEvents = STRIPE_LINKS[v] ? "auto" : "none";
    };
    planSelect.addEventListener("change", updatePay);
    updatePay();
  }

  // Signup form -> submit to Google Sheets (Apps Script Web App)
  const form = document.getElementById("signupForm");
  if (!form) return;

  const status = document.getElementById("formStatus");

  // Paste your Google Apps Script Web App URL here when ready
  const SHEETS_WEBAPP_URL = "PASTE_YOUR_WEB_APP_URL_HERE";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.innerHTML = "";

    const data = new FormData(form);
    const payload = {
      fullName: (data.get("fullName") || "").toString().trim(),
      phone: (data.get("phone") || "").toString().trim(),
      email: (data.get("email") || "").toString().trim(),
      address: (data.get("address") || "").toString().trim(),
      plan: (data.get("plan") || "").toString().trim(),
      install: (data.get("install") || "").toString().trim(),
      notes: (data.get("notes") || "").toString().trim(),
    };

    if (!payload.fullName || !payload.phone || !payload.address || !payload.plan) {
      status.innerHTML = `<div class="error">Please fill in: Full Name, Phone, Address, and Package.</div>`;
      return;
    }

    // If user hasn't configured Sheets URL yet, fall back to WhatsApp
    const waFallback = () => {
      const msg =
`Hello ARBBS Services, I would like to sign up for internet service.\n\nFull Name: ${payload.fullName}\nPhone: ${payload.phone}\nEmail: ${payload.email || "N/A"}\nAddress: ${payload.address}\nPackage: ${payload.plan}\nPreferred Install Time: ${payload.install || "N/A"}\nNotes: ${payload.notes || "N/A"}\n\nPlease contact me to confirm availability and installation date.`;

      const waNumber = "8762251674";
      const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;
      status.innerHTML = `<div class="success">Google Sheets URL not set. Opening WhatsApp…</div>`;
      window.open(waUrl, "_blank", "noopener,noreferrer");
      form.reset();
    };

    if (!SHEETS_WEBAPP_URL || SHEETS_WEBAPP_URL.includes("PASTE_YOUR_WEB_APP_URL_HERE")) {
      waFallback();
      return;
    }

    try {
      status.innerHTML = `<div class="success">Submitting your request…</div>`;

      const res = await fetch(SHEETS_WEBAPP_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload)
      });

      const out = await res.json();
      if (!out.ok) throw new Error(out.error || "Submission failed");

      status.innerHTML = `<div class="success">✅ Submitted! We will contact you shortly.</div>`;
      form.reset();

    } catch (err) {
      status.innerHTML = `<div class="error">❌ Sorry, something went wrong. Please try again or contact us on WhatsApp (876-225-1674).</div>`;
      console.error(err);
    }
  });
})();
