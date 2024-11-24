import { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from './../context/AuthContext';
import PropTypes from 'prop-types';

function RealTimeSensorData({ sensorId, sensor }) {
  const [qualidadeAr, setQualidadeAr] = useState(null);  // Estado para armazenar o valor da qualidade do ar
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const socketRef = useRef(null);

  useEffect(() => {
    // Estabelecendo a conexão WebSocket
    const socketConnection = new WebSocket(import.meta.env.VITE_WS_URL);
    socketRef.current = socketConnection;

    socketConnection.onopen = () => {
      console.log(`Conexão WebSocket aberta para o sensor ID: ${sensorId}`);

      // Enviando mensagem ao servidor para vincular o usuário ao sensor
      const message = JSON.stringify({
        type: "usuario",
        sensorId: sensor.deviceName,
        userId: user._id,
      });

      socketConnection.send(message);
      setLoading(false);
    };

    // Quando a mensagem for recebida do WebSocket
    socketConnection.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
    
        // Se os dados do sensor correspondem ao sensor atual, atualize a qualidade do ar
        if (data.type === "sensorData" && data.sensorId === sensor.deviceName) {
          // Atualiza a leitura da qualidade do ar
          setQualidadeAr(data.data.ppm);
          setLoading(false);  // Remove o carregamento
          setError(null);     // Limpa o erro, se houver
    
        } else if (data.status === "error") {
          // Caso o sensor esteja offline ou com erro
          setError(data.message || "Erro desconhecido ao buscar dados.");
          setQualidadeAr(null);
          setLoading(false);  // Remove o carregamento em caso de erro
        }
      } catch (e) {
        setError("Erro ao processar os dados recebidos.");
        setQualidadeAr(null);
        setLoading(false);  // Remove o carregamento em caso de erro de processamento
        console.error("Erro ao processar os dados:", e);
      }
    };
    
   socketConnection.onclose = () => {
  console.log(`Conexão WebSocket fechada para o sensor ID: ${sensorId}`);
  
  // Lógica de reconexão em caso de falha
  setTimeout(() => {
    console.log("Tentando reconectar...");
    const reconnectSocket = new WebSocket(import.meta.env.VITE_WS_URL);
    socketRef.current = reconnectSocket;
    // Re-execute a lógica de envio e recebimento de mensagens aqui, se necessário.
  }, 3000); // Tenta reconectar após 3 segundos
};

socketConnection.onerror = (error) => {
  setError(`Erro no WebSocket: ${error.message}`);
  console.error("Erro no WebSocket:", error);
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
  }, [sensorId, sensor.deviceName, user._id]); 

  // Exibindo a interface com base no estado
  if (loading) {
    return <p>Carregando dados em tempo real...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (qualidadeAr === null) {
    return <p>Sem dados disponíveis no momento.</p>;
  }

  return (
    <div className="mt-4 p-4 bg-gray-100 rounded-lg">
      <p>
        <strong>Qualidade do Ar:</strong> {qualidadeAr} PPM
      </p>
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
