import { useState, useContext, useEffect } from "react";
import { Card, Typography } from "@material-tailwind/react";
import { SensorContext } from "../context/SensorContext.jsx";
import RealTimeSensorData from "./RealTimeSensorData.jsx"; // Componente para dados em tempo real
import Modal from "./Modal"; // Componente de modal para exibir dados em tempo real
import { AuthContext } from "../context/AuthContext.jsx";
import ActionButton from "./ActionButton.jsx";

const TABLE_HEAD = ["Nome", "Localização", ""];

export default function SensorTable() {
  const [showModal, setShowModal] = useState(false);
  const [selectedSensor, setSelectedSensor] = useState(null);
  const { sensor, getSensor, updateSensor, deleteSensor } =
    useContext(SensorContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user?._id) {
      getSensor(user._id);
    }
  }, [user, getSensor]);

  const handleEdit = (sensor) => {
    // Lógica para editar sensor (como abrir um campo de edição)
    const newLocation = prompt("Enter new location:", sensor.location);
    if (newLocation) {
      updateSensor({
        sensorId: sensor._id,
        location: newLocation,
        sensorName: sensor.deviceName,
      });
    }
  };

  const handleRemoveSensor = (sensor) => {
    deleteSensor({ userId: sensor.userId, sensorId: sensor._id });
  };

  const handleShowRealTimeData = (sensor) => {
    setSelectedSensor(sensor);
    setShowModal(true);
  };

  return (
    <>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Sensores cadastrados
      </h2>
      <Card className="h-full w-full max-w-4xl overflow-x-auto">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="border-b border-blue-gray-100 bg-blue-gray-50 p-4 text-sm md:text-base"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sensor && sensor.length > 0 ? (
              sensor.map((sensorData) => {
                const { deviceName, location, _id } = sensorData;
                const classes = "p-4 border-b border-blue-gray-50 ";
                {
                  sensor;
                }
                return (
                  <tr key={_id}>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {deviceName}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {location}
                      </Typography>
                    </td>
                 
                    <td className={classes}>
                      <ActionButton
                        sensorData={sensorData}
                        handleEdit={handleEdit}
                        handleRemoveSensor={handleRemoveSensor}
                        handleShowRealTimeData={handleShowRealTimeData}
                        realTimeData={sensorData.realTimeData}
                      />
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4" className="text-center p-4">
                  <Typography variant="small" color="gray">
                    Nenhum sensor cadastrado
                  </Typography>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Modal to show real-time data */}
        {showModal && selectedSensor && (
          <Modal onClose={() => setShowModal(false)}>
            <RealTimeSensorData sensor={selectedSensor} />
          </Modal>
        )}
      </Card>
    </>
  );
}
