import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Select, MenuItem, FormControl, InputLabel, FormHelperText } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';

const EditGastoDialog = ({ open, onClose, onSave, gastoToEdit }) => {
  const [gasto, setGasto] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    tipo_gasto: '',
    valor_gasto: 0,
    fecha: ''
  });

  const [tiposGasto, setTiposGasto] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open){
      cargarTiposGasto();
    }
    if (gastoToEdit) {
      setGasto(gastoToEdit);
    }
  }, [open, gastoToEdit]);

  const validate = async () => {
    let tempErrors = {};
    tempErrors.nombre = gasto.nombre ? "" : "El nombre no puede estar vacío.";
    tempErrors.tipo_gasto = gasto.tipo_gasto ? "" : "El tipo de gasto no puede estar vacío.";
    tempErrors.valor_gasto = gasto.valor_gasto > 0 ? "" : "La cantidad debe ser mayor que 0.";

    setErrors(tempErrors);
    return Object.values(tempErrors).every(x => x === ""); // Retorna true si no hay errores
  };

  const handleChange = (e) => {
    setGasto({ ...gasto, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (await validate()) {
      onSave(gasto);
      resetForm();
      onClose();
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setGasto({
      codigo: '',
      nombre: '',
      descripcion: '',
      tipo_gasto: '',
      valor_gasto: 0,
      fecha: ''
    });
    setErrors({});
    setTiposGasto([]);
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

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Editar Gasto</DialogTitle>
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
          value={gasto.codigo}
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
          value={gasto.nombre}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Descripción"
          type="text"
          fullWidth
          variant="outlined"
          name="descripcion"
          value={gasto.descripcion}
          onChange={handleChange}
        />
        <FormControl fullWidth required variant="outlined" margin="dense" error={Boolean(errors.tipo_gasto)}>
          <InputLabel>Tipo de Gasto</InputLabel>
          <Select
            label="Tipo de Gasto"
            name="tipo_gasto"
            value={gasto.tipo_gasto}
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
          value={gasto.valor_gasto}
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

export default EditGastoDialog;
