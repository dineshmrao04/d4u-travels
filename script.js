/* ================= FORM SUBMIT (GOOGLE SHEET CONNECTED) ================= */

const form = document.getElementById("bookingForm");

if (form) {
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const btn = form.querySelector("button");
    const originalText = btn.innerHTML;

    // Validate inputs (mobile + desktop safe)
    const inputs = form.querySelectorAll("input, textarea");
    let isValid = true;

    inputs.forEach((input) => {
      if (!input.value.trim()) {
        input.style.border = "2px solid red";
        isValid = false;
      } else {
        input.style.border = "1px solid #ddd";
      }
    });

    if (!isValid) {
      showToast("❌ Please fill all fields", "error");
      return;
    }

    btn.innerHTML = "⏳ Submitting...";
    btn.disabled = true;

    // SAFE DATA COLLECTION (NO INDEX DEPENDENCY)
    const data = {
      name: form.querySelector('[name="name"]')?.value || "",
      email: form.querySelector('[name="email"]')?.value || "",
      destination: form.querySelector('[name="destination"]')?.value || "",
      date: form.querySelector('[name="date"]')?.value || "",
      people: form.querySelector('[name="people"]')?.value || "",
      time: new Date().toISOString()
    };

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycby7ZCPueHHUWBmbGvJqNoeKeGebPFVOlg8k055tlWFvhSZ4CdKIu45talHJbCKLzZwd/exec",
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      await response.text();

      showToast("✅ Booking Submitted Successfully!", "success");
      form.reset();

    } catch (error) {
      console.error("Error:", error);
      showToast("❌ Submission Failed! Try Again", "error");
    } finally {
      btn.innerHTML = originalText;
      btn.disabled = false;
    }
  });
}

/* ================= TOAST NOTIFICATION ================= */

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
    transition: "all 0.3s ease",
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

/* ================= SCROLL ANIMATION ================= */

const fadeElements = document.querySelectorAll(".fade-in");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

fadeElements.forEach((el) => observer.observe(el));

/* ================= SMOOTH SCROLL ================= */

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

/* ================= MOBILE MENU SUPPORT ================= */

const toggle = document.getElementById("menuToggle");
const nav = document.getElementById("navMenu");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    nav.classList.toggle("active");
  });
}
