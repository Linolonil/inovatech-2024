import { useContext, useRef } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import bg from "../../src/assets/bg/bg-login2.webp";
import { Button } from "@material-tailwind/react";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const { SignIn, signed, loading } = useContext(AuthContext);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    const data = {
      email: emailRef.current.value,
      senha: passwordRef.current.value,
    };
    await SignIn(data);
  };

  const handleRegisterRedirect = () => {
    navigate("/register"); // Redireciona para a página de cadastro
  };

  if (signed) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url("${bg}")` }}
    >
      <div className="flex flex-col md:flex-row items-center justify-center bg-black bg-opacity-70 p-10 rounded-lg shadow-lg max-w-5xl w-full">
        {/* Left Section: Welcome Message */}
        <div className="hidden h-[26.5rem] md:flex flex-col items-start justify-center w-full md:w-1/2 p-8 text-white space-y-6 relative">
          <div className="p-3">
            <h1 className="text-4xl font-bold">Bem-vindo ao BIOTRACK</h1>
            <p className="text-gray-300 mt-10">
              Gerencie e visualize os seus sensores de forma prática e
              eficiente.
            </p>
          </div>
        </div>
        {/* Right Section: Login Form */}
        <div className="flex flex-col w-full md:w-1/2 p-8 text-white space-y-6 bg-gray-800 bg-opacity-80 rounded-lg">
          <h1 className="text-3xl text-center font-bold">Login</h1>
          <form onSubmit={handleSignIn} className="space-y-4 pb-5">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-300"
              >
                Email de acesso
              </label>
              <input
                ref={emailRef}
                type="email"
                id="email"
                required
                autoComplete="email"
                placeholder="Digite seu email"
                className="w-full px-4 py-3 mt-1 bg-gray-700 text-white rounded focus:outline-none focus:ring focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="senha"
                className="block text-sm font-medium text-gray-300"
              >
                Senha
              </label>
              <input
                ref={passwordRef}
                type="password"
                id="senha"
                autoComplete="current-password"
                required
                placeholder="Digite sua senha"
                className="w-full px-4 py-3 mt-1 bg-gray-700 text-white rounded focus:outline-none focus:ring focus:ring-blue-500"
              />
            </div>

            <Button
              loading={loading}
              type="submit"
              className="w-full px-4 py-3 font-semibold text-white flex justify-center items-center text-center bg-light-blue-700 rounded-lg hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200"
            >
              Entrar
            </Button>
          </form>
          <div className="text-center">
            <button
              onClick={handleRegisterRedirect}
              className="w-full py-2 font-medium text-white rounded hover:border-b-white focus:outline-none focus:ring focus:ring-blue-400 transition"
            >
              <span className="text-sm">Cadastre-se</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
