import { useContext, useState, useEffect } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

const UpdateUser = ({ userId, formTitle = "Atualizar Usuário", buttonText = "Atualizar Usuário", successMessageProp }) => {
  const [formData, setFormData] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { SignOut } = useContext(AuthContext);
  const [confirmSenha, setConfirmSenha] = useState("");

  useEffect(() => {
    // Recuperar os dados do usuário do localStorage
    const storedUser = JSON.parse(localStorage.getItem("@Auth:user"));
    if (storedUser) {
      setFormData({
        name: storedUser.name,
        email: storedUser.email,
      });
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleConfirmSenhaChange = (e) => {
    setConfirmSenha(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Verificar se as senhas coincidem
    if (formData.senha && formData.senha !== confirmSenha) {
      setErrorMessage("As senhas não coincidem.");
      setSuccessMessage(""); // Limpa mensagens de sucesso, se houver.
      return;
    }

    try {
      // Enviar dados com 'confirmSenha' se necessário, caso contrário, apenas 'senha'
      const userData = {
        name: formData.name,
        email: formData.email,
        senha: formData.senha,  
        confirmacaoSenha: confirmSenha,
      };

      // Fazer a requisição PUT com os dados atualizados
      const response = await api.put(`/api/usuarios/${userId}`, userData);
      console.log(response);

      if (response.data.status === "error") {
        setErrorMessage(response.data.message);
        setSuccessMessage(""); // Limpa mensagens de sucesso, se houver.
        return;
      }

      setSuccessMessage("Usuário atualizado com sucesso!");
      setErrorMessage(""); // Limpa mensagens de erro, se houver.
      SignOut();
    } catch (err) {
      console.error("Erro ao atualizar usuário:", err);
      setErrorMessage("Falha ao atualizar o usuário.");
      setSuccessMessage(""); // Limpa mensagens de sucesso, se houver.
    }
  };

  return (
    <div className="max-w-full sm:max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">{formTitle}</h2>
      {successMessage && (
        <div className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg" role="alert">
          {successMessage || successMessageProp}
        </div>
      )}
      {errorMessage && (
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
          {errorMessage}
        </div>
      )}
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label htmlFor="name" className="text-sm font-medium text-gray-700">Nome</label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name || ""}
            onChange={handleInputChange}
            placeholder="Digite o nome"
            className="mt-1 px-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email || ""}
            onChange={handleInputChange}
            placeholder="Digite o email"
            className="mt-1 px-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="senha" className="text-sm font-medium text-gray-700">Senha</label>
          <input
            type="password"
            name="senha"
            id="senha"
            value={formData.senha || ""}
            onChange={handleInputChange}
            placeholder="Digite a nova senha"
            className="mt-1 px-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="confirmSenha" className="text-sm font-medium text-gray-700">Confirmação de Senha</label>
          <input
            type="password"
            name="confirmSenha"
            id="confirmSenha"
            value={confirmSenha}
            onChange={handleConfirmSenhaChange}
            placeholder="Confirme a senha"
            className="mt-1 px-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 mt-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
        >
          {buttonText}
        </button>
      </form>
    </div>
  );
};

export default UpdateUser;
