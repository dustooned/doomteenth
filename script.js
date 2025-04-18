
// 1. Update Body Background Gradient
function updateBodyBackground() {
  const scrollY = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = Math.min(scrollY / docHeight, 1);
  const r = Math.round(190 * progress);
  const g = Math.round(30 * progress);
  const b = Math.round(45 * progress);
  const color = `rgb(${r},${g},${b})`;
  document.body.style.background = `linear-gradient(135deg, ${color}, ${color})`;
}
window.addEventListener("scroll", updateBodyBackground);
window.addEventListener("load", updateBodyBackground);

// 2. Update Horizontal Moving SVG Position
const movingSvg = document.getElementById("moving-svg");
function updateMovingSvgPosition() {
  const scrollY = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = Math.min(scrollY / docHeight, 1);
  const xPercent = progress * 100;
  movingSvg.style.left = xPercent + "%";
}
window.addEventListener("scroll", updateMovingSvgPosition);
window.addEventListener("load", updateMovingSvgPosition);

// 3. Update SVG Color on Scroll
function updateMovingSvgColor() {
  const scrollY = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = Math.min(scrollY / docHeight, 1);
  const startColor = { r: 255, g: 255, b: 255 };
  const endColor = { r: 255, g: 140, b: 0 };
  const r = Math.round(startColor.r * (1 - progress) + endColor.r * progress);
  const g = Math.round(startColor.g * (1 - progress) + endColor.g * progress);
  const b = Math.round(startColor.b * (1 - progress) + endColor.b * progress);
  const newColor = `rgb(${r}, ${g}, ${b})`;
  const circle = document.querySelector("#moving-svg circle");
  if (circle) {
    circle.setAttribute("fill", newColor);
  }
}
window.addEventListener("scroll", updateMovingSvgColor);
window.addEventListener("load", updateMovingSvgColor);

// 4. Starfield with Ember Scroll Behavior
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

const baseColor = "#ffffff";
const emberColor = "#FF4500";

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
  const speedFactor = 1 + progress * 40.5;
  const targetCount = 1 + Math.floor(progress * 200);
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
    const dynamicRadius = p.baseRadius * (1 + progress * 1.5);
    ctx.arc(p.x, p.y, dynamicRadius, 0, Math.PI * 2);
    ctx.fillStyle = lerpColor(startRGB, endRGB, progress);
    ctx.fill();
  }
  requestAnimationFrame(animate);
}
animate();

// 5. Fade Top Quote
function fadeTopQuote() {
  const section = document.querySelector(".top-quote-section");
  const scrollY = window.scrollY;
  
  if (section) {
    if (scrollY > 30) {
      section.style.opacity = "0";
      section.style.maxHeight = "0";
      section.style.overflow = "hidden";
    } else {
      section.style.opacity = "1";
      section.style.maxHeight = "400px"; // or whatever your desired height is
      section.style.overflow = "visible";
    }
  }
}
window.addEventListener("scroll", fadeTopQuote);
window.addEventListener("load", fadeTopQuote);

// 6. Fade Header, Logo, and Footer
function fadeHeaderAndFooter() {
  const scrollY = window.scrollY;
  const header = document.querySelector("header");
  const logo = document.querySelector(".header-logo");
  const footer = document.querySelector("footer");

  const fadeStart = 10;
  const fadeEnd = 80;

  let opacityValue = 1;
  if (scrollY > fadeStart) {
    opacityValue = Math.max(0, 1 - (scrollY - fadeStart) / (fadeEnd - fadeStart));
  }

  if (header) header.style.opacity = opacityValue;
  if (logo) logo.style.opacity = opacityValue;

  if (footer) {
    footer.style.opacity = scrollY > 40 ? "0.6" : "1";
  }
}
window.addEventListener("scroll", fadeHeaderAndFooter);
window.addEventListener("load", fadeHeaderAndFooter);

// 7. Adjust Responsive Elements
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

// 8. Show Footer and Banner on Scroll Threshold
function updateFooterVisibility() {
  const footer = document.querySelector("footer");
  const scrollY = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = Math.min(scrollY / docHeight, 1);
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
window.addEventListener("load", () => {
  const logo = document.getElementById("logo-img");
  const quote = document.getElementById("top-quote");

  if (logo && logo.complete) {
    logo.classList.add("animate-up");
  } else if (logo) {
    logo.addEventListener("load", () => {
      logo.classList.add("animate-up");
    });
  }

  if (quote) {
    setTimeout(() => {
      quote.classList.add("animate-up");
    }, 500); // 👈 Delay to follow the logo smoothly
  }
});

