// ================= FORM SUBMIT (GOOGLE SHEET CONNECTED) =================
const form = document.getElementById('bookingForm');

if(form){
  form.addEventListener('submit', function(e){
    e.preventDefault();

    const inputs = form.querySelectorAll('input');
    let valid = true;

    inputs.forEach(input => {
      if(input.value.trim() === ''){
        input.style.border = "2px solid red";
        valid = false;
      } else {
        input.style.border = "1px solid #ccc";
      }
    });

    if(!valid){
      showMessage("❌ Please fill all fields", "error");
      return;
    }

    const btn = form.querySelector('button');
    btn.innerHTML = "Submitting...";
    btn.disabled = true;

    // GET DATA
    const data = {
      name: form.querySelector('input[placeholder="Full Name"]').value,
      phone: form.querySelector('input[placeholder="Phone Number"]').value,
      email: form.querySelector('input[placeholder="Email Address"]').value,
      destination: form.querySelector('input[placeholder="Destination (Goa, Manali, Dubai...)"]').value,
      date: form.querySelector('input[type="date"]').value,
      people: form.querySelector('input[placeholder="Number of People"]').value
    };

    // 🔥 REPLACE THIS WITH YOUR REAL WEB APP URL
    fetch("https://script.google.com/macros/s/AKfycby7ZCPueHHUWBmbGvJqNoeKeGebPFVOlg8k055tlWFvhSZ4CdKIu45talHJbCKLzZwd/exec", {
      method: "POST",
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(res => {
      showMessage("✅ Booking Saved Successfully!", "success");
      form.reset();
    })
    .catch(err => {
      showMessage("❌ Failed! Check Web App URL", "error");
    })
    .finally(() => {
      btn.innerHTML = "🚀 Submit Booking";
      btn.disabled = false;
    });
  });
}

// ================= MESSAGE FUNCTION =================
function showMessage(text, type){
  let msg = document.createElement('div');
  msg.innerText = text;

  msg.style.position = "fixed";
  msg.style.top = "20px";
  msg.style.left = "50%";
  msg.style.transform = "translateX(-50%)";
  msg.style.padding = "12px 20px";
  msg.style.borderRadius = "10px";
  msg.style.color = "white";
  msg.style.zIndex = "1000";
  msg.style.fontWeight = "bold";

  msg.style.background = (type === "success") ? "green" : "red";

  document.body.appendChild(msg);

  setTimeout(() => msg.remove(), 3000);
}

// ================= SCROLL ANIMATION =================
const elements = document.querySelectorAll('.fade-in');

function reveal(){
  elements.forEach(el => {
    const position = el.getBoundingClientRect().top;
    const screenPosition = window.innerHeight / 1.2;

    if(position < screenPosition){
      el.classList.add('show');
    }
  });
}

window.addEventListener('scroll', reveal);
window.addEventListener('load', reveal);

// ================= SMOOTH SCROLL =================
document.querySelectorAll('a[href^=\"#\"]').forEach(anchor => {
  anchor.addEventListener('click', function(e){
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});
