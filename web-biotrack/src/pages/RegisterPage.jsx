import { useContext, useRef } from "react";
import bg from "../../src/assets/bg/bg-login2.webp";
import { useNavigate } from "react-router-dom";
import { Button } from "@material-tailwind/react";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
  const { CreateUser } = useContext(AuthContext);
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const data = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      senha: passwordRef.current.value,
    };

    const response = await CreateUser(data);
    if (response) {
      navigate("/login"); 
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login"); 
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url("${bg}")` }}
    >
      <div className="flex flex-col items-center justify-center bg-black bg-opacity-70 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl text-white font-bold mb-4">Cadastre-se</h1>
        <form onSubmit={handleRegister} className="w-full space-y-3">
          <div>
            <label
              htmlFor="name"
              className="block text-xs font-medium text-gray-300"
            >
              Nome
            </label>
            <input
              ref={nameRef}
              type="text"
              id="name"
              required
              placeholder="Digite seu nome"
              className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-medium text-gray-300"
            >
              Email
            </label>
            <input
              ref={emailRef}
              type="email"
              id="email"
              required
              placeholder="Digite seu email"
              className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-medium text-gray-300"
            >
              Senha
            </label>
            <input
              ref={passwordRef}
              type="password"
              id="password"
              required
              placeholder="Digite sua senha"
              className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
          <Button
            type="submit"
            className="w-full py-2 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
          >
            Registrar
          </Button>
        </form>
        <button
              onClick={handleLoginRedirect}
              className="w-full py-2 font-medium text-white rounded hover:border-b-white focus:outline-none focus:ring focus:ring-blue-400 transition"
            >
              <span className="text-sm">Já possui uma conta? faça o login</span>
            </button>
      </div>
    </div>
  );
};

export default Register;
