document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const themeToggle = document.getElementById("theme-toggle");
  const navToggle = document.querySelector(".nav-toggle");
  const navGroup = document.querySelector(".nav-group");
  const navLinks = [...document.querySelectorAll(".nav-links a")];
  const yearNode = document.getElementById("current-year");
  const revealItems = document.querySelectorAll(".reveal");
  const scrollButtons = document.querySelectorAll("[data-scroll-target]");
  const exportButton = document.getElementById("export-pdf");

  const savedTheme = localStorage.getItem("theme-mode");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const applyTheme = (theme) => {
    const isDark = theme === "dark";
    body.classList.toggle("dark-theme", isDark);
    themeToggle.textContent = isDark ? "🌙" : "☀️";
    themeToggle.setAttribute("aria-label", isDark ? "Cambiar a tema claro" : "Cambiar a tema oscuro");
    localStorage.setItem("theme-mode", isDark ? "dark" : "light");
  };

  if (savedTheme) {
    applyTheme(savedTheme);
  } else {
    applyTheme(prefersDark ? "dark" : "light");
  }

  themeToggle.addEventListener("click", () => {
    const nextTheme = body.classList.contains("dark-theme") ? "light" : "dark";
    applyTheme(nextTheme);
  });

  const updateActiveNav = () => {
    const sections = [
      document.getElementById("home"),
      document.getElementById("module1"),
      document.getElementById("module2"),
      document.getElementById("module3"),
      document.getElementById("conclusions")
    ];

    let activeId = "home";
    sections.forEach((section) => {
      if (!section) return;
      const rect = section.getBoundingClientRect();
      if (rect.top <= 180 && rect.bottom >= 180) {
        activeId = section.id;
      }
    });

    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${activeId}`;
      link.classList.toggle("active", isActive);
    });
  };

  scrollButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-scroll-target");
      const target = document.querySelector(targetId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      const target = targetId ? document.querySelector(targetId) : null;
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      navGroup.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  navToggle.addEventListener("click", () => {
    const isOpen = navGroup.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealItems.forEach((item) => observer.observe(item));

  const cpuCards = [...document.querySelectorAll(".interactive-card")];
  const cpuDetail = document.getElementById("cpu-detail");
  const cpuCardContent = {
    alu: {
      title: "ALU — Unidad Aritmético-Lógica",
      text: "La ALU es la parte de la CPU encargada de ejecutar cálculos y comparaciones. Es esencial porque cada operación que realiza un computador, desde abrir un archivo hasta validar una contraseña, termina pasando por esta unidad.",
      list: [
        "Permite sumar, restar, comparar, evaluar condiciones y realizar operaciones binarias.",
        "Los resultados se envían a registros o a la memoria según la instrucción.",
        "Es una de las piezas centales del procesamiento digital."
      ]
    },
    uc: {
      title: "UC — Unidad de Control",
      text: "La Unidad de Control interpreta cada instrucción y decide qué componentes deben activarse para ejecutarla en el orden correcto.",
      list: [
        "Lee instrucciones desde memoria y determina la secuencia apropiada.",
        "Coordina CPU, memoria y periféricos durante el procesamiento.",
        "Actúa como director de orquesta del computador."
      ]
    },
    regs: {
      title: "Registros",
      text: "Los registros son espacios de almacenamiento muy rápidos dentro de la CPU. Mantienen temporalmente datos, instrucciones y direcciones para evitar esperas innecesarias.",
      list: [
        "Son extremadamente veloces y accesibles en nanosegundos.",
        "Almacenan valores que la CPU necesita en el momento actual.",
        "Incluyen datos operativos, indicadores y direcciones de memoria."
      ]
    }
  };

  const updateCpuCard = (cardKey) => {
    const details = cpuCardContent[cardKey];
    cpuCards.forEach((card) => {
      const isActive = card.dataset.card === cardKey;
      card.classList.toggle("active", isActive);
    });

    if (details) {
      cpuDetail.innerHTML = `
        <h4>${details.title}</h4>
        <p>${details.text}</p>
        <ul>
          ${details.list.map((item) => `<li>${item}</li>`).join("")}
        </ul>
      `;
    }
  };

  cpuCards.forEach((card) => {
    card.addEventListener("click", () => updateCpuCard(card.dataset.card));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        updateCpuCard(card.dataset.card);
      }
    });
  });

  const cycleSteps = [
    {
      label: "FETCH",
      text: "La CPU obtiene la siguiente instrucción desde la memoria para prepararla y ejecutarla."
    },
    {
      label: "DECODE",
      text: "La Unidad de Control interpreta la instrucción y determina qué operación debe realizarse."
    },
    {
      label: "EXECUTE",
      text: "La CPU ejecuta la operación y genera el resultado correspondiente para la siguiente instrucción."
    }
  ];

  const pipelineNodes = [...document.querySelectorAll(".pipeline-node")];
  let cycleIndex = 0;

  const updateCycleState = () => {
    const activeStep = cycleSteps[cycleIndex % cycleSteps.length];
    pipelineNodes.forEach((node) => node.classList.remove("active"));

    const stageMapping = {
      FETCH: pipelineNodes[2],
      DECODE: pipelineNodes[4],
      EXECUTE: pipelineNodes[6]
    };

    const activeNode = stageMapping[activeStep.label];
    if (activeNode) {
      activeNode.classList.add("active");
    }

    document.getElementById("cycle-detail").innerHTML = `
      <strong>${activeStep.label}</strong>
      <p>${activeStep.text}</p>
    `;
  };

  document.getElementById("advance-cycle").addEventListener("click", () => {
    cycleIndex += 1;
    updateCycleState();
  });

  updateCycleState();

  const memoryDetails = {
    registers: {
      title: "Registros",
      text: "Son la memoria más rápida y cercana a la CPU. Almacena datos y direcciones que necesitan ser procesados inmediatamente.",
      list: ["Velocidad: muy alta", "Capacidad: muy pequeña", "Función: acceso inmediato"]
    },
    cache: {
      title: "Cache",
      text: "La caché almacena datos usados con frecuencia para reducir la espera de acceso a la memoria principal.",
      list: ["Velocidad: alta", "Capacidad: limitada", "Función: reducir latencia"]
    },
    ram: {
      title: "RAM",
      text: "La RAM mantiene datos y programas activos mientras el equipo está funcionando, pero pierde contenido al apagarse.",
      list: ["Velocidad: media", "Capacidad: moderada", "Función: ejecutar programas activos"]
    },
    secondary: {
      title: "Almacenamiento secundario",
      text: "Aquí se guardan los archivos y sistemas operativos de forma persistente, aunque el acceso es más lento.",
      list: ["Velocidad: menor", "Capacidad: muy grande", "Función: almacenamiento permanente"]
    }
  };

  const memoryDetail = document.getElementById("memory-detail");
  const memoryLevels = [...document.querySelectorAll(".memory-level")];

  const updateMemoryLevel = (levelKey) => {
    const info = memoryDetails[levelKey];
    memoryLevels.forEach((button) => {
      button.classList.toggle("active", button.dataset.memory === levelKey);
    });
    memoryDetail.innerHTML = `
      <h4>${info.title}</h4>
      <p>${info.text}</p>
      <ul>
        ${info.list.map((item) => `<li>${item}</li>`).join("")}
      </ul>
    `;
  };

  memoryLevels.forEach((button) => {
    button.addEventListener("click", () => updateMemoryLevel(button.dataset.memory));
  });

  const addressCardButtons = [...document.querySelectorAll(".toggle-btn")];
  const addressCards = [...document.querySelectorAll(".address-card")];
  const updateAddressInfo = (type) => {
    addressCardButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.addressType === type);
    });
    addressCards.forEach((card) => {
      card.classList.toggle("active", card.dataset.panel === type);
    });
  };

  addressCardButtons.forEach((button) => {
    button.addEventListener("click", () => updateAddressInfo(button.dataset.addressType));
  });

  const topologyCards = [...document.querySelectorAll(".topology-card")];
  topologyCards.forEach((card) => {
    card.addEventListener("click", () => {
      topologyCards.forEach((item) => item.classList.toggle("active", item === card));
    });
  });

  const memoryChoiceButtons = [...document.querySelectorAll("[data-memory-choice]")];
  const memoryChoiceDetail = document.getElementById("memory-choice-detail");
  const memoryChoiceText = {
    Registro: "La CPU accede a registros de forma inmediata y muy rápida.",
    Cache: "La caché guarda datos frecuentes para acelerar el acceso a información reutilizada.",
    RAM: "La RAM mantiene programas activos, procesos y datos temporales mientras el equipo funciona.",
    "SSD/HDD": "El almacenamiento secundario conserva información de forma persistente, aunque el acceso es más lento."
  };
  memoryChoiceButtons.forEach((button) => {
    button.addEventListener("click", () => {
      memoryChoiceButtons.forEach((item) => item.classList.toggle("active", item === button));
      memoryChoiceDetail.textContent = memoryChoiceText[button.dataset.memoryChoice] || "";
    });
  });

  const networkChoiceButtons = [...document.querySelectorAll("[data-network-choice]")];
  const networkChoiceDetail = document.getElementById("network-choice-detail");
  const networkChoiceText = {
    IP: "La IP identifica un dispositivo dentro de la red según la configuración.",
    MAC: "La MAC identifica la interfaz física del dispositivo en la red local."
  };
  networkChoiceButtons.forEach((button) => {
    button.addEventListener("click", () => {
      networkChoiceButtons.forEach((item) => item.classList.toggle("active", item === button));
      networkChoiceDetail.textContent = networkChoiceText[button.dataset.networkChoice] || "";
    });
  });

  const topologyChoiceButtons = [...document.querySelectorAll("[data-topology-choice]")];
  const topologyChoiceDetail = document.getElementById("topology-choice-detail");
  const topologyChoiceText = {
    Estrella: "En estrella, todos los nodos se conectan a un punto central.",
    Anillo: "En anillo, cada equipo enlaza con el siguiente para formar un circuito cerrado.",
    Bus: "En bus, todos los equipos comparten un mismo medio de transmisión."
  };
  topologyChoiceButtons.forEach((button) => {
    button.addEventListener("click", () => {
      topologyChoiceButtons.forEach((item) => item.classList.toggle("active", item === button));
      topologyChoiceDetail.textContent = topologyChoiceText[button.dataset.topologyChoice] || "";
    });
  });

  const quizButtons = [...document.querySelectorAll("[data-quiz-choice]")];
  const quizFeedback = document.getElementById("quiz-feedback");
  quizButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const choice = button.dataset.quizChoice;
      const isCorrect = choice === "Todas las anteriores";
      quizButtons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      quizFeedback.textContent = isCorrect
        ? "¡Correcto! La RAM, los registros y el tráfico de red aportan evidencia complementaria."
        : "No del todo. La mejor respuesta combina varias fuentes de evidencia.";
      quizFeedback.style.color = isCorrect ? "var(--success)" : "var(--warning)";
    });
  });

  const cpuActivityStep = document.getElementById("cpu-activity-step");
  const cpuActivityText = document.getElementById("cpu-activity-text");
  const cpuActivityButton = document.getElementById("cpu-activity-btn");
  const cpuSequence = [
    { step: "Fetch", text: "Instrucción: cargar datos desde memoria y ejecutar comparación." },
    { step: "Decode", text: "La UC interpreta que se debe comparar dos valores antes de continuar." },
    { step: "Execute", text: "La ALU ejecuta la operación y produce el resultado del cálculo." }
  ];
  let cpuSequenceIndex = 0;
  cpuActivityButton.addEventListener("click", () => {
    cpuSequenceIndex = (cpuSequenceIndex + 1) % cpuSequence.length;
    const current = cpuSequence[cpuSequenceIndex];
    cpuActivityStep.textContent = current.step;
    cpuActivityText.textContent = current.text;
  });

  if (yearNode) {
    yearNode.textContent = new Date().getFullYear();
  }

  window.addEventListener("scroll", updateActiveNav, { passive: true });
  updateActiveNav();

  const exportToPDF = () => {
    const element = document.getElementById("main-content");
    if (!element) return;

    const opt = {
      margin: 0.4,
      filename: "arquitectura-redes-ciberdelitos.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
    };

    if (window.html2pdf) {
      window.html2pdf().set(opt).from(element).save();
    }
  };

  exportButton.addEventListener("click", exportToPDF);
});
