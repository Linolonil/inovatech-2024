import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  sensores: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sensor' }],
});

const Usuario = mongoose.model('Usuario', usuarioSchema);
export default Usuario;
