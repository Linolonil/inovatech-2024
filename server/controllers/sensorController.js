import Sensor from "../models/Sensor.js";
import Usuario from "../models/Usuario.js";
import FabricatedSensor from "../models/FabricatedSensor.js"; // Modelo para a tabela de sensores fabricados

export const criarSensor = async (req, res) => {
  try {
    const { userId, deviceName, location } = req.body;

    // Verificar se o sensor existe na tabela de sensores fabricados
    const sensorFabricado = await FabricatedSensor.findOne({ deviceName });
    if (!sensorFabricado) {
      return res.status(400).json({
        status: "error",
        message: "Sensor não encontrado no banco de PRODUÇÂO.",
      });
    }

    // Verificar se o usuário existe
    const usuario = await Usuario.findById(userId);
    if (!usuario) {
      return res.status(404).json({ status: "error", message: "Usuário não encontrado" });
    }

    // Verificar se o sensor já está associado a este usuário
    const sensorExistente = await Sensor.findOne({ userId, deviceName });
    if (sensorExistente) {
      return res.status(400).json({ status: "error", message: "Sensor já associado a este usuário." });
    }

    // Criar um novo sensor
    const novoSensor = new Sensor({ userId, deviceName, location });
    await novoSensor.save();

    // Associar o sensor ao usuário
    usuario.sensores.push(novoSensor);
    await usuario.save();

    res.json({
      status: "success",
      message: "Sensor associado com sucesso",
      sensor: novoSensor,
    });
  } catch (error) {
    console.error("Erro ao associar sensor:", error);
    res.status(500).json({ status: "error", message: "Erro ao associar sensor." });
  }
};


export const consultarSensor = async (req, res) => {
  try {
    const { sensorId } = req.params;
    const sensor = await Sensor.findById(sensorId);
    if (!sensor) {
      return res.status(404).json({ status: "error", message: "Sensor não encontrado" });
    }

    res.json({
      status: "success",
      sensor,
    });
  } catch (error) {
    console.error("Erro ao consultar sensor:", error);
    res.status(500).json({ status: "error", message: "Erro ao consultar sensor." });
  }
};

export const removerSensor = async (req, res) => {
  try {
    const { userId, sensorId } = req.params;

    // Verificar se o usuário existe
    const usuario = await Usuario.findById(userId);
    if (!usuario) {
      return res.status(404).json({ status: "error", message: "Usuário não encontrado" });
    }

    // Verificar se o sensor existe e está associado ao usuário
    const sensor = await Sensor.findById(sensorId);
    if (!sensor) {
      return res.status(404).json({ status: "error", message: "Sensor não encontrado" });
    }

    // Verificar se o sensor está associado ao usuário
    if (!usuario.sensores.includes(sensorId)) {
      return res.status(400).json({ status: "error", message: "Sensor não está associado a este usuário" });
    }

    // Remover o sensor do array de sensores do usuário
    usuario.sensores = usuario.sensores.filter(sensor => sensor.toString() !== sensorId);
    await usuario.save();

    // Excluir o sensor do banco de dados
    await Sensor.findByIdAndDelete(sensorId);

    res.json({
      status: "success",
      message: "Sensor removido e excluído com sucesso",
    });
  } catch (error) {
    console.error("Erro ao remover sensor:", error);
    res.status(500).json({ status: "error", message: "Erro ao remover sensor." });
  }
};

export const atualizaSensor = async (req, res) => {
  try {
    const { sensorId } = req.params;
    const { location } = req.body;  

    // Verificar se o sensor existe 
    const sensor = await Sensor.findById(sensorId);
    if (!sensor) {
      return res.status(404).json({ status: "error", message: "Sensor não encontrado" });
    }

    // Atualizar o 'location' do sensor
    sensor.location = location;

    // Salvar as alterações no banco de dados
    await sensor.save();

    res.json({
      status: "success",
      message: "Localização do sensor atualizada com sucesso",
      sensor,  // Retornar o sensor atualizado
    });
  } catch (error) {
    console.error("Erro ao atualizar sensor:", error);
    res.status(500).json({ status: "error", message: "Erro ao atualizar sensor." });
  }
};
