import mongoose from 'mongoose';

// Esquema simples para sensores fabricados
const FabricatedSensorSchema = new mongoose.Schema({
  deviceName: {
    type: String,
    required: true,
    unique: true, 
  },
});

export default mongoose.model('FabricatedSensor', FabricatedSensorSchema);
