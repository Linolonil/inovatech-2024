import { createContext, useState } from "react";
import { toast } from "react-toastify";
import {
  addSensorInUser,
  deleteSensorInUser,
  getSensorsFromUser,
  updateLocationSensor,
} from "../services/apiSensor";
import PropTypes from "prop-types";

export const SensorContext = createContext();

export const SensorProvider = ({ children }) => {
  const [sensor, setSensor] = useState([]);
  const [sensorStatus, setSensorStatus] = useState({});

  const addSensor = async ({ userId, deviceName, location }) => {
    try {
      const response = await addSensorInUser({ userId, deviceName, location });

      setSensor((prev) => [...prev, response]); // Atualiza o estado com o novo sensor
      toast.success("Sensor vinculado com sucesso!", {
        position: "top-right",
        autoClose: 3000,
      });
      return response;
    } catch (error) {
      console.error("Erro no vínculo do sensor:", error);
      toast.error(error.response?.data?.message || "Erro ao vincular sensor");
      throw error;
    }
  };

  const getSensor = async (userId) => {
    try {
      const response = await getSensorsFromUser(userId);

      if (response?.sensores) {
        setSensor(response.sensores);
      } else {
        toast.error("Nenhum sensor encontrado.");
      }

      return response;
    } catch (error) {
      console.error("Erro ao buscar sensores:", error);
      toast.error(error.response?.data?.message || "Erro ao buscar sensores");
      throw error;
    }
  };

  const updateSensor = async ({ sensorId, location, sensorName }) => {
    try {
      const response = await updateLocationSensor({ sensorId, location });

      setSensor((prev) =>
        prev.map((s) => (s.id === sensorId ? { ...s, ...response.sensor } : s))
      );

      toast.success(`Sensor "${sensorName}" atualizado com sucesso!`, {
        position: "top-right",
        autoClose: 3000,
      });
      return response;
    } catch (error) {
      console.error("Erro ao atualizar o sensor:", error);
      toast.error(error.response?.data?.message || "Erro ao atualizar sensor");
      throw error;
    }
  };

  const deleteSensor = async ({ userId, sensorId }) => {
    try {
      const response = await deleteSensorInUser({ userId, sensorId });

      setSensor((prev) => prev.filter((s) => s.id !== sensorId));
      toast.success("Sensor desvinculado com sucesso!", {
        position: "top-right",
        autoClose: 3000,
      });
      return response;
    } catch (error) {
      console.error("Erro ao desvincular o sensor:", error);
      toast.error(error.response?.data?.message || "Erro ao desvincular sensor");
      throw error;
    }
  };

  return (
    <SensorContext.Provider
      value={{
        addSensor,
        getSensor,
        updateSensor,
        deleteSensor,
        sensor,
        sensorStatus,
        setSensorStatus,
      }}
    >
      {children}
    </SensorContext.Provider>
  );
};

SensorProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SensorProvider;
