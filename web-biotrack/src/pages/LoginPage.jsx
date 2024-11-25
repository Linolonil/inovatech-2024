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
    navigate("/register");
  };

  if (signed) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url("${bg}")` }}
    >
      <div className="flex flex-col md:flex-row items-center justify-center bg-black bg-opacity-80 p-10 rounded-lg shadow-2xl max-w-5xl w-full">
        {/* Left Section: Welcome Message */}
        <div className="hidden md:flex flex-col items-start justify-center w-full md:w-1/2 p-8 text-white space-y-6">
          <h1 className="text-5xl font-extrabold tracking-wide text-light-blue-400">
            BIOTRACK
          </h1>
          <p className="text-lg text-gray-300 mt-4 leading-relaxed">
            Gerencie e visualize seus sensores de forma prática, eficiente e
            segura. Uma plataforma pensada para você, onde a tecnologia e
            simplicidade se encontram.
          </p>
        </div>

        {/* Right Section: Login Form */}
        <div className="flex flex-col w-full md:w-1/2 p-8 bg-gray-900 bg-opacity-90 rounded-lg space-y-6">
          {/* Nome BIOTRACK no modo responsivo */}
          <h1 className="md:hidden text-5xl text-center font-extrabold text-light-blue-400">
            BIOTRACK
          </h1>

          <h2 className="text-3xl text-center font-extrabold text-white">
            Acesse sua conta
          </h2>
          <form onSubmit={handleSignIn} className="space-y-5">
            <div>
              <label
                htmlFor="email"
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
                className="w-full px-4 py-3 mt-1 bg-gray-800 text-white rounded focus:outline-none focus:ring focus:ring-light-blue-500"
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
                className="w-full px-4 py-3 mt-1 bg-gray-800 text-white rounded focus:outline-none focus:ring focus:ring-light-blue-500"
              />
            </div>

            <Button
              disabled={loading}
              type="submit"
              className={`w-full px-4 py-3 text-white font-bold text-center bg-light-blue-600 rounded-lg hover:bg-light-blue-700 focus:outline-none focus:ring-2 focus:ring-light-blue-500 focus:ring-offset-2 transition duration-200 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <div className="text-center">
            <button
              onClick={handleRegisterRedirect}
              className="w-full py-2 font-medium text-light-blue-500 hover:underline focus:outline-none focus:ring focus:ring-light-blue-400 transition"
            >
              <span className="text-sm">Não tem uma conta? Cadastre-se</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
