document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. Custom Cursor Logic ---
    const cursorDot = document.querySelector("[data-cursor-dot]");
    const cursorOutline = document.querySelector("[data-cursor-outline]");

    if (cursorDot && cursorOutline) {
        window.addEventListener("mousemove", function (e) {
            const posX = e.clientX;
            const posY = e.clientY;

            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        const hoverTriggers = document.querySelectorAll(".hover-trigger");
        hoverTriggers.forEach(trigger => {
            trigger.addEventListener("mouseenter", () => {
                document.body.classList.add("hovering");
            });
            trigger.addEventListener("mouseleave", () => {
                document.body.classList.remove("hovering");
            });
        });
    }

    // --- 2. Time Display Logic ---
    const timeDisplay = document.getElementById("current-time");
    if (timeDisplay) {
        function updateTime() {
            const now = new Date();
            timeDisplay.innerText = now.toLocaleTimeString([], { hour12: false });
        }
        setInterval(updateTime, 1000);
        updateTime();
    }

    // --- 3. Dark Mode Toggle (PERSISTENT) ---
    const themeToggle = document.getElementById("theme-toggle");
    const html = document.documentElement;
    
    // A. Check LocalStorage on Load
    const savedTheme = localStorage.getItem("theme") || "light";
    html.setAttribute("data-theme", savedTheme);
    if (themeToggle) {
        themeToggle.innerText = savedTheme === "light" ? "Dark Mode" : "Light Mode";
    }
    updateImages(savedTheme); // Ensure images match the loaded theme

    // B. Toggle Logic
    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const currentTheme = html.getAttribute("data-theme");
            const newTheme = currentTheme === "light" ? "dark" : "light";
            
            // Apply new theme
            html.setAttribute("data-theme", newTheme);
            themeToggle.innerText = newTheme === "light" ? "Dark Mode" : "Light Mode";
            
            // SAVE to LocalStorage
            localStorage.setItem("theme", newTheme);

            // Update Images
            updateImages(newTheme);
        });
    }

    // Helper Function to Swap Images
    function updateImages(theme) {
        const swappableImages = document.querySelectorAll("img[data-light][data-dark]");
        swappableImages.forEach(img => {
            const newSrc = img.getAttribute(`data-${theme}`);
            if (newSrc) {
                img.src = newSrc;
            }
        });
    }

    // --- 4. Auto-Hide Navigation ---
    const navBar = document.querySelector("nav");
    const workSection = document.querySelector("#work"); 

    if (navBar && workSection) {
        window.addEventListener("scroll", () => {
            const sectionTop = workSection.getBoundingClientRect().top;
            if (sectionTop <= 100) {
                navBar.classList.add("hidden");
            } else {
                navBar.classList.remove("hidden");
            }
        });
    }

    // --- 5. RADIO PLAYER LOGIC ---
    const radioBtn = document.getElementById("radio-btn");
    const audioPlayer = document.getElementById("audio-player");

    if (radioBtn && audioPlayer) {
        const radioStatus = radioBtn.querySelector(".radio-status");
        
        const playlist = [
            "images and mockups/1-14 Chix (MySpace _ Leaked Version).m4a", 
            "images and mockups/Drake - Passionfruit (Instrumental).mp3",
            "images and mockups/17 Frank Ocean - Rushes To.flac"
        ];

        let isPlaying = false;
        let clickTimer = null;

        function toggleRadio() {
            if (playlist.length === 0) return;

            if (isPlaying) {
                audioPlayer.pause();
                isPlaying = false;
                updateRadioUI();
            } else {
                if (!audioPlayer.src) {
                    playRandomSong();
                } else {
                    audioPlayer.play().catch(e => console.log("Audio Error:", e));
                    isPlaying = true;
                    updateRadioUI();
                }
            }
        }

        function playRandomSong() {
            const randomIndex = Math.floor(Math.random() * playlist.length);
            audioPlayer.src = playlist[randomIndex];
            audioPlayer.play().then(() => {
                isPlaying = true;
                updateRadioUI();
            }).catch(e => console.log("Audio play failed:", e));
        }

        function updateRadioUI() {
            if (isPlaying) {
                radioBtn.classList.add("playing");
                if (radioStatus) radioStatus.innerText = "ON AIR";
            } else {
                radioBtn.classList.remove("playing");
                if (radioStatus) radioStatus.innerText = "OFF AIR";
            }
        }

        radioBtn.addEventListener("click", (e) => {
            if (clickTimer) {
                clearTimeout(clickTimer);
                clickTimer = null;
                playRandomSong();
            } else {
                clickTimer = setTimeout(() => {
                    toggleRadio();
                    clickTimer = null;
                }, 250);
            }
        });

        audioPlayer.addEventListener("ended", playRandomSong);
    }
});

// ===== Scroll-driven hero parallax =====

const hero = document.querySelector(".hero-native");

if (hero) {
  const layers = gsap.utils.toArray(".hero-layer");

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    const heroHeight = hero.offsetHeight;

    // Only animate while hero is visible
    if (scrollY <= heroHeight) {
      layers.forEach((layer, i) => {
        const depth = (i + 1) * 0.15;

        gsap.to(layer, {
          y: scrollY * depth,
          scale: 1 + scrollY / (heroHeight * 8),
          overwrite: true,
          duration: 0.4
        });
      });

      gsap.to(".hero-bg", {
        scale: 1 + scrollY / (heroHeight * 12),
        overwrite: true,
        duration: 0.4
      });
    }
  });
}
