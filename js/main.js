const canvas = document.getElementById("embers");
const ctx = canvas.getContext("2d");
const sparks = [];

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function spawn(fromTop) {
  sparks.push({
    x: Math.random() * canvas.width,
    y: fromTop ? Math.random() * canvas.height : canvas.height + 8,
    r: Math.random() * 1.8 + 0.4,
    v: Math.random() * 0.45 + 0.15,
    a: Math.random() * 0.55 + 0.2,
    w: Math.random() * 0.6 + 0.15
  });
}

function tick() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  while (sparks.length < 70) spawn(true);
  sparks.forEach((s) => {
    s.y -= s.v;
    s.x += Math.sin(s.y * 0.01) * s.w;
    if (s.y < -8) {
      s.y = canvas.height + 8;
      s.x = Math.random() * canvas.width;
    }
    ctx.beginPath();
    ctx.fillStyle = `rgba(255, 206, 120, ${s.a})`;
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  });
  requestAnimationFrame(tick);
}

const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
if (!motion.matches) {
  resize();
  window.addEventListener("resize", resize);
  tick();
}

const nav = document.querySelector(".nav");
const onScroll = () => {
  nav.style.background = window.scrollY > 24
    ? "rgba(9, 12, 17, 0.88)"
    : "rgba(9, 12, 17, 0.62)";
};
window.addEventListener("scroll", onScroll, { passive: true });

document.querySelectorAll(".ca").forEach((button) => {
  button.addEventListener("click", async () => {
    const address = button.dataset.ca;
    try {
      await navigator.clipboard.writeText(address);
    } catch {
      const area = document.createElement("textarea");
      area.value = address;
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    const label = button.querySelector("em");
    label.textContent = "Copied";
    button.classList.add("copied");
    setTimeout(() => {
      label.textContent = "Copy";
      button.classList.remove("copied");
    }, 1600);
  });
});
