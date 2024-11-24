import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

function ProfilePage() {
  const { user } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Atualizar perfil (backend)
    alert("Perfil atualizado!");
  };

  return (
    <div>
      <h1>Editar Perfil</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">Salvar</button>
      </form>
    </div>
  );
}

export default ProfilePage;
