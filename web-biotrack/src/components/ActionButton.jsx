import { Menu, MenuHandler, MenuList, MenuItem, Button } from "@material-tailwind/react";
import { MdEdit, MdDelete, MdVisibility, MdVisibilityOff } from "react-icons/md";

const ActionButton = ({ sensorData, handleEdit, handleRemoveSensor, handleShowRealTimeData, realTimeData }) => {
  return (
    <Menu>
      <MenuHandler>
        <Button color="blue-gray" size="sm" className="flex items-center">
          Ações
        </Button>
      </MenuHandler>
      <MenuList>
        <MenuItem
          onClick={() => handleEdit(sensorData)}
          className="flex items-center space-x-2"
        >
          <MdEdit className="text-blue-500" />
          <span>Editar</span>
        </MenuItem>
        <MenuItem
          onClick={() => handleRemoveSensor(sensorData)}
          className="flex items-center space-x-2"
        >
          <MdDelete className="text-red-500" />
          <span>Excluir</span>
        </MenuItem>
        <MenuItem
          onClick={() => handleShowRealTimeData(sensorData)}
          className="flex items-center space-x-2"
        >
          {realTimeData ? (
            <>
              <MdVisibilityOff className="text-indigo-500" />
              <span>Ocultar Dados</span>
            </>
          ) : (
            <>
              <MdVisibility className="text-indigo-500" />
              <span>Mostrar Dados</span>
            </>
          )}
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default ActionButton;
