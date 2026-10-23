// ===== Campaign dates (Philippine time) =====
const CAMPAIGN_START = new Date("2026-11-02T00:00:00+08:00");
const CAMPAIGN_END   = new Date("2026-12-01T23:59:59+08:00");

// ===== Menu data (prices follow the marketing plan: small = low end, large = high end) =====
const MENU = {
  coffee: {
    name: "Coffee", price: { s: 90, m: 105, l: 120 },
    desc: "Hot or iced coffee in different flavors, perfect for studying or taking a break.",
    flavors: [
      { n: "Americano", c: "#2a1a12" }, { n: "Caramel Macchiato", c: "#b8793f" },
      { n: "Spanish Latte", c: "#c9a27a" }, { n: "Mocha", c: "#4a2a1c" },
      { n: "Vanilla Latte", c: "#d3b58a" }, { n: "Hazelnut Latte", c: "#8a5a36" }
    ]
  },
  refreshers: {
    name: "Refreshers", price: { s: 70, m: 85, l: 100 },
    desc: "Fruity and refreshing drinks for anyone who wants something cold and non-coffee.",
    flavors: [
      { n: "Strawberry", c: "#e0546f" }, { n: "Mango", c: "#f2a93b" },
      { n: "Lychee", c: "#efc7cf" }, { n: "Blueberry", c: "#5a5fc2" },
      { n: "Green Apple", c: "#8fc15a" }, { n: "Peach Passionfruit", c: "#f08d5a" }
    ]
  },
  matcha: {
    name: "Matcha", price: { s: 130, m: 140, l: 150 },
    desc: "Creamy matcha drinks for those who want a different flavor aside from coffee.",
    flavors: [
      { n: "Classic Matcha Latte", c: "#7aa35c" }, { n: "Strawberry Matcha", c: "#c9788a" },
      { n: "Vanilla Matcha", c: "#a9c58a" }, { n: "Coconut Matcha", c: "#cfe0b8" },
      { n: "Honey Matcha", c: "#c3b04f" }, { n: "Dirty Matcha", c: "#5d6b3f" }
    ]
  }
};
const SIZE_NAMES = { s: "Small", m: "Medium", l: "Large" };

// ===== Size / flavor picker =====
const picker = document.getElementById("picker");
const tabs = picker.querySelectorAll(".tab");
const sizeBtns = picker.querySelectorAll(".size");
const flavorBox = document.getElementById("flavors");
let cat = "coffee", size = "s", flavor = 0;

function buildFlavors() {
  flavorBox.innerHTML = "";
  MENU[cat].flavors.forEach((f, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "flav";
    b.style.setProperty("--dot", f.c);
    b.innerHTML = "<i></i>" + f.n;
    b.addEventListener("click", () => { flavor = i; render(); });
    flavorBox.appendChild(b);
  });
}

function render() {
  const item = MENU[cat], f = item.flavors[flavor];
  picker.style.setProperty("--liq", f.c);
  document.getElementById("desc").textContent = item.desc;
  picker.querySelectorAll(".p").forEach((el) => (el.textContent = "₱" + item.price[el.dataset.p]));
  document.getElementById("sel-name").textContent = f.n + " · " + SIZE_NAMES[size];
  document.getElementById("sel-price").textContent = "₱" + item.price[size];
  tabs.forEach((t) => t.classList.toggle("on", t.dataset.cat === cat));
  sizeBtns.forEach((b) => b.classList.toggle("on", b.dataset.size === size));
  flavorBox.querySelectorAll(".flav").forEach((b, i) => b.classList.toggle("on", i === flavor));
}

tabs.forEach((t) => t.addEventListener("click", () => { cat = t.dataset.cat; flavor = 0; buildFlavors(); render(); }));
sizeBtns.forEach((b) => b.addEventListener("click", () => { size = b.dataset.size; render(); }));
buildFlavors();
render();

// ===== Mobile menu =====
const links = document.getElementById("links");
const menuBtn = document.getElementById("menu-btn");
menuBtn.addEventListener("click", () => {
  menuBtn.setAttribute("aria-expanded", links.classList.toggle("open"));
});
links.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => links.classList.remove("open")));

// ===== Nav background on scroll =====
const nav = document.getElementById("nav");
const onScroll = () => nav.classList.toggle("stuck", window.scrollY > 30);
window.addEventListener("scroll", onScroll);
onScroll();

// ===== Footer year =====
document.getElementById("year").textContent = new Date().getFullYear();

// ===== Reveal on scroll =====
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("show"); revealObs.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((el) => revealObs.observe(el));

// ===== Countdown + offer state =====
const timerBox = document.getElementById("timer");
const timerLabel = document.getElementById("timer-label");
const expiredMsg = document.getElementById("expired");
const submitBtn = document.getElementById("submit-btn");
const pad = (n) => String(n).padStart(2, "0");
let offerEnded = false;

function tick() {
  const now = new Date();
  let target, label;
  if (now < CAMPAIGN_START) { target = CAMPAIGN_START; label = "Offer starts in"; }
  else if (now <= CAMPAIGN_END) { target = CAMPAIGN_END; label = "Offer ends in"; }
  else {
    offerEnded = true;
    timerBox.hidden = true; timerLabel.hidden = true; expiredMsg.hidden = false;
    submitBtn.disabled = true; submitBtn.textContent = "Offer ended";
    return;
  }
  const s = Math.floor((target - now) / 1000);
  document.getElementById("t-d").textContent = pad(Math.floor(s / 86400));
  document.getElementById("t-h").textContent = pad(Math.floor((s % 86400) / 3600));
  document.getElementById("t-m").textContent = pad(Math.floor((s % 3600) / 60));
  document.getElementById("t-s").textContent = pad(s % 60);
  timerLabel.textContent = label;
  setTimeout(tick, 1000);
}
tick();

// ===== Lead form (validation + simulated success) =====
const form = document.getElementById("lead-form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const consent = document.getElementById("consent");

function setError(input, id, msg) {
  document.getElementById(id).textContent = msg;
  if (input.type !== "checkbox") input.classList.toggle("bad", !!msg);
}

function validate() {
  let ok = true;
  if (nameInput.value.trim().length < 2) { setError(nameInput, "name-err", "Please enter your full name."); ok = false; }
  else setError(nameInput, "name-err", "");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emailInput.value.trim())) { setError(emailInput, "email-err", "Please enter a valid email address."); ok = false; }
  else setError(emailInput, "email-err", "");
  if (!consent.checked) { setError(consent, "consent-err", "Please agree to receive promo emails."); ok = false; }
  else setError(consent, "consent-err", "");
  return ok;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (offerEnded || !validate()) return;
  document.getElementById("success-name").textContent = nameInput.value.trim().split(" ")[0];
  document.getElementById("success").hidden = false; // simulated: nothing is stored or sent
  form.reset();
});

[nameInput, emailInput, consent].forEach((el) =>
  el.addEventListener("input", () => { if (document.getElementById(el.id + "-err").textContent) validate(); })
);
