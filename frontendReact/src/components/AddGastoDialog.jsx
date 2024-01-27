import React, { useState, useEffect } from 'react';

import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Select, MenuItem, FormControl, InputLabel, FormHelperText } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';

const AddGastoDialog = ({ open, onClose, onSave }) => {
  const [newGasto, setNewGasto] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    tipo_gasto: '',
    valor_gasto: 0,
    fecha: ''
  });

  const [tiposGasto, setTiposGasto] = useState([]);
  const [errors, setErrors] = useState({});
  
  const validate = async () => {
    let tempErrors = {};
    tempErrors.nombre = newGasto.nombre ? "" : "El nombre no puede estar vacío.";
    tempErrors.tipo_gasto = newGasto.tipo_gasto ? "" : "El tipo de gasto no puede estar vacío.";
    tempErrors.valor_gasto = newGasto.valor_gasto > 0 ? "" : "La cantidad debe ser mayor que 0.";
  
    setErrors(tempErrors);
    return Object.values(tempErrors).every(x => x === ""); // Retorna true si no hay errores
  };


  const cargarTiposGasto = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/tipos/65adb8e6feca839eee16a536');
      const datos = await respuesta.json();
      setTiposGasto(datos.tipos);
    } catch (error) {
      console.error('Error al cargar tipos de gasto:', error);
    }
  };

  
  const handleChange = (e) => {
    setNewGasto({ ...newGasto, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (await validate()) {
        onSave(newGasto);
        resetForm();
        onClose();
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setNewGasto({
      codigo: '',
      nombre: '',
      descripcion: '',
      tipo_gasto: '',
      valor_gasto: 0,
      fecha: ''
    });
    setErrors({});
  };

  useEffect(() => {
    cargarTiposGasto();
  }, []);
  

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Agregar Nuevo Gasto</DialogTitle>
      <DialogContent>
      <TextField
          required
          margin="dense"
          label="Código"
          type="text"
          fullWidth
          variant="outlined"
          name="codigo"
          // error={Boolean(errors.codigo)}
          // helperText={errors.codigo}
          value={newGasto.codigo}
          onChange={handleChange}
        />
        <TextField
          required
          margin="dense"
          label="Nombre"
          type="text"
          fullWidth
          variant="outlined"
          name="nombre"
          error={Boolean(errors.nombre)}
          helperText={errors.nombre}
          value={newGasto.nombre}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Descripción"
          type="text"
          fullWidth
          variant="outlined"
          name="descripcion"
          value={newGasto.descripcion}
          onChange={handleChange}
        />
        <FormControl fullWidth required variant="outlined" margin="dense" error={Boolean(errors.tipo_gasto)}>
          <InputLabel>Tipo de Gasto</InputLabel>
          <Select
            label="Tipo de Gasto"
            name="tipo_gasto"
            value={newGasto.tipo_gasto}
            onChange={handleChange}
          >
            {tiposGasto.map((tipo) => (
              <MenuItem key={tipo} value={tipo}>{tipo}</MenuItem>
            ))}
          </Select>
          {errors.tipo_gasto && <FormHelperText>{errors.tipo_gasto}</FormHelperText>}
        </FormControl>
        <TextField
          required
          margin="dense"
          label="Valor"
          type="number"
          fullWidth
          variant="outlined"
          name="valor_gasto"
          error={Boolean(errors.valor_gasto)}
          helperText={errors.valor_gasto}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          value={newGasto.valor_gasto}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleSave}>Guardar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddGastoDialog;