import PropTypes from 'prop-types';
import { useContext, useState } from 'react';
import { SensorContext } from '../context/SensorContext';
import RealTimeSensorData from './RealTimeSensorData'; // Importa o componente para dados em tempo real
import { MdEdit, MdDelete, MdVisibility, MdVisibilityOff } from 'react-icons/md'; // Importa ícones do Material Design

function SensorData({ sensor }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newLocation, setNewLocation] = useState(sensor.location);
  const [showRealTimeData, setShowRealTimeData] = useState(false); // Estado para controlar a exibição dos dados em tempo real
  const { updateSensor, deleteSensor } = useContext(SensorContext);

  const handleEditLocation = () => {
    setIsEditing(true);
  };

  const handleSaveLocation = () => {
    updateSensor({ sensorId: sensor._id, location: newLocation, sensorName: sensor.deviceName });
    setIsEditing(false);
  };

  const handleRemoveSensor = () => {
    deleteSensor({ userId: sensor.userId, sensorId: sensor._id });
  };

  const toggleRealTimeData = () => {
    setShowRealTimeData((prevState) => !prevState); // Alterna o estado de exibição dos dados
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg border border-gray-200">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">{sensor.deviceName}</h3>

      <div className="flex items-center space-x-4 mb-4">
        {isEditing ? (
          <>
            <input
              type="text"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)} 
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              onClick={handleSaveLocation} 
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
              Salvar
            </button>
          </>
        ) : (
          <>
            <p className="text-gray-600">Localização: {sensor.location}</p>
            <button 
              onClick={handleEditLocation} 
              className="text-blue-500 hover:text-blue-700 transition duration-300 ease-in-out">
              <MdEdit className="inline-block mr-1" />
              Editar
            </button>
          </>
        )}
      </div>

      {/* Botão para visualizar dados em tempo real */}
      <button
        onClick={toggleRealTimeData}
        className="px-6 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 mt-4 flex items-center justify-center">
        {showRealTimeData ? (
          <>
            <MdVisibilityOff className="mr-2" />
            Esconder Dados em Tempo Real
          </>
        ) : (
          <>
            <MdVisibility className="mr-2" />
            Ver Dados em Tempo Real
          </>
        )}
      </button>

      {/* Exibe o componente RealTimeSensorData, caso o estado showRealTimeData seja true */}
      {showRealTimeData && (
        <div className="mt-4">
          <RealTimeSensorData sensor={sensor} sensorId={sensor._id} />
        </div>
      )}

      {/* Botões de ações */}
      <div className="flex space-x-4 mt-6">
        <button 
          onClick={handleRemoveSensor} 
          className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500">
          <MdDelete className="inline-block mr-2" />
          Desvincular Sensor
        </button>
      </div>
    </div>
  );
}

SensorData.propTypes = {
  sensor: PropTypes.shape({
    _id: PropTypes.string.isRequired, 
    deviceName: PropTypes.string.isRequired, 
    location: PropTypes.string.isRequired, 
    userId: PropTypes.string.isRequired,
    dados: PropTypes.number.isRequired,
  }).isRequired, 
};

export default SensorData;
