import Usuario from "../models/Usuario.js";
import Sensor from "../models/Sensor.js";
import argon2 from "argon2"; 

export const criarUsuario = async (req, res) => {
  try {
    const { name, email, senha } = req.body;
        // Verificar se o e-mail já existe
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ status: "error", message: "E-mail já cadastrado." });
    }

    // Criptografar a senha usando argon2
    const senhaCriptografada = await argon2.hash(senha);

    // Criar o novo usuário com a senha criptografada
    const novoUsuario = new Usuario({ name, email, senha: senhaCriptografada });
    await novoUsuario.save();

    res.json({
      status: "success",
      message: "Usuário criado com sucesso",
      usuario: novoUsuario,
    });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    res.status(500).json({ status: "error", message: "Erro ao criar usuário." });
  }
};

export const consultarSensoresUsuario = async (req, res) => {
  try {
    const { userId } = req.params;
    const usuario = await Usuario.findById(userId).populate("sensores");
    if (!usuario) {
      return res.status(404).json({ status: "error", message: "Usuário não encontrado" });
    }

    res.json({
      status: "success",
      sensores: usuario.sensores,
    });
  } catch (error) {
    console.error("Erro ao consultar sensores:", error);
    res.status(500).json({ status: "error", message: "Erro ao consultar sensores." });
  }
};

export const atualizarUsuario = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, senha, confirmacaoSenha } = req.body;

    // Verificar se o usuário existe
    const usuario = await Usuario.findById(userId);
    if (!usuario) {
      return res.status(404).json({ status: "error", message: "Usuário não encontrado." });
    }

    // Verificar se o e-mail já está em uso por outro usuário
    if (email && email !== usuario.email) {
      const usuarioComEmail = await Usuario.findOne({ email });
      if (usuarioComEmail) {
        return res.status(400).json({
          status: "error",
          message: "Este e-mail está indisponível. Por favor, escolha outro.",
        });
      }
    }

    // Verificar se as senhas coincidem
    if (senha && senha !== confirmacaoSenha) {
      return res.status(400).json({
        status: "error",
        message: "As senhas não coincidem. Tente novamente.",
      });
    }

    // Atualizar os campos fornecidos
    if (name) usuario.name = name;
    if (email) usuario.email = email;
    if (senha) {
      // Criptografar nova senha se fornecida
      usuario.senha = await argon2.hash(senha);
    }

    await usuario.save();

    res.json({
      status: "success",
      message: "Usuário atualizado com sucesso.",
      usuario,
    });
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    res.status(500).json({ status: "error", message: "Erro ao atualizar usuário." });
  }
};

export const deletarUsuario = async (req, res) => {
  try {
    const { userId } = req.params;

    // Verificar se o usuário existe
    const usuario = await Usuario.findById(userId).populate("sensores");
    if (!usuario) {
      return res.status(404).json({ status: "error", message: "Usuário não encontrado." });
    }

    // Deletar os sensores associados a este usuário se não houver outros usuários associados
    for (let i = 0; i < usuario.sensores.length; i++) {
      const sensor = usuario.sensores[i];

      // Verificar se o sensor tem outros usuários associados
      const outrosUsuarios = await Usuario.find({ sensores: sensor._id });
      if (outrosUsuarios.length === 1) {
        // Excluir o sensor se ele estiver associado somente a este usuário
        await Sensor.findByIdAndDelete(sensor._id);
        console.log(`Sensor ${sensor._id} excluído.`);
      }
    }

    // Deletar o usuário
    await Usuario.findByIdAndDelete(userId);

    res.json({
      status: "success",
      message: "Usuário e sensores excluídos com sucesso (se não vinculados a outros usuários).",
    });
  } catch (error) {
    console.error("Erro ao excluir usuário:", error);
    res.status(500).json({ status: "error", message: "Erro ao excluir usuário." });
  }
};