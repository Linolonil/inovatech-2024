import api from "./api";

export const register = async ({name, email, senha}) => { 

const response = await api.post("/api/usuarios", {
        name,
        email,
        senha,
    });

return response;
};

export const login = async ({email, senha}) => {
const response = await api.post("api/login", {
      email, senha
    });
    
return response
};

export const validateTokenUser = async (token) => {
  try {
    const response = await api.post(
      `/api/v1/auth/validate-token`,
      {}, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return { valid: false, message: "Token expirado ou inválido." };
    }
    return { valid: false, message: "Erro ao validar o token." };
  }
};

  