import api from "./api";

export const addSensorInUser = async ({ userId, deviceName, location }) => {
  try {
    const response = await api.post("/api/sensores", {
      userId,
      deviceName,
      location,
    });

    if (response.status === 200 || response.status === 201) {
      return response.data; 
    } else {
      throw new Error("Erro ao adicionar o sensor.");
    }
  } catch (error) {
    console.error("Erro ao adicionar sensor:", error);
    throw error; // Lança o erro para ser tratado no contexto onde a função é chamada
  }
};

export const getSensorsFromUser = async ( userId ) => {
  try {
    const response = await api.get(`/api/usuarios/${userId}/sensores`);

    if (response.status === 200) {
      return response.data; 
    } else {
      throw new Error("Erro ao buscar sensores.");
    }
  } catch (error) {
    console.error("Erro ao buscar sensores:", error);
    throw error; 
  }
};

export const updateLocationSensor = async ({ sensorId, location }) => {
  try {
    const response = await api.put(`/api/sensores/${sensorId}`, {
      location,
    });

    if (response.status === 200) {
      return response.data; 
    } else {
      throw new Error("Erro ao atualizar sensor.");
    }
  } catch (error) {
    console.error("Erro ao atualizar sensor:", error);
    throw error; 
  }
};

export const deleteSensorInUser = async ({userId, sensorId}) => {
  try {
    const response = await api.delete(`/api/sensores/${userId}/${sensorId}`);

    if (response.status === 200) {
      return response.data; 
    } else {
      throw new Error("Erro ao desvincular sensor.");
    }
  } catch (error) {
    console.error("Erro ao desvincular sensor:", error);
    throw error; 
  }
};