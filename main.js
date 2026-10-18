// ==========================================================================
// OLHA PRO CÉU UNIVASF - SCRIPT GLOBAL & LUNAR LOADER (main.js)
// ==========================================================================

const STEIN_API_BASE = "https://api.steinhq.com/v1/storages/6abc405292b1163e974b814d";

document.addEventListener("DOMContentLoaded", () => {
  initMobileNavbar();
});

// 1. NAVBAR MOBILE RESPONSIVA
function initMobileNavbar() {
  const header = document.querySelector(".space-navbar .nav-container");
  if (!header) return;

  if (!document.querySelector(".mobile-menu-toggle")) {
    const toggleBtn = document.createElement("button");
    toggleBtn.className = "mobile-menu-toggle";
    toggleBtn.innerHTML = "☰";
    toggleBtn.setAttribute("aria-label", "Abrir Menu");
    
    const navMenu = header.querySelector(".nav-menu");
    
    toggleBtn.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      toggleBtn.innerHTML = navMenu.classList.contains("active") ? "✕" : "☰";
    });

    header.insertBefore(toggleBtn, navMenu);
  }
}

// 2. FUNÇÃO GENÉRICA PARA BUSCAR DADOS DO STEINHQ
async function fetchSteinData(endpoint) {
  try {
    let response = await fetch(`${STEIN_API_BASE}/${endpoint}`);
    if (!response.ok) {
      response = await fetch(STEIN_API_BASE);
    }
    const data = await response.json();
    const rows = Array.isArray(data) ? data : (data[endpoint] || data["Sheet1"] || []);
    return Array.isArray(rows) ? rows : [];
  } catch (error) {
    console.warn(`Aviso: Não foi possível conectar ao SteinHQ em ${endpoint}.`, error);
    return [];
  }
}

// 3. CARREGADOR LUNAR INTELIGENTE + TRATAMENTO DE VAZIO
async function loadSectionWithLunarState(containerId, endpoint, renderCallback, customTitle = "Módulo em Construção Espacial") {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Mostra o Carregamento Lunar enquanto o JS verifica se há informações
  container.innerHTML = `
    <div style="text-align: center; padding: 3.5rem 1rem;">
      <div class="lunar-loader" style="font-size: 4rem; animation: moonPulse 2s infinite ease-in-out; display: inline-block; margin-bottom: 1rem;">🌕</div>
      <p style="color: var(--text-muted); font-family: var(--font-orbitron); font-size: 0.95rem; letter-spacing: 1px;">Sincronizando efemérides e dados do SteinHQ...</p>
    </div>
    <style>
      @keyframes moonPulse {
        0% { transform: scale(0.95); opacity: 0.6; filter: drop-shadow(0 0 5px rgba(255,204,0,0.2)); }
        50% { transform: scale(1.1); opacity: 1; filter: drop-shadow(0 0 20px rgba(0,240,255,0.7)); }
        100% { transform: scale(0.95); opacity: 0.6; filter: drop-shadow(0 0 5px rgba(255,204,0,0.2)); }
      }
    </style>
  `;

  const data = await fetchSteinData(endpoint);

  if (data && data.length > 0) {
    renderCallback(data, container);
  } else {
    renderDevelopmentState(container, customTitle);
  }
}

// 4. ESTADO VAZIO COM ANIMAÇÃO 3D THREE.JS
function renderDevelopmentState(containerElement, customTitle) {
  containerElement.innerHTML = `
    <div class="dev-state-wrapper" style="text-align: center; padding: 4rem 1rem; position: relative; overflow: hidden; background: rgba(5,5,8,0.75); border: 1px solid var(--border-space); border-radius: 16px; margin: 2rem 0; box-shadow: 0 10px 30px rgba(0,0,0,0.8);">
      <div id="three-canvas-container" style="width: 100%; height: 220px; margin-bottom: 1.5rem;"></div>
      <span class="sub-header-tag" style="margin-bottom: 0.5rem; display: inline-block;">STATUS: EM BREVE</span>
      <h3 style="font-family: var(--font-orbitron); color: #fff; font-size: 1.5rem; margin-bottom: 0.8rem;">${customTitle}</h3>
      <p style="color: var(--text-muted); max-width: 500px; margin: 0 auto 1.5rem auto; font-size: 0.95rem; line-height: 1.6;">
        Ainda não há registros datados nesta planilha. A tripulação da UNIVASF está preparando novos conteúdos e dados para esta seção!
      </p>
      <a href="index.html" class="btn-hero-primary" style="display: inline-block; padding: 0.7rem 1.8rem; font-size: 0.85rem;">Retornar à Base 🚀</a>
    </div>
  `;

  if (typeof THREE === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.onload = () => initThreeStarfield(document.getElementById('three-canvas-container'));
    document.head.appendChild(script);
  } else {
    initThreeStarfield(document.getElementById('three-canvas-container'));
  }
}

function initThreeStarfield(container) {
  if (!container) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const geometry = new THREE.IcosahedronGeometry(1.8, 2);
  const material = new THREE.MeshBasicMaterial({ color: 0x00f0ff, wireframe: true, transparent: true, opacity: 0.35 });
  const sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);

  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 300;
  const posArray = new Float32Array(particlesCount * 3);

  for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 12;
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  const particlesMaterial = new THREE.PointsMaterial({ size: 0.03, color: 0xffcc00 });
  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particlesMesh);

  camera.position.z = 5;

  function animate() {
    requestAnimationFrame(animate);
    sphere.rotation.x += 0.003;
    sphere.rotation.y += 0.005;
    particlesMesh.rotation.y -= 0.001;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    if (!container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}
// ==========================================================================
// INJEÇÃO AUTOMÁTICA DE FAVICON GLOBAL (main.js)
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  const linkId = "dynamic-favicon";
  
  // Verifica se já não existe para evitar duplicidade
  if (!document.getElementById(linkId)) {
    const favicon = document.createElement("link");
    favicon.id = linkId;
    favicon.rel = "icon";
    favicon.type = "image/png"; // ou image/x-icon se for .ico
    favicon.href = "logo.png"; // Substitua pelo caminho correto do seu arquivo de ícone/logo
    document.head.appendChild(favicon);
  }
});