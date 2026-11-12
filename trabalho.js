<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Parque de Diversões Simples</title>
  <!-- Tailwind CSS para estilização responsiva dos controles -->
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@600;700&display=swap" rel="stylesheet" />
</head>
<body class="m-0 p-0 overflow-hidden bg-slate-900 font-['Inter',sans-serif] select-none">

  <!-- Tela principal da animação -->
  <canvas id="parque" class="block w-screen h-screen"></canvas>

  <!-- Botões de controle responsivos -->
  <div class="fixed bottom-4 left-1/2 -translate-x-1/2 flex flex-wrap justify-center gap-3 w-full max-w-md px-4">
    <button
      id="btnTema"
      type="button"
      class="px-5 py-3 rounded-full font-bold text-sm text-white bg-orange-500 hover:bg-orange-600 active:scale-95 shadow-lg transition transform cursor-pointer"
    >
      🌙 Noite / Dia
    </button>
    <button
      id="btnPausar"
      type="button"
      class="px-5 py-3 rounded-full font-bold text-sm text-white bg-emerald-500 hover:bg-emerald-600 active:scale-95 shadow-lg transition transform cursor-pointer"
    >
      ⏸️ Pausar
    </button>
  </div>

  <script>
    const canvas = document.getElementById('parque');
    const ctx = canvas.getContext('2d');

    // Estado simples da animação
    let tempo = 0;
    let noite = false;
    let pausado = false;

    // Ajusta o tamanho do canvas para preencher qualquer tela
    function redimensionar() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', redimensionar);
    redimensionar();

    // Eventos dos botões de interação
    document.getElementById('btnTema').addEventListener('click', () => {
      noite = !noite;
    });

    document.getElementById('btnPausar').addEventListener('click', (e) => {
      pausado = !pausado;
      e.currentTarget.textContent = pausado ? '▶️ Continuar' : '⏸️ Pausar';
    });

    // 1. Cenário: Céu, Sol/Lua, Nuvens e Gramado
    function desenharCenario() {
      ctx.fillStyle = noite ? '#0f172a' : '#7dd3fc';
      ctx.fillRect(0, 0, 800, 500);

      // Sol ou Lua
      ctx.fillStyle = noite ? '#fef08a' : '#facc15';
      ctx.beginPath();
      ctx.arc(690, 75, 32, 0, Math.PI * 2);
      ctx.fill();

      // Nuvens em movimento suave
      ctx.fillStyle = noite ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.85)';
      for (let i = 0; i < 3; i++) {
        const x = ((tempo * 20 + i * 280) % 920) - 60;
        const y = 60 + i * 28;
        ctx.beginPath();
        ctx.arc(x, y, 22, 0, Math.PI * 2);
        ctx.arc(x + 22, y - 5, 26, 0, Math.PI * 2);
        ctx.arc(x + 45, y, 20, 0, Math.PI * 2);
        ctx.fill();
      }

      // Gramado e calçada do parque
      ctx.fillStyle = noite ? '#14532d' : '#4ade80';
      ctx.fillRect(0, 360, 800, 140);
      ctx.fillStyle = noite ? '#334155' : '#fde68a';
      ctx.fillRect(0, 415, 800, 85);
    }

    // 2. Roda Gigante girando com 8 cabines coloridas
    function desenharRodaGigante(cx, cy, raio) {
      // Pernas de sustentação
      ctx.strokeStyle = '#e11d48';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx - 65, 415);
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + 65, 415);
      ctx.stroke();

      // Aro externo
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(cx, cy, raio, 0, Math.PI * 2);
      ctx.stroke();

      // Raios e cabines
      const cores = ['#ef4444', '#3b82f6', '#10b981', '#a855f7'];
      for (let i = 0; i < 8; i++) {
        const angulo = tempo * 0.6 + (i * Math.PI) / 4;
        const x = cx + Math.cos(angulo) * raio;
        const y = cy + Math.sin(angulo) * raio;

        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(x, y);
        ctx.stroke();

        // Cabine
        ctx.fillStyle = cores[i % cores.length];
        ctx.fillRect(x - 10, y, 20, 14);
      }
    }

    // 3. Montanha-Russa com carrinho seguindo a inclinação da pista
    function desenharMontanhaRussa() {
      const alturaTrilho = (x) => 310 - Math.sin(x * 0.015) * 65;

      // Pilares de apoio
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;
      for (let x = 20; x < 430; x += 35) {
        ctx.beginPath();
        ctx.moveTo(x, alturaTrilho(x));
        ctx.lineTo(x, 415);
        ctx.stroke();
      }

      // Trilho ondulado
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 5;
      ctx.beginPath();
      for (let x = 0; x <= 440; x += 5) {
        const y = alturaTrilho(x);
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Carrinho em movimento acompanhando a curva
      const carX = (tempo * 95) % 420;
      const carY = alturaTrilho(carX) - 8;
      const inclinacao = Math.atan2(alturaTrilho(carX + 2) - alturaTrilho(carX), 2);

      ctx.save();
      ctx.translate(carX, carY);
      ctx.rotate(inclinacao);
      ctx.fillStyle = '#2563eb';
      ctx.fillRect(-18, -8, 36, 14);

      // Passageiros
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(-6, -12, 4, 0, Math.PI * 2);
      ctx.arc(7, -12, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 4. Carrossel Mágico com cavalinhos subindo e descendo
    function desenharCarrossel(cx, baseY) {
      // Base e teto
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(cx - 75, baseY - 12, 150, 12);

      ctx.fillStyle = '#ec4899';
      ctx.beginPath();
      ctx.moveTo(cx, baseY - 135);
      ctx.lineTo(cx - 85, baseY - 90);
      ctx.lineTo(cx + 85, baseY - 90);
      ctx.closePath();
      ctx.fill();

      // 3 cavalinhos animados
      for (let i = 0; i < 3; i++) {
        const ang = tempo * 2 + (i * Math.PI * 2) / 3;
        const x = cx + Math.cos(ang) * 48;
        const y = baseY - 42 + Math.sin(tempo * 5 + i) * 10;

        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x, baseY - 90);
        ctx.lineTo(x, baseY - 12);
        ctx.stroke();

        ctx.fillStyle = i % 2 === 0 ? '#38bdf8' : '#c084fc';
        ctx.fillRect(x - 12, y - 8, 24, 14);
      }
    }

    // 5. Mascote EMA TRO acenando
    function desenharMascote(x, y) {
      const aceno = Math.sin(tempo * 6) * 0.4;
      ctx.save();
      ctx.translate(x, y);

      // Asa esquerda acenando
      ctx.save();
      ctx.translate(-14, -4);
      ctx.rotate(-0.7 + aceno);
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(-16, -4, 16, 8);
      ctx.restore();

      // Corpo e cabeça
      ctx.fillStyle = '#0ea5e9';
      ctx.beginPath();
      ctx.arc(0, 0, 18, 0, Math.PI * 2);
      ctx.arc(0, -22, 11, 0, Math.PI * 2);
      ctx.fill();

      // Bico
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.moveTo(8, -24);
      ctx.lineTo(18, -21);
      ctx.lineTo(8, -18);
      ctx.fill();

      // Pés
      ctx.fillStyle = '#f97316';
      ctx.fillRect(-10, 16, 7, 10);
      ctx.fillRect(3, 16, 7, 10);
      ctx.restore();
    }

    // Loop principal da animação
    function animar() {
      try {
        if (!pausado) tempo += 0.016;

        ctx.save();
        // Mantém a cena proporcional em qualquer resolução de tela
        const escala = Math.max(canvas.width / 800, canvas.height / 500);
        const offsetX = (canvas.width - 800 * escala) / 2;
        const offsetY = (canvas.height - 500 * escala) / 2;
        ctx.translate(offsetX, offsetY);
        ctx.scale(escala, escala);

        desenharCenario();
        desenharRodaGigante(520, 210, 95);
        desenharMontanhaRussa();
        desenharCarrossel(680, 415);
        desenharMascote(470, 405);

        ctx.restore();
      } catch (erro) {
        console.error(erro);
      }