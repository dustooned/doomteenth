// script.js

// 1. Update Body Background Gradient
function updateBodyBackground() {
  const scrollY = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = Math.min(scrollY / docHeight, 1);
  // Interpolate between dark black (rgb(0,0,0)) and dark orange (rgb(93, 140, 211))
  const r = Math.round(190 * progress);
  const g = Math.round(30 * progress);
  const b = Math.round(45 * progress);
  const color = `rgb(${r},${g},${b})`;
  // Apply as uniform background gradient
  document.body.style.background = `linear-gradient(135deg, ${color}, ${color})`;
}
window.addEventListener("scroll", updateBodyBackground);
window.addEventListener("load", updateBodyBackground);

// 3. Update Horizontal Moving SVG Position
const movingSvg = document.getElementById("moving-svg");
function updateMovingSvgPosition() {
  const scrollY = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = Math.min(scrollY / docHeight, 1);
  // Map progress linearly to 0% to 100%
  const xPercent = progress * 100;
  movingSvg.style.left = xPercent + "%";
}
window.addEventListener("scroll", updateMovingSvgPosition);
window.addEventListener("load", updateMovingSvgPosition);

function updateMovingSvgColor() {
  const scrollY = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = Math.min(scrollY / docHeight, 1); // value between 0 and 1
  
  // Define starting and ending colors:
  const startColor = { r: 255, g: 255, b: 255};
  const endColor   = {  r: 255, g: 140, b: 0 };
  
  // Linearly interpolate each color channel:
  const r = Math.round(startColor.r * (1 - progress) + endColor.r * progress);
  const g = Math.round(startColor.g * (1 - progress) + endColor.g * progress);
  const b = Math.round(startColor.b * (1 - progress) + endColor.b * progress);
  
  const newColor = `rgb(${r}, ${g}, ${b})`;
  console.log("newColor =", newColor); // Debug output
  
  // Update the moving SVG's circle fill:
  const circle = document.querySelector("#moving-svg circle");
  if (circle) {
    circle.setAttribute("fill", newColor);
  } else {
    console.warn("No <circle> element found inside #moving-svg.");
  }
}

// 4. Starfield with Ember Scroll Behavior (no opacity fade)

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
canvas.style.position = "fixed";
canvas.style.top = 0;
canvas.style.left = 0;
canvas.style.width = "100%";
canvas.style.height = "100%";
canvas.style.zIndex = "-1";
canvas.style.pointerEvents = "none";

const ctx = canvas.getContext("2d");
let width, height, particles = [];

const baseColor = "#ffffff"; // star color at top
const emberColor = "#FF4500"; // ember glow at bottom

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function lerpColor(c1, c2, t) {
  const r = Math.round(c1.r * (1 - t) + c2.r * t);
  const g = Math.round(c1.g * (1 - t) + c2.g * t);
  const b = Math.round(c1.b * (1 - t) + c2.b * t);
  return `rgb(${r}, ${g}, ${b})`;
}

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  particles = Array.from({ length: 80 }, () => createParticle());
}
window.addEventListener("resize", resize);
resize();

function createParticle() {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    baseRadius: Math.random() * 2 + 1,
    speedX: (Math.random() - 0.5) * 0.5,
    speedY: (Math.random() - 0.5) * 0.5
  };
}

function getScrollProgress() {
  const scrollY = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  return Math.min(scrollY / docHeight, 1);
}

function animate() {
  const progress = getScrollProgress();
  const speedFactor = 1 + progress * 40.5; // crank up ember speed
  const targetCount = 1 + Math.floor(progress * 200); // more stars = more embers

  while (particles.length < targetCount) {
    particles.push(createParticle());
  }

  ctx.clearRect(0, 0, width, height);

  const startRGB = hexToRgb(baseColor);
  const endRGB = hexToRgb(emberColor);

  for (let p of particles) {
    p.x += p.speedX * speedFactor;
    p.y += p.speedY * speedFactor;

    if (p.x < 0 || p.x > width) p.speedX *= -1;
    if (p.y < 0 || p.y > height) p.speedY *= -1;

    ctx.beginPath();
    const dynamicRadius = p.baseRadius * (1 + progress * 1.5); // grows up to 2.5x
    ctx.arc(p.x, p.y, dynamicRadius, 0, Math.PI * 2);
    ctx.fillStyle = lerpColor(startRGB, endRGB, progress);
    ctx.fill();
  }

  requestAnimationFrame(animate);
}
animate();

window.addEventListener("scroll", updateMovingSvgColor);
window.addEventListener("load", updateMovingSvgColor);

function fadeTopQuote() {
  const quote = document.getElementById("top-quote");
  const scrollY = window.scrollY;
  if (quote) {
    quote.style.opacity = scrollY > 30 ? "0" : "1";
  }
}
window.addEventListener("scroll", fadeTopQuote);
window.addEventListener("load", fadeTopQuote);

function fadeHeaderAndFooter() {
  const scrollY = window.scrollY;

  const header = document.querySelector("header");
  if (header) {
    header.style.opacity = scrollY > 40 ? "0.6" : "1";
  }

  const footer = document.querySelector("footer");
  if (footer) {
    footer.style.opacity = scrollY > 40 ? "0.6" : "1";
  }
}

window.addEventListener("scroll", fadeHeaderAndFooter);
window.addEventListener("load", fadeHeaderAndFooter);


function adjustResponsiveElements() {
  const isMobile = window.innerWidth < 768;

  const quote = document.getElementById("top-quote");
  if (quote) {
    quote.style.fontSize = isMobile ? "1.2rem" : "3.5rem";
    quote.style.top = isMobile ? "1rem" : "2rem";
  }

  const fire = document.getElementById("bottom-graphic");
  if (fire) {
    fire.style.maxHeight = isMobile ? "100px" : "200px";
  }
}

window.addEventListener("resize", adjustResponsiveElements);
window.addEventListener("load", adjustResponsiveElements);

function updateFooterVisibility() {
  const footer = document.querySelector("footer");
  const scrollY = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = Math.min(scrollY / docHeight, 1);

  // Show when past 90% of page scroll
  if (progress > 0.9) {
    footer.style.opacity = 1;
  } else {
    footer.style.opacity = 0;
  }
}

window.addEventListener("scroll", updateFooterVisibility);
window.addEventListener("load", updateFooterVisibility);

function updateBottomBannerVisibility() {
  const banner = document.getElementById("fixed-bottom-banner");
  const scrollY = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = Math.min(scrollY / docHeight, 1);

  if (progress > 0.9) {
    banner.style.opacity = 1;
  } else {
    banner.style.opacity = 0;
  }
}

window.addEventListener("scroll", updateBottomBannerVisibility);
window.addEventListener("load", updateBottomBannerVisibility);
