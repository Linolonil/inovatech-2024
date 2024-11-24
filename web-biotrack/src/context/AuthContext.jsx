import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Use useNavigate para redirecionar
import { PropTypes } from "prop-types";
import { toast } from "react-toastify";
import axios from "axios";
import { login, register, validateTokenUser } from "../services/apiAuth";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadingStoreData = async () => {
      const storedUser = localStorage.getItem("@Auth:user");
      const token = localStorage.getItem("@Auth:token");
      const response = await validateTokenUser(token);
      
      if (token && storedUser && response.valid) {
        setUser(JSON.parse(storedUser));
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        navigate("/dashboard");
      }
    };

    loadingStoreData();
  }, [navigate]);

  const SignIn = async ({ email, senha }) => {
    setLoading(true);
    try {
      const response = await login({
        email,
        senha,
      });
      if (response.data.token) {
        localStorage.setItem("@Auth:user", JSON.stringify(response.data.user));
        localStorage.setItem("@Auth:token", response.data.token);
        setUser(response.data.user);
        const userName = response.data.user.name;

        toast.success(`Bem-vindo, ${userName}!`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        navigate("/dashboard"); // Navegação após login com sucesso
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Erro ao realizar login", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const SignOut = () => {
    localStorage.removeItem("@Auth:user");
    localStorage.removeItem("@Auth:token");
    setUser(null);
    toast.success("Logout realizado com sucesso!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    navigate("/login");
  };

  const CreateUser = async ({ name, email, senha }) => {
    try {
      const response = await register({
        name,
        email,
        senha,
      });
      toast.success("Usuário criado com sucesso!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return response.data;
    } catch (error) {
      console.error("Erro na criação do usuário", error);
      toast.error(error.response?.data?.message || "Erro ao criar usuário", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return error.response.data;
    }
  };

  const value = {
    user,
    signed: !!user,
    SignIn,
    SignOut,
    CreateUser,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};