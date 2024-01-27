import React, { useState } from 'react';

import { Box, useTheme, IconButton, Button, Typography, Stack, TextField, Autocomplete, ToggleButton, ToggleButtonGroup  } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataTeam } from "../../data/mockData";
import Header from "../../components/Header";

import CachedIcon from '@mui/icons-material/Cached';
import DeleteIcon from '@mui/icons-material/Delete';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import CancelIcon from '@mui/icons-material/Cancel';
import RefreshIcon from '@mui/icons-material/Refresh';



const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const clienteInicial = {
    nombre: 'Cliente general',
    docIdentidad: '2222222222',
    telefono: '0000000000'
  };

  const [cliente, setCliente] = useState(clienteInicial);
  const [opciones, setOpciones] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [busquedaTipo, setBusquedaTipo] = useState('nombre')

  const buscarProductos = async (busqueda) => {
    if (busqueda.length < 3) {
      setOpciones([]);
      return;
    }

    let url = `http://localhost:3000/api/productos/buscar?`;
    if (busquedaTipo === 'nombre') {
      url += `nombre=${encodeURIComponent(busqueda)}`;
    } else if (busquedaTipo === 'codigo') {
      url += `codigo=${encodeURIComponent(busqueda)}`;
    }

    try {
      const response = await fetch(url);
      console.log(response)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const productos = await response.json();
      console.log(productos)
      setOpciones(productos);
    } catch (error) {
      console.error("No se pudo obtener los productos", error);
    }
  };

  const handleBusquedaTipoChange = (_, newBusquedaTipo) => {
    if (newBusquedaTipo !== null) {
      setBusquedaTipo(newBusquedaTipo);
    }
  };

  const handleChange = (event) => {
    setCliente({ ...cliente, [event.target.name]: event.target.value });
  };

  const handleRefresh = () => {
    setCliente(clienteInicial); // Restablece la información del cliente a los valores iniciales
  };

  const handleUpdate = (id) => {
    console.log(id)
  };

  const handleDeleteClick = (id) => {
    console.log("")
  };
  
  const totalFactura = 2200000;

  const columns = [
    { field: "id", headerName: "Código" },
    {
      field: "name",
      headerName: "Nombre",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "age",
      headerName: "Cantidad",
      flex: 1,
      type: "number",
      editable: true
    },
    {
      field: "precio_unidad",
      headerName: "Precio unidad",
      type: "number",
      flex: 1,
      editable: true
    },
    {
      field: "precio_total",
      headerName: "Precio total",
      type: "number",
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
          onClick={() => handleUpdate(params.id)}
        >
          <CachedIcon />
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
      <Header title="PUNTO DE VENTA" />
      <Box sx={{
          p: 2,
          bgcolor: colors.primary[400],
          borderRadius: 3,
          boxShadow: 4,
        }}>
        <Typography variant="h5" component="div" 
          sx={{ 
            mb: 2,
            fontWeight: 'bold',
            color: 'primary' 
          }}>
          Información del Cliente
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
          <TextField
            name="nombre"
            label="Nombre"
            variant="outlined"
            value={cliente.nombre}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            name="docIdentidad"
            label="Doc Identidad/NIT"
            variant="outlined"
            value={cliente.docIdentidad}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            name="telefono"
            label="Teléfono"
            variant="outlined"
            value={cliente.telefono}
            onChange={handleChange}
            fullWidth
          />
          <IconButton onClick={handleRefresh}>
            <RefreshIcon />
          </IconButton>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <Typography variant="h5" component="div" sx={{ 
            fontWeight: 'bold',
            color: 'primary',
            display: 'flex',
            alignItems: 'center',
          }}>
            Buscar producto
          </Typography>
          <ToggleButtonGroup
            color="primary"
            value={busquedaTipo}
            exclusive
            onChange={handleBusquedaTipoChange}
            size="small"
            sx={{ height: 'fit-content' }} // Asegúrate de que el ToggleButtonGroup esté alineado con el Typography si tienen diferentes alturas
          >
            <ToggleButton value="nombre" sx={{
              '&.Mui-selected': {
                color: 'white',
                backgroundColor: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              },
            }}>
          Nombre</ToggleButton>
            <ToggleButton value="codigo" sx={{
              '&.Mui-selected': {
                color: 'white', // Cambia el color de la letra cuando está seleccionado
                backgroundColor: 'primary.main', // Cambia el fondo cuando está seleccionado
                '&:hover': {
                  backgroundColor: 'primary.dark', // Cambia el fondo al pasar el ratón por encima
                },
              },
            }}>Código</ToggleButton>
          </ToggleButtonGroup>
        </Stack>
        <Autocomplete
          freeSolo
          options={opciones}
          getOptionLabel={(option) => 
            `${option.nombre} - Código: ${option.codigo} - Cantidad: ${option.cantidad}`
          }
          onInputChange={(_, newInputValue) => {
            setInputValue(newInputValue);
            buscarProductos(newInputValue);
          }}
          inputValue={inputValue}
          renderInput={(params) => (
            <TextField {...params} label={`Buscar por ${busquedaTipo}`} variant="outlined" fullWidth />
          )}
          renderOption={(props, option) => (
            <Box component="li" {...props} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
              <Typography variant="body1">{option.nombre}</Typography>
              <Typography variant="body2" color="textSecondary">Código: {option.codigo}</Typography>
              <Typography variant="body2" color="textSecondary">Cantidad: {option.cantidad}</Typography>
            </Box>
          )}
        />
      </Box>
      <Box
        height="50vh"        
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
          boxShadow: 4,
          mt: 2
        }}
      >
        <DataGrid rows={mockDataTeam} columns={columns} />
      </Box>
      <Box sx={{
        mt: 2,
        p: 2,
        bgcolor: colors.primary[400],
        borderRadius: 3,
        boxShadow: 4,
        display: 'flex', // Establece el Box para utilizar flexbox
        alignItems: 'center', // Alinea verticalmente los items al centro
        justifyContent: 'space-between' // Separa el contenido entre los dos extremos del Box
      }}>
        <Typography
          variant="h3"
          component="div"
          sx={{
            fontWeight: 'bold',
            color: 'primary'
          }}
        >
          TOTAL FACTURA: 
          <Box component="span" sx={{ ml: 1, color: 'secondary.main' }}>
            {totalFactura.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
          </Box>
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddShoppingCartIcon />}
            sx={{ bgcolor: 'success.main', '&:hover': { bgcolor: 'success.dark' }, fontSize: '1rem' }}
          >
            Contado
          </Button>
          <Button
            variant="contained"
            size="large"
            startIcon={<CreditScoreIcon />}
            sx={{ bgcolor: 'warning.main', '&:hover': { bgcolor: 'warning.dark' }, fontSize: '1rem' }}
          >
            Apartado
          </Button>
          <Button
            variant="contained"
            size="large"
            startIcon={<CancelIcon />}
            sx={{ bgcolor: 'error.main', '&:hover': { bgcolor: 'error.dark' }, fontSize: '1rem' }}
          >
            Cancelar Compra
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default Team;
