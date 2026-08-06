import React, { useEffect, useRef } from 'react';

export default function VideoPlayer({ videoData, activeSceneIndex, sceneProgress }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !videoData || !videoData.scenes[activeSceneIndex]) return;
    const ctx = canvas.getContext('2d');
    const scene = videoData.scenes[activeSceneIndex];
    const canvasData = scene.canvasData || {};
    const bgGradient = canvasData.bgGradient || ["#050505", "#141414"];

    // 1. Background Linear Gradient
    const grad = ctx.createLinearGradient(0, 0, 960, 540);
    grad.addColorStop(0, bgGradient[0]);
    grad.addColorStop(1, bgGradient[1]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 960, 540);

    // 2. Subtle Grid Lines (Humanise Monochrome Style)
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;
    for (let x = 0; x < 960; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 540); ctx.stroke();
    }
    for (let y = 0; y < 540; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(960, y); ctx.stroke();
    }

    // 3. Header Scene Title Banner
    ctx.fillStyle = "rgba(255, 255, 255, 0.06)";
    ctx.fillRect(40, 25, 880, 48);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.strokeRect(40, 25, 880, 48);

    ctx.font = "bold 18px 'Plus Jakarta Sans', sans-serif";
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "left";
    ctx.fillText(`SCENE ${activeSceneIndex + 1}: ${scene.title}`, 60, 55);

    ctx.font = "bold 12px 'JetBrains Mono', monospace";
    ctx.fillStyle = "#A3A3A3";
    ctx.textAlign = "right";
    ctx.fillText(`${videoData.methodology || 'Feynman'} • ${videoData.language || 'English'}`, 900, 55);

    // 4. Render Scene Visual Elements
    const elements = canvasData.elements || [];
    const time = Date.now() * 0.003;

    elements.forEach((el) => {
      ctx.save();
      if (el.type === 'sun') {
        ctx.fillStyle = el.color || "#FFFFFF";
        ctx.beginPath(); ctx.arc(el.x, el.y, el.radius || 40, 0, Math.PI * 2); ctx.fill();
        ctx.font = "bold 13px 'Plus Jakarta Sans', sans-serif";
        ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "center";
        ctx.fillText(el.label || "Sunlight", el.x, el.y + el.radius + 20);
      }
      else if (el.type === 'leaf') {
        ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
        ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.ellipse(el.x, el.y, el.width / 2, el.height / 2, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill(); ctx.stroke();
        ctx.font = "bold 16px 'Plus Jakarta Sans', sans-serif";
        ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "center";
        ctx.fillText("PLANT CELL / LEAF", el.x, el.y + 5);
      }
      else if (el.type === 'molecule' || el.type === 'output') {
        ctx.fillStyle = "#171717"; ctx.strokeStyle = "#404040"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.roundRect(el.x - 70, el.y - 20, 140, 40, 8); ctx.fill(); ctx.stroke();
        ctx.font = "bold 14px 'JetBrains Mono', monospace";
        ctx.fillStyle = el.color || "#FFFFFF"; ctx.textAlign = "center";
        ctx.fillText(el.name, el.x, el.y + 5);
      }
      else if (el.type === 'arrow') {
        ctx.strokeStyle = el.color || "#FFFFFF"; ctx.lineWidth = 3;
        ctx.setLineDash([6, 6]); ctx.beginPath();
        ctx.moveTo(el.from[0], el.from[1]); ctx.lineTo(el.to[0], el.to[1]); ctx.stroke();
        ctx.setLineDash([]);
      }
      else if (el.type === 'complex' || el.type === 'flow_step') {
        ctx.fillStyle = "#171717"; ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.roundRect(el.x - (el.width ? el.width/2 : 70), el.y - 25, el.width || 140, el.height || 50, 8);
        ctx.fill(); ctx.stroke();
        ctx.font = "bold 13px 'Plus Jakarta Sans', sans-serif";
        ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "center";
        ctx.fillText(el.name || el.title, el.x, el.y + 5);
      }
      else if (el.type === 'math_formula' || el.type === 'formula_banner') {
        ctx.fillStyle = "rgba(255, 255, 255, 0.05)"; ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.roundRect(el.x, el.y, 480, 54, 10); ctx.fill(); ctx.stroke();
        ctx.font = "bold 18px 'JetBrains Mono', monospace";
        ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "center";
        ctx.fillText(el.text, el.x + 240, el.y + 34);
      }
      else if (el.type === 'concept_node' || el.type === 'branch_node') {
        ctx.fillStyle = "#171717"; ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(el.x, el.y, el.r || 45, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.font = "bold 13px 'Plus Jakarta Sans', sans-serif";
        ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "center";
        ctx.fillText(el.label, el.x, el.y + 4);
      }
      else if (el.type === 'summary_grid') {
        (el.items || []).forEach((item, idx) => {
          ctx.fillStyle = "#171717"; ctx.strokeStyle = "#404040"; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.roundRect(140, 140 + (idx * 75), 680, 55, 8); ctx.fill(); ctx.stroke();
          ctx.font = "bold 15px 'Plus Jakarta Sans', sans-serif";
          ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "left";
          ctx.fillText(`✔  ${item}`, 170, 174 + (idx * 75));
        });
      }
      ctx.restore();
    });

    // 5. Takeaways Footer Box
    if (scene.bullets && scene.bullets.length) {
      ctx.fillStyle = "rgba(10, 10, 10, 0.85)"; ctx.fillRect(40, 440, 880, 75);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)"; ctx.strokeRect(40, 440, 880, 75);
      ctx.font = "bold 12px 'JetBrains Mono', monospace"; ctx.fillStyle = "#A3A3A3";
      ctx.textAlign = "left"; ctx.fillText("KEY TAKEAWAYS & FORMULAS:", 55, 460);
      ctx.font = "14px 'Plus Jakarta Sans', sans-serif"; ctx.fillStyle = "#FFFFFF";
      scene.bullets.forEach((bullet, idx) => {
        if (idx < 2) ctx.fillText(`• ${bullet}`, 55 + (idx * 430), 495);
      });
    }

  }, [videoData, activeSceneIndex, sceneProgress]);

  if (!videoData) return null;
  const currentScene = videoData.scenes[activeSceneIndex] || {};

  return (
    <div className="stage-wrapper">
      <canvas ref={canvasRef} width="960" height="540" />
      <div className="avatar-badge">
        <span>🤖</span>
        <span>Buddy AI Presenter (Scene {activeSceneIndex + 1} of {videoData.scenes.length})</span>
      </div>
      <div className="subtitle-box">
        {currentScene.narration || 'Loading video narration...'}
      </div>
    </div>
  );
}
