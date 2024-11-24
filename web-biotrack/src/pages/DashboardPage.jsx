import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import SensorForm from './../components/SensorForm';
import SensorList from './../components/SensorList';
import { Button, Card, Typography } from "@material-tailwind/react";

function DashboardPage() {
  const { user, SignOut } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      {/* Cabeçalho */}
      <Card className="w-full max-w-4xl p-6 shadow-lg rounded-lg mb-8">
        <Typography variant="h4" color="blue-gray" className="font-semibold">
          Bem-vindo, {user?.name}
        </Typography>
        <Button
          onClick={SignOut}
          color="red"
          className="mt-4 w-full md:w-auto"
        >
          Sair
        </Button>
      </Card>

      {/* Formulário de Cadastro de Sensor */}
      <Card className="w-full max-w-4xl p-6 shadow-lg rounded-lg mb-8">
        <Typography variant="h5" color="blue-gray" className="font-semibold mb-4">
          Cadastrar Sensor
        </Typography>
        <SensorForm />
      </Card>

      {/* Lista de Sensores */}
      <Card className="w-full max-w-4xl p-6 shadow-lg rounded-lg">
        <Typography variant="h5" color="blue-gray" className="font-semibold mb-4">
          Sensores Ativos
        </Typography>
        <SensorList />
      </Card>
    </div>
  );
}

export default DashboardPage;
