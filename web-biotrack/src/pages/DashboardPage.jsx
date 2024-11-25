import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import SensorForm from "../components/SensorForm";
import SensorList from "../components/SensorList";
import {
  Button,
  Card,
  Typography,
  IconButton,
  Drawer,
} from "@material-tailwind/react";
import { AiOutlineMenu } from "react-icons/ai";
import UpdateUser from "../components/updateUser";

function DashboardPage() {
  const { user, SignOut } = useContext(AuthContext);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Menu Lateral */}
      <div className="hidden h-screen fixed md:flex md:w-64 bg-blue-gray-800 text-white flex-col p-4">
        <Typography variant="h5" color="white" className="mb-6">
          MENU BIOTRACK
        </Typography>
        <nav className="space-y-4">
          <Typography
            as="button"
            onClick={() => setActiveSection("dashboard")}
            className={`block text-lg ${
              activeSection === "dashboard" ? "font-bold text-blue-400" : ""
            }`}
          >
            Dashboard
          </Typography>
          <Typography
            as="button"
            onClick={() => setActiveSection("sensors")}
            className={`block text-lg ${
              activeSection === "sensors" ? "font-bold text-blue-400" : ""
            }`}
          >
            Sensores
          </Typography>
          <Typography
            as="button"
            onClick={() => setActiveSection("perfil")}
            className={`block text-lg ${
              activeSection === "perfil" ? "font-bold text-blue-400" : ""
            }`}
          >
            Perfil de Usuario
          </Typography>
          <Button onClick={SignOut} color="red" className="mt-4 w-full">
            Sair
          </Button>
        </nav>
      </div>

      {/* Drawer para Mobile */}
      <Drawer
        open={isDrawerOpen}
        onClose={toggleDrawer}
        className="bg-blue-gray-800 text-white md:hidden"
      >
        <div className="p-4">
          <Typography variant="h3" color="white" className="mb-4">
            MENU BIOTRACK
          </Typography>
          <nav className="space-y-10 pt-10  ">
            <Typography
              as="button"
              onClick={() => {
                setActiveSection("dashboard");
                toggleDrawer();
              }}
              className={`block text-2xl ${
                activeSection === "dashboard" ? "font-bold text-blue-400" : ""
              }`}
            >
              Dashboard
            </Typography>
            <Typography
              as="button"
              onClick={() => {
                setActiveSection("sensors");
                toggleDrawer();
              }}
              className={`block text-2xl ${
                activeSection === "sensors" ? "font-bold text-blue-400" : ""
              }`}
            >
              Sensores
            </Typography>
            <Typography
              as="button"
              onClick={() => {
                setActiveSection("perfil");
                toggleDrawer();
              }}
              className={`block text-2xl pb-10${
                activeSection === "perfil" ? "font-bold text-blue-400" : ""
              }`}
            >
              Perfil de Usuario
            </Typography>
            <Button
              onClick={SignOut}
              color="red"
              className="mt-4 w-full  bottom-5"
            >
              Sair
            </Button>
          </nav>
        </div>
      </Drawer>

      {/* Conteúdo Principal */}
      <div className="md:ml-40 flex-1 flex flex-col items-center p-6 w-full">
        {/* Cabeçalho (Mobile) */}
        <div className="w-full flex items-center justify-between md:hidden mb-4   ">
          <Typography variant="h5" color="blue-gray" className="font-semibold ">
            Bem-vindo, {user?.name.split(" ")[0]} {user?.name.split(" ")[1]}
          </Typography>
          <IconButton
            onClick={toggleDrawer}
            className="bg-transparent m-4 p-1 "
          >
            <AiOutlineMenu
              size={40}
              onClick={toggleDrawer}
              className="text-blue-gray-900 "
            />
          </IconButton>
        </div>

        {/* Cabeçalho (Desktop) */}
        <div className="w-full max-w-4xl p-6 border-b-2 border-blue-gray-100   mb-8 hidden md:block">
          <Typography variant="h4" color="blue-gray" className="font-semibold">
            Bem-vindo, {user?.name}
          </Typography>
        </div>

        {/* Seção Ativa */}
        {activeSection === "dashboard" && (
          <Card className="w-full max-w-4xl p-6 shadow-lg rounded-lg bg-white">
            <Typography
              variant="h4"
              color="blue-gray"
              className="font-semibold mb-6"
            >
              Bem-vindo ao Dashboard
            </Typography>

            {/* Introdução com destaque */}
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <Typography
                variant="h6"
                color="blue"
                className="font-semibold flex items-center mb-2"
              >
                <span className="mr-2">🌟</span> Importância da Qualidade do Ar
              </Typography>
              <Typography variant="body1" color="gray">
                A fumaça contém partículas sólidas e gases que podem causar
                sérios riscos à saúde, como irritação nos olhos, dificuldade
                respiratória, e problemas crônicos. Monitorar a qualidade do ar
                é essencial para um ambiente seguro.
              </Typography>
            </div>

            {/* Benefícios dos Sensores */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <Typography
                variant="h6"
                color="blue-gray"
                className="font-semibold flex items-center mb-4"
              >
                <span className="mr-2">📊</span> Como os Sensores Podem Ajudar
              </Typography>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  <strong>Alertar:</strong> Identificam mudanças perigosas na
                  qualidade do ar.
                </li>
                <li>
                  <strong>Prevenir Incêndios:</strong> Detectam fumaça
                  rapidamente.
                </li>
                <li>
                  <strong>Monitoramento:</strong> Avaliam ambientes em tempo
                  real.
                </li>
                <li>
                  <strong>Dados Estratégicos:</strong> Auxiliam em análises de
                  segurança ambiental.
                </li>
              </ul>
            </div>

            {/* Guia de Cadastro */}
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <Typography
                variant="h6"
                color="blue-gray"
                className="font-semibold flex items-center mb-4"
              >
                <span className="mr-2">🛠️</span> Como Cadastrar Sensores
                BIOTRACK
              </Typography>
              <ol className="list-decimal list-inside space-y-2">
                <li>
                  Acesse a aba <strong>Sensores</strong> no menu lateral.
                </li>
                <li>
                  Preencha os campos obrigatórios, como número de serie e
                  localização.
                </li>
                <li>
                  Existem 5 sensores em exercicio agora o
                  `001`,`002`,`003`,`004` ,`005`
                </li>
                <li>
                  Confirme os dados clicando em <strong>Cadastrar</strong>.
                </li>
                <li>
                  Veja os sensores cadastrados na lista de sensores ativos.
                </li>
              </ol>
            </div>

            {/* Call to Action */}
            <div className="flex justify-center mt-6">
              <Button
                color="blue"
                size="lg"
                ripple="light"
                onClick={() => setActiveSection("sensors")}
              >
                Acesse a Aba de Sensores
              </Button>
            </div>
          </Card>
        )}

        {activeSection === "sensors" && (
          <>
            <div className="w-full p-6 rounded-lg mb-8">
              <SensorForm />
            </div>

            <div className="w-full max-w-5xl p-6  rounded-lg mb-10 flex justify-center items-center flex-col">
              <SensorList />
            </div>
          </>
        )}

        {activeSection === "perfil" && (
           <div className="w-full p-6 rounded-lg mb-8">
           <UpdateUser userId={user?._id} />
         </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
