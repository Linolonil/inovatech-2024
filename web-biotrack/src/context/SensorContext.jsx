import { createContext, useState } from "react";
import { toast } from "react-toastify";
import { addSensorInUser, deleteSensorInUser, getSensorsFromUser, updateLocationSensor } from "../services/apiSensor";
import { PropTypes } from 'prop-types';

export const SensorContext = createContext();

export const SensorProvider = ({ children }) => {
  const [sensor, setSensor] = useState([]); 

  const addSensor = async ({ userId, deviceName, location }) => {
    try {
      const response = await addSensorInUser({
        userId,
        deviceName,
        location,
      });

      toast.success("Sensor vinculado com sucesso!", {  
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return response.data;
    } catch (error) {
      console.error("Erro no vínculo do sensor", error);
      toast.error(error.response?.data?.message || "Erro ao vincular sensor", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return error.response?.data || {};
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

      return response.data;
    } catch (error) {
      console.error("Erro ao buscar sensores", error);
      toast.error(error.response?.data?.message || "Erro ao buscar sensores", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return error.response?.data || {};
    }
  };

  const updateSensor = async ({sensorId, location, sensorName}) => {
    try {
      const response = await updateLocationSensor({ sensorId, location });
  
      if (response?.sensor) {
        toast.success(`atualização do sensor ${sensorName} realizada com sucesso` , {   
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setSensor(response.sensor);
      } else {
        toast.error("Nenhum sensor encontrado.");
      }
  
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar o sensor", error);
      toast.error(error.response?.data?.message || "Erro ao atualizar sensor", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return error.response?.data || {};
    }
  };

  const deleteSensor = async ({userId, sensorId}) => {
    try {
      const response = await deleteSensorInUser({userId, sensorId});
  
      if (response?.status === "success") {
        toast.success(`desvinculação do sensor realizada com sucesso` , {   
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setSensor(response.sensor);
      } else {
        toast.error("Nenhum sensor encontrado.");
      }
  
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar o sensor", error);
      toast.error(error.response?.data?.message || "Erro ao atualizar sensor", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return error.response?.data || {};
    }
  };

  return (
    <SensorContext.Provider value={{ addSensor, getSensor, updateSensor, deleteSensor, sensor }}>
      {children}
    </SensorContext.Provider>
  );
};

SensorProvider.propTypes = {
  children: PropTypes.node.isRequired, 
};

export default SensorProvider;
