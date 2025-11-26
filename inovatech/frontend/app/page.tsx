"use client";
import { useEffect, useRef, useState } from "react";

export default function ESP8266Emulator() {
  const [connected, setConnected] = useState(false);
  const [logs, setLogs] = useState([]);
  const [combo, setCombo] = useState<{ buttonId: number; color: string }[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const comboTimer = useRef<NodeJS.Timeout | null>(null);

  const buttons = [
    { buttonId: 1, color: "red" },
    { buttonId: 2, color: "blue" },
    { buttonId: 3, color: "green" },
    { buttonId: 4, color: "yellow" },
    { buttonId: 5, color: "orange" },
    { buttonId: 6, color: "purple" },
  ];

  const addLog = (msg: string, type: string = "info") => {
    const entry = { time: new Date().toLocaleTimeString(), msg, type };
    setLogs(prev => [...prev.slice(-40), entry]);
  };

  const connect = () => {
    try {
      const ws = new WebSocket("ws://localhost:3001/ws?deviceId=CRIANCA-01&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MjY2NmRjNzI4MWMxY2FmMWY0NWU1OCIsImlhdCI6MTc2NDEzNTE5MywiZXhwIjoxNzY0NzM5OTkzfQ._RyBDFb26C3Ue19eScSxHpDnPtUGesEU7FXkb1B0210");


      ws.onopen = () => {
        setConnected(true);
        addLog("WebSocket conectado", "success");
      };

      ws.onclose = () => {
        setConnected(false);
        addLog("WebSocket desconectado", "warning");
      };

      ws.onerror = () => addLog("Erro no WebSocket", "error");

      ws.onmessage = e => addLog(`Recebido: ${e.data}`, "receive");

      wsRef.current = ws;
    } catch {
      addLog("Falha ao conectar", "error");
    }
  };

  const comboRef = useRef<{ buttonId: number; color: string }[]>([]);

  const pressButton = (button: { buttonId: number; color: string }) => {
    comboRef.current = [...comboRef.current, button];
    setCombo(comboRef.current);
    addLog(`Botão ${button.buttonId} (${button.color}) pressionado`, "info");

    if (comboTimer.current) clearTimeout(comboTimer.current);
    comboTimer.current = setTimeout(() => sendCombo(), 2000);
  };

  const sendCombo = () => {
    if (!connected || !wsRef.current || comboRef.current.length === 0) {
      if (comboRef.current.length > 0)
        addLog(`Não conectado. Combo ${comboRef.current.map(b => b.buttonId).join(", ")} ignorado`, "error");
      comboRef.current = [];
      setCombo([]);
      return;
    }

    // Envia o combo completo com buttonId e color
    const payload = {
      event: "combo",
      deviceId: "CRIANCA-01",
      sequence: [...comboRef.current], // array de objetos {buttonId, color}
      timestamp: new Date().toISOString()
    };

    wsRef.current.send(JSON.stringify(payload));
    addLog(`Enviado combo: ${comboRef.current.map(b => b.buttonId).join(", ")}`, "send");

    comboRef.current = [];
    setCombo([]);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const button = buttons.find(b => b.buttonId === Number(e.key));
      if (button) pressButton(button);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <button
        onClick={connect}
        disabled={connected}
        className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
      >
        Conectar
      </button>

      <div className="grid grid-cols-3 gap-4">
        {buttons.map(button => (
          <button
            key={button.buttonId}
            onClick={() => pressButton(button)}
            className="p-6 bg-blue-600 text-white rounded text-xl font-bold"
          >
            {button.buttonId}
          </button>
        ))}
      </div>

      <div className="bg-black text-white p-4 h-72 overflow-y-auto text-sm rounded">
        {logs.map((l, i) => (
          <div key={i} className="mb-1">
            <span className="text-gray-400">[{l.time}]</span> {l.msg}
          </div>
        ))}
      </div>
    </div>
  );
}
