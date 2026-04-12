// ================= FORM SUBMIT (GOOGLE SHEET CONNECTED) =================
const form = document.getElementById("bookingForm");

if (form) {
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const inputs = form.querySelectorAll("input");
    let isValid = true;

    // Validate inputs
    inputs.forEach((input) => {
      if (!input.value.trim()) {
        input.classList.add("input-error");
        isValid = false;
      } else {
        input.classList.remove("input-error");
      }
    });

    if (!isValid) {
      showToast("❌ Please fill all fields correctly", "error");
      return;
    }

    const btn = form.querySelector("button");
    const originalText = btn.innerHTML;

    btn.innerHTML = "⏳ Submitting...";
    btn.disabled = true;

    // Safer data collection (NO placeholders dependency)
    const data = {
      name: form.elements[0].value,
      phone: form.elements[1].value,
      email: form.elements[2].value,
      destination: form.elements[3].value,
      date: form.elements[4].value,
      people: form.elements[5].value,
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
      showToast("❌ Submission Failed! Try Again", "error");
      console.error(error);
    } finally {
      btn.innerHTML = originalText;
      btn.disabled = false;
    }
  });
}

// ================= MODERN TOAST MESSAGE =================
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
    transition: "all 0.3s ease"
  });

  document.body.appendChild(toast);

  // animate in
  setTimeout(() => {
    toast.style.opacity = "1";
    toast.style.top = "30px";
  }, 50);

  // remove
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.top = "10px";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ================= SCROLL ANIMATION (OPTIMIZED) =================
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
  {
    threshold: 0.15
  }
);

fadeElements.forEach((el) => observer.observe(el));

// ================= SMOOTH SCROLL =================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth"
      });
    }
  });
});
