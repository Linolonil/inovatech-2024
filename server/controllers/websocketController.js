import { consultarSensores } from "../utils/consultaSensores.js";

export const handleUserConnection = async (userId, ws) => {
  const sensoresResponse = await consultarSensores(userId);
  if (sensoresResponse.status === "error") {
    return ws.send(JSON.stringify({ status: "error", message: sensoresResponse.message }));
  }

  ws.send(JSON.stringify({ status: "success", sensores: sensoresResponse.sensores }));
};
