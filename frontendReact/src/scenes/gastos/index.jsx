import React, { useState, useEffect } from 'react';
import { Box, useTheme, IconButton, Alert, Button, Snackbar } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import ConfirmDialog from "../../components/ConfirmDialog";
import AddGastoDialog from "../../components/AddGastoDialog";
import EditGastoDialog from "../../components/EditGastoDialog";
import HandlerTipos from "../../components/HandlerTipos";

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';

const Gastos = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [gastos, setGastos] = useState([]);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tiposOpen, setTiposDialogOpen] = useState(false);
  const [gastoAEliminar, setGastoAEliminar] = useState(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [gastoToEdit, setGastoToEdit] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // Puede ser "success" o "error"

  const openSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };
  
  const closeSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };
  
  const handleDeleteClick = (id) => {
    const gastoAEliminar = gastos.find(gasto => gasto._id === id);
    if (!gastoAEliminar) {
      console.error("Gasto no encontrado");
      return;
    }
    setGastoAEliminar(gastoAEliminar);
    setDialogOpen(true);
  };

  const handleOpenAddDialog = () => {
    setAddDialogOpen(true);
  };

  const handleCloseAddDialog = () => {
    setAddDialogOpen(false);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const openTiposDialog = () => {
    setTiposDialogOpen(true);
  };

  const closeTiposDialog = () => {
    setTiposDialogOpen(false);
  };

  const obtenerGastos= async () => {
    try {
      const respuesta = await fetch("http://localhost:3000/api/gastos/all?limite=15");
      if (!respuesta.ok) {
        throw new Error(`HTTP error! status: ${respuesta.status}`);
      }
      const data = await respuesta.json();
      setGastos(data);
    } catch (error) {
      setError(error.message);
      console.log("Error al obtener gastos:", error);
    }
  };

  const handleEdit = (id) => {
    console.log(id)
    const gasto = gastos.find(p => p._id === id);
    setGastoToEdit(gasto);
    setEditDialogOpen(true);
  };
  
  const handleConfirmDelete = async (id) => {
    setDialogOpen(false);    
    // Realiza la petición de borrado al backend
    try {
      const response = await fetch(`http://localhost:3000/api/gastos/${id}`, {
        method: 'DELETE'
      });
  
      if (!response.ok) {
        throw new Error('Error al eliminar el gasto');
      }
  
      console.log('Gasto eliminado');
      obtenerGastos(); // Actualiza la lista de gastos
      openSnackbar("Se ha eliminado el gasto existosamente.", "success");
    } catch (error) {
      console.error('Error:', error);
      openSnackbar("Falló la eliminación del gasto", "error");
    }
  };

  const handleSaveGasto = async (nuevoGasto) => {
    console.log(nuevoGasto);
    try {
      const response = await fetch('http://localhost:3000/api/gastos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoGasto)
      });

      if (!response.ok) {
        throw new Error('Error al agregar el gasto');
      }

      console.log('Gasto agregado');
      obtenerGastos();
      openSnackbar("Se guardó el gasto exitosamente", "success");

    } catch (error) {
      console.error('Error:', error);
      openSnackbar("Falló el guardado del gasto", "error");
    }
  };

  const handleSaveEditedGasto = async (editedGasto) => {
    try {
      console.log(editedGasto);

      const response = await fetch(`http://localhost:3000/api/gastos/${editedGasto._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedGasto)
      });
  
      if (!response.ok) {
        throw new Error('Error al actualizar el gasto');
      }
  
      console.log('Gasto actualizado');
      obtenerGastos();
      openSnackbar("Gasto actualizado exitosamente", "success");
  
    } catch (error) {
      console.error('Error:', error);
      openSnackbar("Falló la actualización del gasto", "error");
    }
  };
  
  useEffect(() => {
    obtenerGastos();
  }, []);

  const columns = [
    { field: "codigo",
      headerName: "Código",
      flex: 0.5,
      cellClassName: "name-column--cell"
    },
    {
      field: "nombre",
      headerName: "Nombre",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "descripcion",
      headerName: "Descripción",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "tipo_gasto",
      headerName: "Tipo de Gasto",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "valor_gasto",
      headerName: "Valor",
      flex: 1,
    },
    {
      field: "fecha",
      headerName: "Fecha",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: 'acciones',
      headerName: 'Acciones',
      type: 'actions',
      getActions: (params) => [
        <IconButton
          color="secondary"
          aria-label="editar"
          onClick={() => handleEdit(params.id)}
        >
          <EditIcon />
        </IconButton>,
        <IconButton
          color="error"
          aria-label="borrar"
          onClick={() => handleDeleteClick(params.id)}
        >
          <DeleteIcon />
        </IconButton>
      ],
    }
  ];

  return (
    <Box m="20px">

      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header
          title="GASTOS"
          subtitle="Listado de todos los gastos"
        />

        <Box>
        <Button             
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontWeight: "bold",
              padding: "10px 20px",
              marginRight: "10px",
            }} onClick={handleOpenAddDialog}>
          Agregar Gasto
        </Button>
        <Button
          sx={{
            backgroundColor: colors.blueAccent[700],
            color: colors.grey[100],
            padding: "10px 20px",
          }}
          onClick={openTiposDialog}
        >
          <SettingsIcon />
        </Button>

        <AddGastoDialog
          open={addDialogOpen}
          onClose={handleCloseAddDialog}
          onSave={handleSaveGasto}
        />

        <HandlerTipos 
          open={tiposOpen}
          onClose={closeTiposDialog}
          nameTipo={"Gasto"}
          idTipo={"65adb8e6feca839eee16a536"}
        />

        </Box>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={gastos}
          columns={columns}
          getRowId={(row) => row._id}
          components={{ Toolbar: GridToolbar }}
        />
        <EditGastoDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          onSave={handleSaveEditedGasto}
          gastoToEdit={gastoToEdit}
        />
        <ConfirmDialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          onConfirm={handleConfirmDelete}
          nameItem={"gasto"}
          item={gastoAEliminar}
        />
        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={closeSnackbar}>
          <Alert onClose={closeSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
    
  );
};

export default Gastos;
