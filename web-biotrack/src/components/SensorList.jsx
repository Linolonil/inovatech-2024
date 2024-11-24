import { useContext, useEffect } from "react";
import { SensorContext } from "../context/SensorContext";
import SensorData from './SensorData';
import { AuthContext } from './../context/AuthContext';

function SensorList() {
  const { sensor, getSensor } = useContext(SensorContext); // Garantindo que o nome do estado seja 'sensor' (não 'sensors')
  const { user } = useContext(AuthContext);
  useEffect(() => {
    if (user?._id) {
      getSensor(user._id); 
    }
  }, [user?._id, getSensor]);


  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Sensores Ativos</h2>
      <div className="space-y-4">
        {/* Renderiza os sensores */}
        {sensor && sensor.length > 0 ? (
          sensor.map((sensor) => (
            <SensorData key={sensor._id} sensor={sensor} />
          ))
        ) : (
          <p className="text-gray-500">Nenhum sensor ativo encontrado.</p>
        )}
      </div>
    </div>
  );
}

export default SensorList;
