const canvas = document.getElementById("patternCanvas");
const ctx = canvas.getContext("2d");

let w, h;
let mouse = { x: 0, y: 0 };
let time = 0;

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

// ---- Pattern particles (illustration feel) ----
const dots = [];
const DOT_COUNT = 160;

for (let i = 0; i < DOT_COUNT; i++) {
  dots.push({
    x: Math.random() * w,
    y: Math.random() * h,
    ox: Math.random() * w,
    oy: Math.random() * h,
    r: 80 + Math.random() * 120,
    speed: 0.0005 + Math.random() * 0.001
  });
}

function draw() {
  ctx.clearRect(0, 0, w, h);

  // background
  const bg = ctx.createRadialGradient(
    w / 2, h / 2, 0,
    w / 2, h / 2, w
  );
  bg.addColorStop(0, "#1a1a1a");
  bg.addColorStop(1, "#000");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  dots.forEach(d => {
    // organic drift
    const dx = mouse.x - d.x;
    const dy = mouse.y - d.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    const influence = Math.max(0, 1 - dist / 300);

    d.x += Math.sin(time + d.ox) * d.speed * w + dx * influence * 0.02;
    d.y += Math.cos(time + d.oy) * d.speed * h + dy * influence * 0.02;

    // soft wrap
    if (d.x < -200) d.x = w + 200;
    if (d.x > w + 200) d.x = -200;
    if (d.y < -200) d.y = h + 200;
    if (d.y > h + 200) d.y = -200;

    // color (storybook palette)
    ctx.beginPath();
    ctx.fillStyle = `rgba(180, 190, 220, 0.12)`;
    ctx.arc(d.x, d.y, d.r * influence + d.r * 0.6, 0, Math.PI * 2);
    ctx.fill();
  });

  time += 0.005;
  requestAnimationFrame(draw);
}

draw();
