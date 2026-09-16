/* ========================================================================
   SYMIDIC — Chatbot
   Client-side FAQ assistant with keyword-based intelligence.
   No paid API, no backend, no external chatbot service — 100% free, 24/7.
   ======================================================================== */
(function () {
  "use strict";

  /* --- Knowledge Base ------------------------------------------------- */
  const KB = [
    {
      keys: ["who", "what is symidic", "about", "agency", "company", "team", "what are you", "who are you"],
      answer:
        "SYMIDIC is an AI automation agency focused on Shopify and e-commerce businesses. We build intelligent AI customer support agents, e-commerce automation, AI product recommendation systems and custom Shopify AI workflows. Our AI handles repetitive conversations, product/FAQ questions, order assistance and handoff to humans when needed.",
    },
    {
      keys: ["offer", "services", "what do you offer", "what can you provide", "solutions", "what do you do", "four", "4 services", "list"],
      answer:
        "We offer exactly four services:\n\n• AI Customer Support Agents for Shopify — 24/7 FAQs, product info, order tracking, shipping/delivery, returns/refunds and human handoff.\n• E-commerce AI Automation — automated workflows for orders, returns and repetitive support tasks.\n• AI Product Recommendation Systems — intent-matched recommendations supporting discovery, upsell and cross-sell.\n• Custom Shopify AI Workflows — tailored automations and integrations built around your store.\n\n→ See all services: https://symidic.xyz/services.html",
    },
    {
      keys: ["ai customer support agents", "support agent", "24/7", "faq", "faqs"],
      answer:
        "Our AI Customer Support Agents for Shopify handle 24/7 support — FAQs, product information, order tracking, shipping/delivery and returns/refunds. They pull from your store data and policies, and automatically hand off complex or sensitive conversations to your team.",
    },
    {
      keys: ["automation", "e-commerce ai", "ecommerce ai", "automate"],
      answer:
        "E-commerce AI Automation handles repetitive tasks that burn your team's time — order and shipping updates, return intake, follow-ups and recurring support questions. It connects to the tools your store already uses and keeps you in control with human-in-the-loop options.",
    },
    {
      keys: ["recommend", "suggest", "product recommend", "upsell", "cross-sell", "recommendation"],
      answer:
        "Our AI Product Recommendation Systems match customer intent and conversation context to your catalog — supporting discovery, upsell and cross-sell. They're built on your live Shopify catalog with current pricing and availability, and feel like helpful guidance rather than a pitch.",
    },
    {
      keys: ["custom workflow", "custom shopify", "workflow", "integration", "api", "plugin", "n8n"],
      answer:
        "Custom Shopify AI Workflows are tailored automations and AI flows built around your exact operations — custom triggers, routing and integrations with the tools you already use, monitored and tuned as part of the service.",
    },
    {
      keys: ["shopify", "compatible", "platform", "store", "e-commerce", "ecommerce", "website", "built for"],
      answer:
        "Yes — SYMIDIC agents and automation are built specifically for Shopify stores. We integrate with your product catalog, order data and support workflows.",
    },
    {
      keys: ["human", "handoff", "escalat", "real person", "live agent", "transfer", "team"],
      answer:
        "Yes. If the AI agent encounters a complex or sensitive issue it can't confidently resolve, the conversation escalates to a human on your team automatically. You define the triggers.",
    },
    {
      keys: ["price", "pricing", "cost", "how much", "rate", "fee", "package", "cheap", "expensive", "free"],
      answer:
        "Pricing is customized based on your store's scope — complexity, integrations and usage. The discovery call is completely free, and you'll receive a clear proposal after it.\n\n📅 Book a free discovery call: https://cal.com/symidic/symidic-discovery-call",
    },
    {
      keys: ["timeline", "how long", "time", "duration", "when", "launch date", "fast", "quick", "deadline"],
      answer:
        "It depends on your requirements and integrations. You'll receive a clear timeline after the discovery call — before we build anything.",
    },
    {
      keys: ["process", "work", "steps", "how does it work", "method", "plan", "how it works"],
      answer:
        "Our process is:\n\n1. Discovery Call — free, learn about your store\n2. Strategy & Setup — scope, data and plan\n3. Build & Integrate — custom agent with your store data\n4. Test & Launch — validated against real scenarios\n5. Optimize & Support — ongoing tuning\n\n→ See the process: https://symidic.xyz/how-it-works.html\n→ Book a discovery call: https://cal.com/symidic/symidic-discovery-call",
    },
    {
      keys: ["start", "getting started", "begin", "book", "how to", "next step", "get started", "setup", "begin"],
      answer:
        "The best first step is a free discovery call — we map out the right AI support and automation for your store.\n\n📅 Book here: https://cal.com/symidic/symidic-discovery-call\n\nYou can also email us at contact@symidic.xyz or message us on WhatsApp: https://wa.me/923037061168",
    },
    {
      keys: ["demo", "video", "watch", "show me", "see it", "example", "youtube"],
      answer:
        "You can watch the SYMIDIC demo on our demo page — it shows an AI customer support agent handling product questions, order tracking, shipping and human handoff for a Shopify store.\n\n→ Watch the demo: https://symidic.xyz/demo.html",
    },
    {
      keys: ["contact", "call", "whatsapp", "email", "reach", "talk", "meeting", "booking", "schedule", "book"],
      answer:
        "Here's how to reach us:\n\n📧 Email: contact@symidic.xyz\n💬 WhatsApp: https://wa.me/923037061168\n📅 Book a discovery call: https://cal.com/symidic/symidic-discovery-call\n🔗 LinkedIn: https://www.linkedin.com/in/ab-rehman-203a15419/",
    },
    {
      keys: ["order", "track", "shipping", "delivery", "package", "status", "where is my order"],
      answer:
        "Yes — the AI agent handles order tracking, shipping status and delivery questions by pulling information from your store's data, giving customers real-time answers around the clock.",
    },
    {
      keys: ["return", "refund", "exchange", "cancel", "returns"],
      answer:
        "Yes — the agent guides customers through returns and refunds per your policy, handles exchanges, and escalates to your team when manual review is needed.",
    },
    {
      keys: ["handoff", "escalation", "transfer to human", "human takeover"],
      answer:
        "Human handoff is built in. The AI escalates complex, sensitive or low-confidence conversations to your team automatically, so customers always get the right level of care.",
    },
    {
      keys: ["thank", "thanks", "appreciate", "awesome", "great"],
      answer:
        "You're welcome! If you'd like to explore AI customer support for your store, book a free discovery call anytime:\n\n📅 https://cal.com/symidic/symidic-discovery-call",
    },
  ];

  /* --- Suggested Prompts ---------------------------------------------- */
  const SUGGESTIONS = [
    "What services do you offer?",
    "What can the AI agent handle?",
    "Do you work with Shopify?",
    "How do I get started?",
  ];

  /* --- DOM Elements --------------------------------------------------- */
  const toggle = document.querySelector(".chat-toggle");
  const widget = document.querySelector(".chat-widget");
  const closeBtn = document.querySelector(".chat-close");
  const messagesEl = document.querySelector(".chat-messages");
  const inputEl = document.querySelector(".chat-input-bar input");
  const sendBtn = document.querySelector(".chat-input-bar button");
  const typingEl = document.querySelector(".chat-typing");
  const suggestionsEl = document.querySelector(".chat-suggestions");

  /* --- State ---------------------------------------------------------- */
  let chatOpen = false;
  let messageCount = 0;

  /* --- Helpers -------------------------------------------------------- */
  function addMessage(text, type) {
    const div = document.createElement("div");
    div.className = "msg " + type;
    div.innerHTML = text;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    messageCount++;
  }

  function showTyping() {
    if (typingEl) typingEl.classList.add("active");
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function hideTyping() {
    if (typingEl) typingEl.classList.remove("active");
  }

  function addBookingCta(text) {
    return (
      text +
      '\n\n<div class="chat-cta"><a href="https://cal.com/symidic/symidic-discovery-call" target="_blank" rel="noopener">📅 Book a Discovery Call</a></div>'
    );
  }

  function showSuggestions() {
    if (!suggestionsEl) return;
    suggestionsEl.innerHTML = "";
    SUGGESTIONS.forEach((s) => {
      const chip = document.createElement("button");
      chip.className = "suggest-chip";
      chip.textContent = s;
      chip.addEventListener("click", () => {
        handleUserInput(s);
        suggestionsEl.style.display = "none";
      });
      suggestionsEl.appendChild(chip);
    });
    suggestionsEl.style.display = "flex";
  }

  function hideSuggestions() {
    if (suggestionsEl) suggestionsEl.style.display = "none";
  }

  /* --- Intelligence (score-based keyword matching) -------------------- */
  function tokenize(text) {
    return text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
  }

  function findAnswer(query) {
    const q = query.toLowerCase().trim();
    const tokens = tokenize(q);
    let bestMatch = null;
    let bestScore = 0;

    KB.forEach((entry) => {
      let score = 0;
      entry.keys.forEach((key) => {
        if (q.includes(key)) {
          score += key.length * 2;
        }
        const keyTokens = tokenize(key);
        let hitCount = 0;
        keyTokens.forEach((kt) => {
          if (tokens.includes(kt)) hitCount++;
        });
        if (keyTokens.length && hitCount === keyTokens.length) {
          score += key.length;
        }
      });
      if (score > bestScore) {
        bestScore = score;
        bestMatch = entry;
      }
    });

    const BOOK_URL = "https://cal.com/symidic/symidic-discovery-call";

    if (bestMatch && bestScore >= 3) {
      return addBookingCta(bestMatch.answer);
    }
    if (q.includes("bye") || q.includes("goodbye")) {
      return addBookingCta(
        "Thanks for chatting! If you'd like to explore AI customer support and automation for your store, book a free discovery call anytime:"
      );
    }
    if (/^(hi|hi!|hey|hello|hello!|good (morning|afternoon|evening))[!. ]*$/.test(q)) {
      return "Hello! 👋 I can help you learn about our Shopify AI customer support — services, features, process, pricing approach and getting started (plus we offer a free demo). What would you like to know?";
    }

    return addBookingCta(
      "I can help with our Shopify AI customer support — our 4 services, the process, the demo and getting started. For anything specific, the best next step is a free discovery call with SYMIDIC:"
    );
  }

  /* --- Handle Input --------------------------------------------------- */
  function handleUserInput(text) {
    if (!text || !text.trim()) return;
    addMessage(text, "user");
    inputEl.value = "";
    hideSuggestions();
    showTyping();

    // Simulate a thoughtful response delay
    const delay = 600 + Math.random() * 800;
    setTimeout(() => {
      hideTyping();
      const answer = findAnswer(text);
      addMessage(answer, "bot");
    }, delay);
  }

  /* --- Event Listeners ------------------------------------------------ */
  if (toggle) {
    toggle.addEventListener("click", () => {
      chatOpen = !chatOpen;
      widget && widget.classList.toggle("open", chatOpen);
      if (chatOpen) {
        inputEl && inputEl.focus();
        if (messageCount === 0) {
          showSuggestions();
        }
      }
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      chatOpen = false;
      widget.classList.remove("open");
    });
  }

  if (sendBtn) {
    sendBtn.addEventListener("click", () => {
      handleUserInput(inputEl.value);
    });
  }

  if (inputEl) {
    inputEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleUserInput(inputEl.value);
      }
    });
  }

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && chatOpen) {
      chatOpen = false;
      widget.classList.remove("open");
    }
  });
})();