import { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "./../context/AuthContext";
import PropTypes from "prop-types";
import { SensorContext } from "../context/SensorContext";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

function RealTimeSensorData({ sensorId, sensor }) {
  const [qualidadeAr, setQualidadeAr] = useState(null);
  const [historico, setHistorico] = useState([]); // Para armazenar os últimos 5 dados
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reconnecting, setReconnecting] = useState(false);
  const { user } = useContext(AuthContext);
  const { setSensorStatus } = useContext(SensorContext);
  const socketRef = useRef(null);

  // Conectar ao WebSocket e gerenciar os dados
  useEffect(() => {
    const socketConnection = new WebSocket(import.meta.env.VITE_WS_URL);
    socketRef.current = socketConnection;

    socketConnection.onopen = () => {
      console.log(`Conexão WebSocket aberta para o sensor ID: ${sensorId}`);
      const message = JSON.stringify({
        type: "usuario",
        sensorId: sensor.deviceName,
        userId: user._id,
      });
      socketConnection.send(message);
      setLoading(false);
    };

    socketConnection.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log(data);

        if (data.type === "sensorData" && data.sensorId === sensor.deviceName) {
          setSensorStatus((prevStatus) => ({
            ...prevStatus,
            [sensor.deviceName]: {
              status: "ativo",
              ppm: data.data.ppm,
            },
          }));
          setQualidadeAr(data.data.ppm);
          setLoading(false);
          setError(null);

          // Atualizar o histórico com os últimos 5 dados de qualidade do ar e hora
          const currentTime = new Date().toLocaleTimeString();
          setHistorico((prevHistorico) => {
            const novoHistorico = [
              { ppm: data.data.ppm, time: currentTime },
              ...prevHistorico,
            ];
            return novoHistorico.slice(0, 5); // Manter apenas os últimos 5 dados
          });
        } else if (data.status === "error") {
          setError(data.message || "Erro desconhecido ao buscar dados.");
          setQualidadeAr(null);
          setLoading(false);
        }
      } catch (e) {
        setError("Erro ao processar os dados recebidos.");
        setQualidadeAr(null);
        setLoading(false);
        console.error("Erro ao processar os dados:", e);
      }
    };

    socketConnection.onclose = () => {
      console.log(`Conexão WebSocket fechada para o sensor ID: ${sensorId}`);
      setReconnecting(true);
      setTimeout(() => {
        console.log("Tentando reconectar...");
        const reconnectSocket = new WebSocket(import.meta.env.VITE_WS_URL);
        socketRef.current = reconnectSocket;

        reconnectSocket.onopen = () => {
          setReconnecting(false);
        };

        reconnectSocket.onerror = (error) => {
          setError(`Erro na reconexão WebSocket: ${error.message}`);
          console.error("Erro na reconexão WebSocket:", error);
          setReconnecting(false);
        };
      }, 3000);
    };

    socketConnection.onerror = (error) => {
      setError(`Erro no WebSocket: ${error.message}`);
      console.error("Erro no WebSocket:", error);
    };

    return () => {
      if (socketConnection) {
        socketConnection.close();
        console.log(`Conexão WebSocket fechada para o sensor ID: ${sensorId}`);
      }
    };
  }, [sensorId, sensor.deviceName, user._id, setSensorStatus]);

  if (reconnecting) {
    return (
      <p className="text-gray-500 text-center font-semibold">
        Reconectando ao sensor...
      </p>
    );
  }

  if (loading) {
    return (
      <p className="text-gray-500 text-center font-semibold">
        Carregando dados em tempo real...
      </p>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center font-semibold">{error}</p>;
  }

  if (qualidadeAr === null) {
    return (
      <p className="text-gray-500 text-center font-semibold">
        Sem dados disponíveis no momento.
      </p>
    );
  }

  return (
    <div className="mt-1 p-4">
      <div className="mb-4">
        <h3 className="text-xl font-semibold">Legenda de Qualidade do Ar</h3>
        <div className="flex items-center space-x-4">
          {/* Bolinha verde */}
          <div className="flex items-center">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: "green" }}
            ></div>
            <span className="ml-2 text-sm text-gray-700">
              Qualidade do ar ótima
            </span>
          </div>

          {/* Bolinha amarela */}
          <div className="flex items-center">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: "yellow" }}
            ></div>
            <span className="ml-2 text-sm text-gray-700">
              Qualidade do ar moderada
            </span>
          </div>

          {/* Bolinha vermelha */}
          <div className="flex items-center">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: "red" }}
            ></div>
            <span className="ml-2 text-sm text-gray-700">
              Qualidade do ar ruim
            </span>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-gray-700 mb-10 ">
        Dados em Tempo Real em PPM (Partes por milhão)
      </h2>

      {/* Barra de Progresso da Qualidade do Ar */}
      <div
        className="mb-4 flex justify-center items-center"
        style={{ width: 180, height: 180, margin: "0 auto" }}
      >
       <CircularProgressbar
  value={qualidadeAr}
  maxValue={400}
  text={`${qualidadeAr} `}
  styles={buildStyles({
    pathColor:
      qualidadeAr < 12
        ? "rgb(0, 128, 0)" // Verde
        : qualidadeAr >= 12 && qualidadeAr <= 20
        ? "rgb(204, 204, 0)" // Amarelo mais escuro
        : qualidadeAr > 20
        ? "rgb(255, 0, 0)" // Vermelho
        : "rgb(255, 255, 255)", // Branco
    textColor:
      qualidadeAr < 12
        ? "rgb(0, 128, 0)" // Verde
        : qualidadeAr >= 12 && qualidadeAr <= 20
        ? "rgb(204, 204, 0)" // Amarelo mais escuro
        : qualidadeAr > 20
        ? "rgb(255, 0, 0)" // Vermelho
        : "rgb(255, 255, 255)", // Branco
    trailColor: "rgb(240, 240, 240)", // Fundo claro
    strokeWidth: 10,
  })}
/>

      </div>

      {/* Histórico dos Últimos 5 Dados */}
      <div className="my-10">
        <h3>Histórico de Qualidade do Ar (Últimos 5 dados):</h3>
        <ul className="list-disc pl-6">
          {historico.map((item, index) => (
            <li key={index}>
              Hora: {item.time} | PPM: {item.ppm}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <h3>Status do Ambiente:</h3>
        <div
          className={`status-box ${
            qualidadeAr < 12
              ? "safe"
              : qualidadeAr >= 12 && qualidadeAr <= 20
              ? "moderate"
              : qualidadeAr > 20
              ? "danger"
              : "kill"
          }`}
        >
          <p
            className={`text-center text-lg font-bold mt-10 ${
              qualidadeAr < 12
                ? "text-green-500"
                : qualidadeAr >= 12 && qualidadeAr <= 20
                ? "text-yellow-500"
                : qualidadeAr > 20
                ? "text-red-500"
                : "text-gray-500"
            }`}
          >
            {qualidadeAr < 12
              ? "🌞 Qualidade do ar está ótima"
              : qualidadeAr >= 12 && qualidadeAr <= 20
              ? "⚠️ Qualidade do ar moderada"
              : qualidadeAr > 20
              ? "❌ Qualidade do ar ruim"
              : "❌ Sem dados disponíveis"}
          </p>
        </div>
      </div>
    </div>
  );
}

RealTimeSensorData.propTypes = {
  sensorId: PropTypes.string.isRequired,
  sensor: PropTypes.shape({
    deviceName: PropTypes.string.isRequired,
  }).isRequired,
};

export default RealTimeSensorData;
