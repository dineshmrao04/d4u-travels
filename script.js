const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxWArCmpbhWzUNk5w4QiV1D7u52LtYyOnqKCGO4sU9dAYwRnAo9bg3-uo0q20-B6Sgc/exec";

/* ================= FORM SUBMIT ================= */

const form = document.getElementById("bookingForm");

if (form) {
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const btn = form.querySelector("button");
    const originalText = btn.innerHTML;

    const fields = form.querySelectorAll("input, textarea");
    let isValid = true;

    // VALIDATION
    fields.forEach((field) => {
      if (!field.value.trim()) {
        field.style.border = "2px solid red";
        isValid = false;
      } else {
        field.style.border = "1px solid #ddd";
      }
    });

    if (!isValid) {
      showToast("❌ Please fill all fields correctly", "error");
      return;
    }

    btn.innerHTML = "⏳ Submitting...";
    btn.disabled = true;

    // DATA (must match Apps Script keys)
    const data = {
      name: form.querySelector('[name="name"]')?.value || "",
      email: form.querySelector('[name="email"]')?.value || "",
      from: form.querySelector('[name="from"]')?.value || "",
      to: form.querySelector('[name="to"]')?.value || "",
      date: form.querySelector('[name="date"]')?.value || "",
      people: form.querySelector('[name="people"]')?.value || "",
      time: new Date().toISOString()
    };

    try {
      // 🔥 IMPORTANT FIX: use URLSearchParams (NOT JSON)
      const formData = new URLSearchParams();

      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("from", data.from);
      formData.append("to", data.to);
      formData.append("date", data.date);
      formData.append("people", data.people);
      formData.append("time", data.time);

      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        body: formData
      });

      const result = await response.text();
      console.log("Google Sheet Response:", result);

      showToast("✅ Booking Submitted Successfully!", "success");
      form.reset();

    } catch (error) {
      console.error("Submission Error:", error);
      showToast("❌ Submission Failed! Try Again", "error");
    } finally {
      btn.innerHTML = originalText;
      btn.disabled = false;
    }
  });
}

/* ================= TOAST ================= */

function showToast(message, type = "success") {
  const toast = document.createElement("div");

  toast.innerText = message;

  Object.assign(toast.style, {
    position: "fixed",
    top: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    padding: "14px 22px",
    borderRadius: "12px",
    fontWeight: "600",
    fontSize: "14px",
    color: "#fff",
    background: type === "success" ? "#22c55e" : "#ef4444",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    zIndex: "9999",
    opacity: "0",
    transition: "0.3s",
    maxWidth: "90%",
    textAlign: "center"
  });

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "1";
    toast.style.top = "30px";
  }, 50);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.top = "10px";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/* ================= MOBILE MENU ================= */

const toggle = document.getElementById("menuToggle");
const nav = document.getElementById("navMenu");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    nav.classList.toggle("active");
  });
}
