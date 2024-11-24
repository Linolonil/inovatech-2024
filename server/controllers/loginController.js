import argon2 from "argon2";
import Usuario from "../models/Usuario.js";
import jwt from 'jsonwebtoken';

export const loginUsuario = async (req, res) => {
  try {
    const { email, senha } = req.body;

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ status: "error", message: "Usuário não encontrado" });
    }

    // Verificar se a senha informada corresponde ao hash armazenado
    const senhaValida = await argon2.verify(usuario.senha, senha);
    if (!senhaValida) {
      return res.status(400).json({ status: "error", message: "Senha incorreta" });
    }

     // Gerar um token JWT
     const token = jwt.sign({ id: usuario._id, name: usuario.name,  email: usuario.email }, process.env.JWT_SECRET, { expiresIn: '1d' });


     const userObject = usuario.toObject();
     const { senha: _, ...userRes } = userObject;
    // Login bem-sucedido
    res.status(200).json({ user: userRes, token, message:"Login realizado com sucesso"});

  } catch (error) {
    console.error("Erro ao realizar login:", error);
    res.status(500).json({ status: "error", message: "Erro ao realizar login." });
  }
};
