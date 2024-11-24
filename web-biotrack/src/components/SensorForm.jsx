import { useState, useContext } from "react";
import { SensorContext } from "../context/SensorContext";
import { AuthContext } from "../context/AuthContext";

function SensorForm() {
  const { addSensor } = useContext(SensorContext);
  const { user } = useContext(AuthContext);
  const [deviceName, setDeviceName] = useState("");
  const [location, setLocation] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    addSensor({userId: user._id, deviceName , location });
    setDeviceName("");
    setLocation("");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Cadastrar Sensor</h2>

      <div className="mb-4">
        <label htmlFor="deviceName" className="block text-sm font-medium text-gray-700">Nome do Sensor</label>
        <input
          type="number"
          id="deviceName"
          placeholder="Número de serie do sensor"
          value={deviceName}
          onChange={(e) => setDeviceName(e.target.value)}
          className="w-full px-4 py-3 mt-2 bg-gray-100 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">Localização</label>
        <input
          type="text"
          id="location"
          placeholder="Localização"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full px-4 py-3 mt-2 bg-gray-100 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        className="w-full px-4 py-3 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
      >
        Cadastrar
      </button>
    </form>
  );
}

export default SensorForm;
