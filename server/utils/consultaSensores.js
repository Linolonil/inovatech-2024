import Usuario from './../models/Usuario.js';
 
export const consultarSensores = async (userId) => {
    try {
      const usuario = await Usuario.findById(userId).populate("sensores");
      
      if (!usuario) {
        return { status: "error", message: "Usuário não encontrado" };
      }
  
      return { status: "success", sensores: usuario.sensores };
    } catch (error) {
      console.error("Erro ao consultar sensores:", error);
      return { status: "error", message: "Erro ao consultar sensores." };
    }
  };
  