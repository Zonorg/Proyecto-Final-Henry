import "./manageUsers.scss";
import { Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getAllUsers } from "../../../redux/actions/actions";
import { toast } from "react-toastify";
import axios from "axios";
// import dotenv from "dotenv";
// dotenv.config();

const ManageUsers = () => {
  const API_URL = "user/";

  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);

  //Para mostrar los modales
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [showUnbanModal, setShowUnbanModal] = useState(false);
  const [showAdmModal, setShowAdmModal] = useState(false);
  const [showUnAdmModal, setShowUnAdmModal] = useState(false);

  //Seleccionar usuario y modificarlo
  const [selectedUser, setSelectedUser] = useState(null);

  //Buscar usuarios
  const [searchTerm, setSearchTerm] = useState("");
  const [showDisabledUsers, setShowDisabledUsers] = useState(false);
  const [showAdminUsers, setShowAdminUsers] = useState(false);

  //Abrir los modales
  const handleModalOpen = (user, modalType) => {
    setSelectedUser(user);
    switch (modalType) {
      case "delete":
        setShowDeleteModal(true);
        break;
      case "ban":
        setShowBanModal(true);
        break;
      case "unban":
        setShowUnbanModal(true);
        break;
      case "adm":
        setShowAdmModal(true);
        break;
      case "unadm":
        setShowUnAdmModal(true);
        break;
      default:
        break;
    }
  };

  //Cerrar los modales
  const handleModalClose = () => {
    setShowDeleteModal(false);
    setShowBanModal(false);
    setShowUnbanModal(false);
    setShowAdmModal(false);
    setShowUnAdmModal(false);
    setSelectedUser(null);
  };

  //Abrir detalles de un usuario
  const [showDetailsForUserId, setShowDetailsForUserId] = useState(null);

  const handleShowDetails = (userId) => {
    setShowDetailsForUserId(userId);
  };

  const handleHideDetails = () => {
    setShowDetailsForUserId(null);
  };

  //Buscar usuarios
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  //Borrar todos los filtros
  const handleClearSearch = () => {
    setSearchTerm("");
    setShowDisabledUsers(false);
    setShowAdminUsers(false);
  };

  //Mostrar usuarios baneados
  const handleShowDisabledUsers = (event) => {
    setShowDisabledUsers(event.target.checked);
  };

  //Mostrar usuarios administradores
  const handleShowAdminUsers = (event) => {
    setShowAdminUsers(event.target.checked);
  };

  //Filtrar usuarios
  const filteredUsers = users
    .filter(
      (user) =>
        (user.name + " " + user.lastName)
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id.toString().includes(searchTerm)
    )
    .filter((user) => (showDisabledUsers ? user.disabled : true))
    .filter((user) => (showAdminUsers ? user.admin : true));

  //Ordenar los filtros
  const sortedUsers = filteredUsers.sort((a, b) => a.id - b.id);
  //Peticiones a la API
  const showAllUsers = async () => {
    try {
      const response = await dispatch(getAllUsers());
      const users = response.payload;
      setUsers(users);
    } catch (error) {
      console.error("Error obteniendo usuarios:", error);
    }
  };

  const deleteUser = async (email) => {
    try {
      if (email === "auxiliarparaproyectos@gmail.com") {
        toast.error("No se puede eliminar este usuario");
      } else {
        await axios.delete(API_URL + "del", {
          data: { email },
        });
        showAllUsers();
        toast.warning("Usuario eliminado con éxito");
      }
    } catch (error) {
      console.error("Error eliminando usuario:", error);
      toast.error("Error eliminando usuario");
    }
  };

  const banUser = async (id) => {
    try {
      if (id === 1) {
        toast.error("No se puede deshabilitar este usuario");
      } else {
        await axios.put(API_URL + `ban/${id}`);
        removeAdmin(selectedUser.email);
        showAllUsers();
        toast.warning("Usuario deshabilitado");
      }
    } catch (error) {
      console.error("Error baneando usuario:", error);
      toast.error("Error deshabilitando usuario");
    }
  };

  const unBanUser = async (id) => {
    try {
      await axios.put(API_URL + `unban/${id}`);
      showAllUsers();
      toast.success("Usuario habilitado");
    } catch (error) {
      console.error(error);
      toast.error("Error habilitando usuario");
    }
  };

  const makeAdmin = async (email) => {
    try {
      if (selectedUser.disabled) {
        toast.error("No se puede dar permisos a un usuario deshabilitado");
      } else {
        await axios.put(API_URL + "setadmin", { email });
        showAllUsers();
        toast.success("Permisos concedidos");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const removeAdmin = async (email) => {
    try {
      if (email === "auxiliarparaproyectos@gmail.com") {
        toast.error(
          "No se puede quitar permisos de administrador a este usuario"
        );
      } else {
        await axios.put(API_URL + "removeadmin", { email });
        showAllUsers();
        toast.warning("Permisos revocados");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    showAllUsers();
  }, []);

  return (
    <div className="manage-users">
      <h2> Usuarios</h2>
      <div className="filter-users">
        <label htmlFor="showDisabledUsers">Ban:</label>
        <input
          type="checkbox"
          id="showDisabledUsers"
          onChange={handleShowDisabledUsers}
          checked={showDisabledUsers}
        />
        <label htmlFor="showAdminUsers">Admin:</label>
        <input
          type="checkbox"
          id="showAdminUsers"
          onChange={handleShowAdminUsers}
          checked={showAdminUsers}
        />
      </div>
      <div className="search-users">
        <input
          type="text"
          placeholder="Buscar usuarios"
          onChange={handleSearch}
          value={searchTerm}
        />
        <button onClick={handleClearSearch}>Borrar</button>
      </div>
      <ul>
        {sortedUsers.map((user) => (
          <li key={user.id} className="user-card">
            <div className="user-data">
              <span>Nombre</span>
              <p>{user.name}</p>
              <hr />
              <span>Apellido</span>
              <p>{user.lastName}</p>
              <hr />
              {showDetailsForUserId === user.id && (
                <>
                  <span>ID</span>
                  <p>{user.id}</p>
                  <hr />
                  <span>Email</span>
                  <p>{user.email}</p>
                  <hr />
                  <span>Nombre de usuario</span>
                  <p>{user.userName}</p>
                  <hr />
                  <span>Admin</span>
                  <p>{user.admin ? "Si" : "No"}</p>
                  <hr />
                  <span>Deshabilitado</span>
                  <p>{user.disabled ? "Si" : "No"}</p>
                  <hr />
                  <button onClick={handleHideDetails}>Ver menos</button>
                </>
              )}

              {showDetailsForUserId !== user.id && (
                <button onClick={() => handleShowDetails(user.id)}>
                  Ver más
                </button>
              )}
            </div>
            {/* Botones para abrir modales */}
            <div className="button-section">
              <button onClick={() => handleModalOpen(user, "delete")}>
                Eliminar
              </button>
              {user.disabled ? (
                <button onClick={() => handleModalOpen(user, "unban")}>
                  Habilitar
                </button>
              ) : (
                <button onClick={() => handleModalOpen(user, "ban")}>
                  Deshabilitar
                </button>
              )}

              {user.admin ? (
                <button onClick={() => handleModalOpen(user, "unadm")}>
                  Quitar Admin
                </button>
              ) : (
                <button onClick={() => handleModalOpen(user, "adm")}>
                  Hacer Admin
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>

      {/* Modales */}
      <Modal onRequestClose={handleModalClose} show={showDeleteModal} size="sm">
        <p style={{ margin: "20px" }}>
          ¿Estás seguro que deseas eliminar al usuario{" "}
          {selectedUser && selectedUser.userName}?
        </p>
        <div className="confirm-options">
          <button
            onClick={() => {
              deleteUser(selectedUser.email);
              handleModalClose();
            }}
            className="delete-button"
          >
            Eliminar
          </button>
          <button onClick={handleModalClose}>Cancelar</button>
        </div>
      </Modal>

      <Modal onRequestClose={handleModalClose} show={showBanModal} size="sm">
        <p style={{ margin: "20px" }}>
          ¿Estás seguro que deseas deshabilitar al usuario{" "}
          {selectedUser && selectedUser.userName}?
        </p>
        <div className="confirm-options">
          <button
            onClick={() => {
              banUser(selectedUser.id);
              handleModalClose();
            }}
            className="delete-button"
          >
            Deshabilitar
          </button>
          <button onClick={handleModalClose}>Cancelar</button>
        </div>
      </Modal>

      <Modal onRequestClose={handleModalClose} show={showUnbanModal} size="sm">
        <p style={{ margin: "20px" }}>
          ¿Estás seguro que deseas habilitar al usuario{" "}
          {selectedUser && selectedUser.userName}?
        </p>
        <div className="confirm-options">
          <button
            onClick={() => {
              unBanUser(selectedUser.id);
              handleModalClose();
            }}
            className="delete-button"
          >
            Habilitar
          </button>
          <button onClick={handleModalClose}>Cancelar</button>
        </div>
      </Modal>

      <Modal onRequestClose={handleModalClose} show={showAdmModal} size="sm">
        <p style={{ margin: "20px" }}>
          ¿Hacer Admin al usuario {selectedUser && selectedUser.userName}?
        </p>
        <div className="confirm-options">
          <button
            onClick={() => {
              makeAdmin(selectedUser.email);
              handleModalClose();
            }}
            className="delete-button"
          >
            Actualizar
          </button>
          <button onClick={handleModalClose}>Cancelar</button>
        </div>
      </Modal>

      <Modal onRequestClose={handleModalClose} show={showUnAdmModal} size="sm">
        <p style={{ margin: "20px" }}>
          ¿Quitar Admin al usuario {selectedUser && selectedUser.userName}?
        </p>
        <div className="confirm-options">
          <button
            onClick={() => {
              removeAdmin(selectedUser.email);
              handleModalClose();
            }}
            className="delete-button"
          >
            Actualizar
          </button>
          <button onClick={handleModalClose}>Cancelar</button>
        </div>
      </Modal>
    </div>
  );
};

export default ManageUsers;
