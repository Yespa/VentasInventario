import React, { useState, useEffect } from 'react';
import { Box, useTheme, IconButton, Alert, Snackbar } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import DetailsApartado from '../../components/detailsApartado';

import PlagiarismIcon from '@mui/icons-material/Plagiarism';


const Apartados = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [apartados, setApartados] = useState([]);
  const [apartadoSeleccionado, setApartadoSeleccionado] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // Puede ser "success" o "error"

  const handleOpenDialog = (apartado) => {
    setApartadoSeleccionado(apartado);
    console.log(apartado)
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

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


  const obtenerApartados = async () => {
    try {
      const respuesta = await fetch("http://localhost:3000/api/apartados/all?limite=50");
      if (!respuesta.ok) {
        throw new Error(`HTTP error! status: ${respuesta.status}`);
      }
      const data = await respuesta.json();
      setApartados(data);
    } catch (error) {
      setError(error.message);
      console.log("Error al obtener apartados:", error);
    }
  };

  const handleSaveEditedApartado = async (editedApartado) => {
    try {
      console.log(editedApartado);

      const response = await fetch(`http://localhost:3000/api/apartados/${editedApartado._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedApartado)
      });
  
      if (!response.ok) {
        throw new Error('Error al actualizar el apartado');
      }
  
      console.log('Apartado actualizado');
      obtenerApartados();
      openSnackbar("Apartado actualizado exitosamente", "success");
  
    } catch (error) {
      console.error('Error:', error);
      openSnackbar("Falló la actualización del Apartado", "error");
    }
  };
  
  
  useEffect(() => {
    obtenerApartados();
  }, []);

  const columns = [
    { field: "_id",
      headerName: "id",
      flex: 1,
      cellClassName: "name-column--cell"
    },
    {
      field: "fechaApartado",
      headerName: "Fecha Apartado",
      flex: 1,
      valueGetter: (params) => {
        return new Date(params.row.fechaApartado).toLocaleString('es-CO', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });
      },
    },
    {
      field: "clienteNombre",
      headerName: "Nombre cliente",
      flex: 1,
      valueGetter: (params) => params.row.cliente?.nombre,
    },
    {
      field: "saldoPendiente",
      headerName: "Saldo Pendiente",
      flex: 1,
      valueGetter: (params) => {
        return params.row.saldoPendiente.toLocaleString('es-CO', {
          style: 'currency',
          currency: 'COP',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        });
      }
    },
    {
      field: "totalAbonado",
      headerName: "Total Abonado",
      flex: 1,
      valueGetter: (params) => {
        return params.row.totalAbonado.toLocaleString('es-CO', {
          style: 'currency',
          currency: 'COP',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        });
      }
    },
    {
      field: "totalFactura",
      headerName: "Total Factura",
      flex: 1,
      valueGetter: (params) => {
        return params.row.totalFactura.toLocaleString('es-CO', {
          style: 'currency',
          currency: 'COP',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        });
      }
    },
    {
      field: "estado",
      headerName: "Estado",
      flex: 1
    },
    {
      field: "vendedor",
      headerName: "Vendedor",
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
          onClick={() => handleOpenDialog(params.row)}
        >
          <PlagiarismIcon />
        </IconButton>,
      ],
    }
  ];

  return (
    <Box m="20px">

      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header
          title="APARTADOS"
        />
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
          rows={apartados}
          columns={columns}
          getRowId={(row) => row._id}
          components={{ Toolbar: GridToolbar }}
        />
        <DetailsApartado
          apartadoInfo={apartadoSeleccionado}
          open={dialogOpen}
          onClose={handleCloseDialog}
          onSave={handleSaveEditedApartado}

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

export default Apartados;
