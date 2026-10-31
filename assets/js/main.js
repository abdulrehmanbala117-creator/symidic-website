/* ========================================================================
   Symidic — Main JavaScript
   Nav, scroll reveals, parallax, scroll progress, scroll-spy, video load
   ======================================================================== */
(function () {
  "use strict";

  /* --- Mobile Nav Toggle ---------------------------------------------- */
  const menuBtn = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
      navLinks.classList.toggle("mobile-open");
      menuBtn.classList.toggle("open");
    });
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("mobile-open");
        menuBtn.classList.remove("open");
      });
    });
  }

  /* --- Scroll Reveal (IntersectionObserver) --------------------------- */
  const revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  /* --- Scroll Progress Bar -------------------------------------------- */
  const progressBar = document.querySelector(".scroll-progress");
  if (progressBar) {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = pct + "%";
    };
    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
  }

  /* --- Scroll-Spy (active nav link) ----------------------------------- */
  const spyLinks = Array.prototype.slice.call(
    document.querySelectorAll(".nav-links a[href^='#']")
  );
  if (spyLinks.length) {
    const sections = spyLinks
      .map((a) => document.querySelector(a.getAttribute("href")))
      .filter(Boolean);
    const spyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const id = "#" + e.target.id;
            spyLinks.forEach((a) => {
              a.classList.toggle("active", a.getAttribute("href") === id);
            });
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => spyObserver.observe(s));
  }

  /* --- Mouse Parallax on Hero Visual --------------------------------- */
  const heroVisual = document.querySelector(".hero-visual");
  const visualCore = document.querySelector(".visual-core");
  if (heroVisual && visualCore) {
    let targetX = 0,
      targetY = 0;
    let currentX = 0,
      currentY = 0;

    heroVisual.addEventListener("mousemove", (e) => {
      const rect = heroVisual.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = x * 18;
      targetY = y * 12;
    });

    heroVisual.addEventListener("mouseleave", () => {
      targetX = 0;
      targetY = 0;
    });

    function animateParallax() {
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;
      visualCore.style.transform =
        "translate(" + currentX + "px, " + currentY + "px)";
      requestAnimationFrame(animateParallax);
    }

    // Only run parallax if no reduced-motion preference
    const mq = window.matchMedia("(prefers-reduced-motion: no-preference)");
    if (mq.matches) {
      requestAnimationFrame(animateParallax);
    }
  }

  /* --- Navbar Background on Scroll ------------------------------------ */
  const nav = document.querySelector(".nav");
  if (nav) {
    let ticking = false;
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            if (window.scrollY > 20) {
              nav.style.background = "rgba(5,6,10,0.92)";
            } else {
              nav.style.background = "rgba(5,6,10,0.75)";
            }
            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true }
    );
  }

  /* --- Smooth Scroll for Anchor Links --------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      if (this.getAttribute("href") === "#") return;
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  /* --- Lazy-load / click-to-play YouTube embed ------------------------ */
  const ytContainer = document.querySelector(".video-container[data-src]");
  if (ytContainer) {
    const placeholder = ytContainer.querySelector(".video-placeholder");
    const ytObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            if (placeholder) placeholder.classList.add("vp-ready");
            ytObserver.unobserve(ytContainer);
          }
        });
      },
      { rootMargin: "150px" }
    );
    ytObserver.observe(ytContainer);

    const loadVideo = (src) => {
      ytContainer.innerHTML = "";
      const iframe = document.createElement("iframe");
      iframe.src = src;
      iframe.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.allowFullscreen = true;
      iframe.title = "Symidic AI demo video — AI customer support for Shopify";
      iframe.loading = "lazy";
      ytContainer.appendChild(iframe);
    };

    if (placeholder) {
      placeholder.addEventListener("click", () => {
        loadVideo(ytContainer.dataset.src);
      });
      placeholder.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          loadVideo(ytContainer.dataset.src);
        }
      });
    }
  }
  /* --- Copy email buttons -------------------------------------------- */
  document.querySelectorAll('.copy-email').forEach(function(btn) {
    btn.addEventListener('click', async function(e) {
      e.preventDefault();
      const email = this.getAttribute('data-email') || this.textContent;
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(email);
        } else {
          const ta = document.createElement('textarea');
          ta.value = email;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        }
        const old = this.textContent;
        this.textContent = 'Copied!';
        setTimeout(() => { this.textContent = old; }, 2000);
      } catch (err) {
        console.error('Copy failed', err);
      }
    });
  });
  /* --- Aceternity Mouse Spotlight Effect ----------------------------- */
  const spotlightCards = document.querySelectorAll(
    ".spotlight-card, .service-card, .why-card, .ps-card, .metric-card, .terminal-window"
  );
  spotlightCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });
  });

  /* --- Interactive Scrollytelling Pipeline --------------------------- */
  const scrollyCards = document.querySelectorAll(".scrolly-card");
  const deckStages = document.querySelectorAll(".deck-stage");
  if (scrollyCards.length && deckStages.length) {
    scrollyCards.forEach((card) => {
      card.addEventListener("click", () => {
        const targetStep = card.getAttribute("data-step");
        scrollyCards.forEach((c) => c.classList.remove("active"));
        deckStages.forEach((s) => s.classList.remove("active"));
        card.classList.add("active");
        const activeStage = document.querySelector(`.deck-stage[data-stage="${targetStep}"]`);
        if (activeStage) activeStage.classList.add("active");
      });
    });

    const scrollyObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
          const step = entry.target.getAttribute("data-step");
          scrollyCards.forEach((c) => c.classList.remove("active"));
          deckStages.forEach((s) => s.classList.remove("active"));
          entry.target.classList.add("active");
          const activeStage = document.querySelector(`.deck-stage[data-stage="${step}"]`);
          if (activeStage) activeStage.classList.add("active");
        }
      });
    }, { threshold: 0.5, rootMargin: "-15% 0px -15% 0px" });

    scrollyCards.forEach((card) => scrollyObserver.observe(card));
  }

  /* --- Animated Number Counters -------------------------------------- */
  const counterEls = document.querySelectorAll(".counter-val");
  if (counterEls.length) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const targetNum = parseFloat(el.getAttribute("data-count"));
          const prefix = el.getAttribute("data-prefix") || "";
          const suffix = el.getAttribute("data-suffix") || "";
          const decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
          const duration = 1600;
          const startTime = performance.now();

          const updateCount = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const currentVal = progress === 1 ? targetNum : targetNum * (1 - Math.pow(2, -10 * progress));
            el.textContent = `${prefix}${currentVal.toFixed(decimals)}${suffix}`;
            if (progress < 1) {
              requestAnimationFrame(updateCount);
            } else {
              el.textContent = `${prefix}${targetNum.toFixed(decimals)}${suffix}`;
            }
          };
          requestAnimationFrame(updateCount);
          countObserver.unobserve(el);
        }
      });
    }, { threshold: 0.3 });
    counterEls.forEach((el) => countObserver.observe(el));
  }

  /* --- Fey.com MacBook Pro 3D Scroll & Mouse Tilt Engine ------------ */
  const macbookLid = document.querySelector(".macbook-lid");
  const macbookScene = document.querySelector(".macbook-scene");
  const macbookContainer = document.querySelector(".macbook-container");
  if (macbookLid && macbookScene && macbookContainer) {
    const BASE_TILT_X = 22; // Natural 3D isometric pitch
    const BASE_TILT_Y = -6; // Subtle aesthetic angle facing the hero copy
    let mouseTiltX = 0, mouseTiltY = 0;
    let currentTiltX = BASE_TILT_X, currentTiltY = BASE_TILT_Y;
    let targetLidRotate = -28;
    let currentLidRotate = -28;

    // Scroll-driven lid opening: smoothly unfolds as user scrolls
    function updateScrollLid() {
      const scrollY = window.scrollY || window.pageYOffset;
      const progress = Math.min(Math.max(scrollY / 450, 0), 1);
      // Lid rotates from -28deg (sleek semi-open) to +8deg (open wide leaning back)
      targetLidRotate = -28 + (progress * 36);
    }
    window.addEventListener("scroll", updateScrollLid, { passive: true });
    updateScrollLid();

    // Interactive 3D mouse parallax tilt
    macbookScene.addEventListener("mousemove", (e) => {
      const rect = macbookScene.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseTiltY = x * 18;
      mouseTiltX = -y * 14;
    });

    macbookScene.addEventListener("mouseleave", () => {
      mouseTiltX = 0;
      mouseTiltY = 0;
    });

    // 60FPS Physics Loop for smooth damping
    function animateMacbookPhysics() {
      // Damped spring interpolation for chassis 3D tilt
      currentTiltX += ((BASE_TILT_X + mouseTiltX) - currentTiltX) * 0.08;
      currentTiltY += ((BASE_TILT_Y + mouseTiltY) - currentTiltY) * 0.08;
      macbookContainer.style.setProperty("--base-tilt-x", `${currentTiltX.toFixed(2)}deg`);
      macbookContainer.style.setProperty("--base-tilt-y", `${currentTiltY.toFixed(2)}deg`);

      // Damped spring for lid rotation
      currentLidRotate += (targetLidRotate - currentLidRotate) * 0.1;
      macbookLid.style.setProperty("--lid-rotate", `${currentLidRotate.toFixed(2)}deg`);

      requestAnimationFrame(animateMacbookPhysics);
    }
    requestAnimationFrame(animateMacbookPhysics);
  }


  /* --- 3D Card Parallax Tilt Engine (Aceternity 3D Pin / Bento Tilt) --- */
  if (window.matchMedia("(hover: hover)").matches) {
    const tiltCards = document.querySelectorAll(".service-card, .why-card, .metric-card, .ps-card, .sandbox-deck");
    tiltCards.forEach((card) => {
      let cardBounds = null;
      card.addEventListener("mouseenter", () => {
        cardBounds = card.getBoundingClientRect();
        card.style.transition = "transform 0.1s ease-out, box-shadow 0.25s ease";
      });
      card.addEventListener("mousemove", (e) => {
        if (!cardBounds) cardBounds = card.getBoundingClientRect();
        const x = (e.clientX - cardBounds.left) / cardBounds.width - 0.5;
        const y = (e.clientY - cardBounds.top) / cardBounds.height - 0.5;
        const tiltX = -y * 12;
        const tiltY = x * 12;
        card.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateY(-5px) translateZ(8px)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transition = "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.45s ease";
        card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) translateZ(0)";
        cardBounds = null;
      });
    });
  }

  /* --- Interactive Live Demo Sandbox Simulation Engine -------------- */
  const sandboxChips = document.querySelectorAll(".sandbox-chip");
  const userMsgEl = document.getElementById("sandbox-user-msg");
  const agentMsgEl = document.getElementById("sandbox-agent-msg");
  const reasoningEl = document.getElementById("sandbox-reasoning");
  const customInputEl = document.getElementById("sandbox-custom-input");
  const sendBtnEl = document.getElementById("sandbox-send-btn");

  const QA_PRESETS = {
    track: {
      q: "Hi! Where is my order #SHP-9481? Ordered 2 days ago.",
      reason: "[Shopify Admin GraphQL] Real-time tracking query resolved in 34ms",
      a: "Hello Alex! Your order <strong>#SHP-9481</strong> is currently in transit with FedEx Express and is scheduled for delivery <strong>today by 2:30 PM</strong>. Live Tracking: <strong style='color:#38bdf8;'>trk.fedex.com/9481</strong>"
    },
    exchange: {
      q: "Can I exchange my wool jacket for a Size Large?",
      reason: "[Shopify Inventory API] Checking Size Large inventory across warehouses... 7 units available",
      a: "Yes, absolutely! We have 7 units of Size Large in stock. I have reserved one for you and emailed your pre-paid instant return label. Drop off the current jacket whenever convenient!"
    },
    return: {
      q: "What is your refund policy? Can I return opened items?",
      reason: "[Store Knowledge Policy] RAG match: 30-Day Hassle-Free Returns SLA",
      a: "You have 30 days from delivery to request a full refund! Opened items in original condition qualify for 100% money back with free return shipping. Would you like me to start your return now?"
    }
  };

  function simulateAgentResponse(queryText, reasoningText, responseText) {
    if (!userMsgEl || !agentMsgEl || !reasoningEl) return;
    userMsgEl.textContent = queryText;
    reasoningEl.innerHTML = `<span class="pulse-emerald" style="width:5px;height:5px;"></span><span>Reasoning: Neural parsing &amp; Shopify data sync...</span>`;
    agentMsgEl.innerHTML = `<span style="color:var(--muted);font-style:italic;">Synthesizing verified resolution...</span>`;

    setTimeout(() => {
      reasoningEl.innerHTML = `<span class="pulse-emerald" style="width:5px;height:5px;"></span><span>${reasoningText}</span>`;
      agentMsgEl.innerHTML = responseText;
    }, 420);
  }

  if (sandboxChips.length) {
    sandboxChips.forEach((chip) => {
      chip.addEventListener("click", () => {
        sandboxChips.forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        const key = chip.getAttribute("data-q");
        if (QA_PRESETS[key]) {
          simulateAgentResponse(QA_PRESETS[key].q, QA_PRESETS[key].reason, QA_PRESETS[key].a);
        }
      });
    });
  }

  if (sendBtnEl && customInputEl) {
    const handleCustomSend = () => {
      const val = customInputEl.value.trim();
      if (!val) return;
      sandboxChips.forEach((c) => c.classList.remove("active"));
      simulateAgentResponse(
        `"${val}"`,
        "[Shopify Neural Classifier] Custom intent parsed • 99.8% confidence match",
        `"Thank you for reaching out! Regarding <em>${val}</em>, our autonomous agent has verified your account policies and resolved your request instantly with zero human waiting time!"`
      );
      customInputEl.value = "";
    };
    sendBtnEl.addEventListener("click", handleCustomSend);
    customInputEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter") handleCustomSend();
    });
  }

})();