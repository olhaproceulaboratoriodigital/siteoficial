// ==========================================================================
// OLHA PRO CÉU UNIVASF - MOTOR LUNAR & ASTRONOMY ENGINE (lua.js)
// ==========================================================================

function loadAstronomyEngine(callback) {
  if (typeof Astronomy !== 'undefined') {
    callback();
    return;
  }
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/astronomy-engine@2.1.19/astronomy.browser.min.js';
  script.onload = () => callback();
  document.head.appendChild(script);
}

function initLunarCalculator(containerId) {
  loadAstronomyEngine(() => {
    const container = document.getElementById(containerId);
    if (!container) return;

    const now = new Date();
    const illum = Astronomy.Illumination(Astronomy.Body.Moon, now);
    const moonPhase = Astronomy.MoonPhase(now);
    
    let phaseName = "Lua Nova";
    let phaseIcon = "🌑";
    if (moonPhase > 5 && moonPhase < 85) { phaseName = "Lua Crescente Côncava"; phaseIcon = "🌒"; }
    else if (moonPhase >= 85 && moonPhase <= 95) { phaseName = "Quarto Crescente"; phaseIcon = "🌓"; }
    else if (moonPhase > 95 && moonPhase < 175) { phaseName = "Lua Crescente Gibosa"; phaseIcon = "🌔"; }
    else if (moonPhase >= 175 && moonPhase <= 185) { phaseName = "Lua Cheia"; phaseIcon = "🌕"; }
    else if (moonPhase > 185 && moonPhase < 265) { phaseName = "Lua Minguante Gibosa"; phaseIcon = "🌖"; }
    else if (moonPhase >= 265 && moonPhase <= 275) { phaseName = "Quarto Minguante"; phaseIcon = "🌗"; }
    else if (moonPhase > 275 && moonPhase < 355) { phaseName = "Lua Minguante Côncava"; phaseIcon = "🌘"; }

    const illuminationPercent = Math.round(illum.phase_fraction * 100);
    const distanceKm = Math.round(illum.d * 149597870.7);

    container.innerHTML = `
      <div style="background: var(--bg-card); border: 1px solid var(--border-space); border-radius: 20px; padding: 2.5rem; display: flex; flex-wrap: wrap; gap: 2.5rem; align-items: center; box-shadow: 0 10px 30px rgba(0,0,0,0.6);">
        <div style="flex: 1; min-width: 260px; text-align: center;">
          <div style="font-size: 5rem; margin-bottom: 0.5rem;">${phaseIcon}</div>
          <h3 style="font-family: var(--font-orbitron); color: #fff; font-size: 1.5rem; margin-bottom: 0.3rem;">${phaseName}</h3>
          <p style="color: var(--accent-gold); font-size: 0.9rem; letter-spacing: 1px;">Iluminação: ${illuminationPercent}%</p>
        </div>
        <div style="flex: 1.5; min-width: 280px; display: grid; gap: 1rem;">
          <div style="background: rgba(255,255,255,0.02); padding: 1rem 1.2rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05);">
            <span style="color: var(--text-muted); font-size: 0.8rem; display: block; margin-bottom: 0.2rem;">DISTÂNCIA ATUAL DA TERRA</span>
            <strong style="color: #fff; font-size: 1.1rem; font-family: var(--font-orbitron);">${distanceKm.toLocaleString('pt-BR')} km</strong>
          </div>
          <div style="background: rgba(255,255,255,0.02); padding: 1rem 1.2rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05);">
            <span style="color: var(--text-muted); font-size: 0.8rem; display: block; margin-bottom: 0.2rem;">ÂNGULO DE FASE LUNAR</span>
            <strong style="color: #fff; font-size: 1.1rem; font-family: var(--font-orbitron);">${moonPhase.toFixed(1)}°</strong>
          </div>
          <div style="background: rgba(255,255,255,0.02); padding: 1rem 1.2rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05);">
            <span style="color: var(--text-muted); font-size: 0.8rem; display: block; margin-bottom: 0.2rem;">LOCALIZAÇÃO DE REFERÊNCIA</span>
            <strong style="color: var(--accent-cyan); font-size: 0.95rem;">UNIVASF • Vale do São Francisco</strong>
          </div>
        </div>
      </div>
    `;
  });
}