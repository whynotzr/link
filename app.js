/* ===========================
   CONFIG
   =========================== */
const CONFIG = {
  VIDEO_SRC: "background.mp4",
  AVATAR_SRC: "avatar.gif",
  COVER_SRC: "ippo.jpg?v=1",
  AUDIO_SRC: "music.mp3",
  SOCIAL_LINKS: {
    steam: "https://steamcommunity.com/profiles/76561199230924839/",
    github: "https://github.com/whynotzr",
    x: "https://x.com/whynotZr",
    spotify: "https://open.spotify.com/user/312pertsxlnausb7ysc2hls25pce",
    discord: "https://discord.com/users/1149988983053496331"
  },
  typingStrings: ["WhynotZr💫", "WhynotZr💫 |"],
  typingSpeed: 110,
  deletingSpeed: 60,
  pauseAfterFull: 900
};

/* ===========================
   INIT (avec écran d’accueil)
   =========================== */
document.addEventListener("DOMContentLoaded", () => {
  const intro = document.getElementById("intro-screen");
  const enterBtn = document.getElementById("enter-btn");
  const video = document.getElementById("bg-video");

  // === Effet 3D interactif sur la carte ===
const card = document.querySelector(".profile-card");
if (card) {
  const intensity = 20; // plus grand = plus d'inclinaison
  const scale = 1.05;   // zoom léger

  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    const rotateX = y * -intensity;
    const rotateY = x * intensity;

    card.style.transform = `
      perspective(800px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      scale(${scale})
    `;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = `
      perspective(800px)
      rotateX(0deg)
      rotateY(0deg)
      scale(1)
    `;
    card.style.transition = "transform 0.3s ease"; // retour fluide
    setTimeout(() => {
      card.style.transition = ""; // reset transition après retour
    }, 300);
  });
}

  // 🟢 Quand on clique sur "Entrer"
  enterBtn.addEventListener("click", () => {
    intro.style.display = "none";

    // 🎥 Vidéo
    const bgSource = document.querySelector("#bg-video source");
    if (bgSource) {
      bgSource.src = CONFIG.VIDEO_SRC;
      bgSource.parentElement.load();
    }
    if (video) {
      video.currentTime = 0;
      video.muted = false;
      video.play().catch(err => console.log("Autoplay bloqué:", err));
    }

    // 🖼 Avatar / Cover
    const avatar = document.getElementById("avatar-img");
    const cover = document.getElementById("track-art");
    if (avatar) avatar.src = CONFIG.AVATAR_SRC;
    if (cover) cover.src = CONFIG.COVER_SRC;

    // 🔗 Social links
    document.querySelectorAll(".social-link").forEach(a => {
      const name = a.dataset.name;
      if (CONFIG.SOCIAL_LINKS[name]) a.href = CONFIG.SOCIAL_LINKS[name];
      else a.href = "#";
    });

    // bouton "View Profile"
    const vp = document.getElementById("viewProfileBtn");
    if (vp) {
      vp.addEventListener("click", () => {
        const discord = CONFIG.SOCIAL_LINKS.discord || "#";
        if (discord !== "#") window.open(discord, "_blank", "noopener");
      });
    }

    // lancer les modules
    initTyping();
    initViews();
    initFakePlayer();
  });
});

/* ===========================
   Typing effect (fix)
   =========================== */
function initTyping() {
  const target = document.getElementById("type-target");
  if (!target) return;

  const texts = CONFIG.typingStrings;
  let i = 0;      // index du texte
  let j = 0;      // index caractère
  let deleting = false;
  let timeoutId;  // référence du setTimeout en cours

  function step() {
    const full = texts[i];

    if (!deleting) {
      target.textContent = full.substring(0, j + 1);
      j++;
      if (j === full.length) {
        deleting = true;
        timeoutId = setTimeout(step, CONFIG.pauseAfterFull);
        return;
      }
    } else {
      target.textContent = full.substring(0, j - 1);
      j--;
      if (j === 0) {
        deleting = false;
        i = (i + 1) % texts.length;
      }
    }

    timeoutId = setTimeout(step, deleting ? CONFIG.deletingSpeed : CONFIG.typingSpeed);
  }

  if (timeoutId) clearTimeout(timeoutId);
  step();
}

/* ===========================
   Views counter
   =========================== */
function initViews() {
  const key = "whynotzr_views_v1";
  let v = parseInt(localStorage.getItem(key) || "0", 10) || 0;
  v += 1;
  localStorage.setItem(key, String(v));
  const el = document.getElementById("views-count");
  if (el) el.textContent = v.toLocaleString();
}

/* ===========================
   Fake music player (29s loop)
   =========================== */
function initFakePlayer() {
  const currentTimeEl = document.getElementById("current-time");
  const durationEl = document.getElementById("duration");
  const playBtn = document.getElementById("play-btn");
  const maxDuration = 29;

  durationEl.textContent = formatTime(maxDuration);

  let startTime = Date.now();
  let paused = false;
  let offset = 0;

  function update() {
    if (!paused) {
      const elapsed = ((Date.now() - startTime) / 1000 + offset) % maxDuration;
      currentTimeEl.textContent = formatTime(elapsed);
    }
    requestAnimationFrame(update);
  }
  update();

  playBtn.addEventListener("click", () => {
    if (paused) {
      paused = false;
      startTime = Date.now();
      playBtn.textContent = "❚❚";
    } else {
      paused = true;
      offset = ((Date.now() - startTime) / 1000 + offset) % maxDuration;
      playBtn.textContent = "►";
    }
  });
}

function formatTime(sec) {
  sec = Math.floor(sec);
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}
