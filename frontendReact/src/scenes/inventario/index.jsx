import React, { useState, useEffect } from 'react';
import { Box, useTheme, IconButton, Alert, Button, Snackbar } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import ConfirmDialog from "../../components/ConfirmDialog";
import AddProductDialog from "../../components/AddProductDialog";
import EditProductDialog from "../../components/EditProductDialog";
import HandlerTipos from "../../components/HandlerTipos";

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';

const Inventario = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [productos, setProductos] = useState([]);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tiposOpen, setTiposDialogOpen] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
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
    const productoAEliminar = productos.find(producto => producto._id === id);
    if (!productoAEliminar) {
      console.error("Producto no encontrado");
      return;
    }
    setProductoAEliminar(productoAEliminar);
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

  const obtenerProductos = async () => {
    try {
      const respuesta = await fetch("http://localhost:3000/api/productos/all?limite=15");
      if (!respuesta.ok) {
        throw new Error(`HTTP error! status: ${respuesta.status}`);
      }
      const data = await respuesta.json();
      setProductos(data);
    } catch (error) {
      setError(error.message);
      console.log("Error al obtener productos:", error);
    }
  };

  const handleEdit = (id) => {
    console.log(id)
    const product = productos.find(p => p._id === id);
    setProductToEdit(product);
    setEditDialogOpen(true);
  };
  
  const handleConfirmDelete = async (id) => {
    setDialogOpen(false);    
    // Realiza la petición de borrado al backend
    try {
      const response = await fetch(`http://localhost:3000/api/productos/${id}`, {
        method: 'DELETE'
      });
  
      if (!response.ok) {
        throw new Error('Error al eliminar el producto');
      }
  
      console.log('Producto eliminado');
      obtenerProductos(); // Actualiza la lista de productos
      openSnackbar("Se ha eliminado el producto existosamente.", "success");
    } catch (error) {
      console.error('Error:', error);
      openSnackbar("Falló la eliminación del producto", "error");
    }
  };

  const handleSaveProduct = async (nuevoProducto) => {
    console.log(nuevoProducto);
    try {
      const response = await fetch('http://localhost:3000/api/productos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoProducto)
      });

      if (!response.ok) {
        throw new Error('Error al agregar el producto');
      }

      console.log('Producto agregado');
      obtenerProductos();
      openSnackbar("Se guardó el producto exitosamente", "success");

    } catch (error) {
      console.error('Error:', error);
      openSnackbar("Falló el guardado del producto", "error");
    }
  };

  const handleSaveEditedProduct = async (editedProduct) => {
    try {
      console.log(editedProduct);

      const response = await fetch(`http://localhost:3000/api/productos/${editedProduct._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedProduct)
      });
  
      if (!response.ok) {
        throw new Error('Error al actualizar el producto');
      }
  
      console.log('Producto actualizado');
      obtenerProductos();
      openSnackbar("Producto actualizado exitosamente", "success");
  
    } catch (error) {
      console.error('Error:', error);
      openSnackbar("Falló la actualización del producto", "error");
    }
  };
  
  useEffect(() => {
    obtenerProductos();
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
      field: "tipo_producto",
      headerName: "Tipo de Producto",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "cantidad",
      headerName: "Cantidad",
      flex: 1,
    },
    {
      field: "precio_inventario",
      headerName: "Precio Inventario",
      flex: 1,
    },
    {
      field: "precio_sugerido",
      headerName: "Precio Sugerido",
      flex: 1,
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
          title="INVENTARIO"
          subtitle="Listado de todos los productos"
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
          Agregar Producto
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

        <AddProductDialog
          open={addDialogOpen}
          onClose={handleCloseAddDialog}
          onSave={handleSaveProduct}
        />

        <HandlerTipos 
          open={tiposOpen}
          onClose={closeTiposDialog} 
          nameTipo={"Producto"}
          idTipo={"65adb6d61a8b99a4cc7cc10c"}
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
          rows={productos}
          columns={columns}
          getRowId={(row) => row._id}
          components={{ Toolbar: GridToolbar }}
        />
        <EditProductDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          onSave={handleSaveEditedProduct}
          productToEdit={productToEdit}
        />
        <ConfirmDialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          onConfirm={handleConfirmDelete}
          nameItem={"producto"}
          item={productoAEliminar}
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

export default Inventario;