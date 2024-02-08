import React, { useState, useEffect } from 'react';
import { Box, useTheme, IconButton, Alert, Snackbar } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import DetailsFacture from '../../components/detailsFacture';
import PrintFactura from '../../components/printFactura';

import PlagiarismIcon from '@mui/icons-material/Plagiarism';
import PrintIcon from '@mui/icons-material/Print';

const Facturas = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [facturas, setFacturas] = useState([]);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [facturaParaImprimir, setFacturaParaImprimir] = useState(null);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // Puede ser "success" o "error"

  const handleOpenDialog = (factura) => {
    setFacturaSeleccionada(factura);
    setDialogOpen(true);
  };

  const handlePrint = (factura) => {
    console.log(factura)
    setFacturaParaImprimir(factura);
    imprimirFactura(factura);
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


  const obtenerFacturas = async () => {
    try {
      const respuesta = await fetch("http://localhost:3000/api/facturas/all?limite=50");
      if (!respuesta.ok) {
        throw new Error(`HTTP error! status: ${respuesta.status}`);
      }
      const data = await respuesta.json();
      setFacturas(data);
    } catch (error) {
      setError(error.message);
      console.log("Error al obtener facturas:", error);
    }
  };

  const imprimirFactura = (datosFactura) => {
    setTimeout(() => {
      const ventanaImpresion = window.open('', '_blank', 'width=50mm');
      ventanaImpresion.document.write(`
        <html>
        <head>
          <title>Impresión de Factura</title>
          <style>
            body, html {
              width: 58mm;
              font-family: 'Arial', sans-serif;
            }
            img {
              max-width: 30mm;
              height: auto;
              margin-top: 5px;
              margin-bottom: 5px;
            }
            /* Añade aquí más estilos según sea necesario */
          </style>
        </head>
        <body>
          ${document.getElementById('facturaParaImprimir').innerHTML}
        </body>
        </html>
      `);
      ventanaImpresion.document.close();
      ventanaImpresion.focus();
      ventanaImpresion.print();
      // ventanaImpresion.close(); // Descomenta si deseas que la ventana se cierre automáticamente después de imprimir
    }, 500);
  };  
  
  useEffect(() => {
    obtenerFacturas();
  }, []);

  const columns = [
    { field: "_id",
      headerName: "id",
      flex: 1,
      cellClassName: "name-column--cell"
    },
    {
      field: "fechaVenta",
      headerName: "Fecha",
      flex: 1,
      valueGetter: (params) => {
        return new Date(params.row.fechaVenta).toLocaleString('es-CO', {
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
      field: "metodoPago",
      headerName: "Método Pago",
      flex: 1,
    },
    {
      field: "pagoTransferencia",
      headerName: "P. Transferencia",
      flex: 1,
      valueGetter: (params) => {
        return params.row.pagoTransferencia.toLocaleString('es-CO', {
          style: 'currency',
          currency: 'COP',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        });
      }
    },
    {
      field: "banco",
      headerName: "Banco",
      flex: 1,
    },
    {
      field: "pagoEfectivo",
      headerName: "P. Efectivo",
      flex: 1,
      valueGetter: (params) => {
        return params.row.pagoEfectivo.toLocaleString('es-CO', {
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
        <IconButton
          color="secondary"
          aria-label="imprimir"
          onClick={() => handlePrint(params.row)}
        >
        <PrintIcon/>
        </IconButton>
      ],
    }
  ];

  return (
    <Box m="20px">

      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header
          title="FACTURAS"
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
          rows={facturas}
          columns={columns}
          getRowId={(row) => row._id}
          components={{ Toolbar: GridToolbar }}
        />
        <DetailsFacture
          facturaInfo={facturaSeleccionada}
          open={dialogOpen}
          handleClose={handleCloseDialog}
        />
        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={closeSnackbar}>
          <Alert onClose={closeSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
        <div id="facturaParaImprimir" style={{ display: "none" }}>
          {facturaParaImprimir && <PrintFactura datosFactura={facturaParaImprimir} />}
        </div>
      </Box>
    </Box>
    
  );
};

export default Facturas;
