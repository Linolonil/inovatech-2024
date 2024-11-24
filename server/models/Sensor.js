import mongoose from 'mongoose';

const SensorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },
  deviceName: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  dados: {
    type: Number,
    default: 0,
  },
});

// Garantir que o 'deviceName' seja único para cada 'userId'
SensorSchema.index({ userId: 1, deviceName: 1 }, { unique: true });

export default mongoose.model('Sensor', SensorSchema);
