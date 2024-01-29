import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const PaymentDialog = ({ open, onClose, totalFactura, procesarPago, ventaResumen }) => {
  const [metodoPago, setMetodoPago] = useState('efectivo');
  const [bancoSeleccionado, setBancoSeleccionado] = useState('');
  const [efectivoEntregado, setEfectivoEntregado] = useState('');
  const [pagoTransferencia, setPagoTransferencia] = useState('');
  const [devuelta, setDevuelta] = useState('');

  const handleMetodoPagoChange = (event) => {
    setMetodoPago(event.target.value);
  };

  const handleBancoChange = (event) => {
    setBancoSeleccionado(event.target.value);
  };

  const handleEfectivoEntregadoChange = (event) => {
    setEfectivoEntregado(Number(event.target.value));
  };

  const handlePagoTransferenciaChange = (event) => {
    setPagoTransferencia(Number(event.target.value));
  };

  const handlePago = () => {
    procesarPago({ metodoPago, efectivoEntregado, bancoSeleccionado });
    onClose();
  };

  const handleClose = () => {
    setEfectivoEntregado('');
    setBancoSeleccionado('');
    setPagoTransferencia('');
    onClose(); 
  };

  useEffect(() => {
    // Calcular la devuelta cada vez que se actualiza el efectivo entregado o el total de la factura
    if (efectivoEntregado > totalFactura) {
      setDevuelta(efectivoEntregado - totalFactura);
    } else {
      setDevuelta(0);
    }
  }, [efectivoEntregado, totalFactura]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Procesar Pago</DialogTitle>
      <DialogContent>
        <Accordion sx={{ marginBottom: 2, boxShadow: 4, borderRadius: 3 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Resumen de la Venta</Typography>
          </AccordionSummary>
          <AccordionDetails style={{ maxHeight: '200px', overflowY: 'auto' }}>
            <Typography variant="body2" component="div">
              {/* Aquí se mostrará el resumen de la venta */}
              Cliente: {ventaResumen.cliente.nombre} <br />
              Productos: 
              {ventaResumen.productosSeleccionados.map((producto, index) => (
                <div key={index}>
                  {producto.nombre} - Cantidad: {producto.cantidad} - Precio: {producto.precio_unitario_venta}
                </div>
              ))}
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
          <Box sx={{ width: '50%', display: 'inline-flex', boxShadow: 4, borderRadius: 2, padding: 2, backgroundColor: 'background.paper', marginY: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', marginRight: 1 }}>
              Total a Pagar:
            </Typography>
            <Typography sx={{ fontSize: '1.2rem', alignSelf: 'center' }}>
              {totalFactura.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
            </Typography>
          </Box>
          
          <Box sx={{ width: '50%' }}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="metodo-pago-label">Método de Pago</InputLabel>
              <Select
                labelId="metodo-pago-label"
                id="metodo-pago"
                value={metodoPago}
                label="Método de Pago"
                onChange={handleMetodoPagoChange}
              >
                <MenuItem value="efectivo">Efectivo</MenuItem>
                <MenuItem value="transferencia">Transferencia</MenuItem>
                <MenuItem value="mixto">Mixto</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Stack>

        {metodoPago === 'efectivo' && (
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
            <Box sx={{ 
              width: '50%',
              display: 'inline-flex', 
              boxShadow: 4, 
              borderRadius: 2, 
              padding: 2, 
              backgroundColor: 'background.paper',
            }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', marginRight: 1  }}>
                Devuelta:
              </Typography>
              <Typography sx={{ fontSize: '1rem', alignSelf: 'center' }}>
                {devuelta.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
              </Typography>
            </Box>
            <Box sx={{ width: '50%' }}>
              <TextField
                label="Efectivo Entregado"
                type="number"
                fullWidth
                margin="normal"
                value={efectivoEntregado}
                onChange={handleEfectivoEntregadoChange}
              />
            </Box>
          </Stack>
        )}

        {metodoPago === 'transferencia' && (
          <>
            <FormControl fullWidth margin="normal">
              <InputLabel id="banco-label">Banco</InputLabel>
              <Select
                labelId="banco-label"
                id="banco"
                value={bancoSeleccionado}
                label="Banco"
                onChange={handleBancoChange}
              >
                <MenuItem value="nequi">Nequi</MenuItem>
                <MenuItem value="bancolombia">Bancolombia</MenuItem>
              </Select>
            </FormControl>
          </>
        )}

        {metodoPago === 'mixto' && (
          <Stack direction="row" spacing={2}>
            {/* Columna para el pago en efectivo */}
            <Box flex={1}>
              <Box sx={{ 
                width: '100%',
                display: 'inline-flex', 
                marginTop: 2,
                boxShadow: 4, 
                borderRadius: 2, 
                padding: 2, 
                backgroundColor: 'background.paper',
              }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', marginRight: 1  }}>
                  Restante por Pagar:
                </Typography>
                <Typography sx={{ fontSize: '1rem', alignSelf: 'center' }}>
                  {Math.max(0, totalFactura - (efectivoEntregado + pagoTransferencia)).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
                </Typography>
              </Box>
              <Box sx={{ 
                width: '100%',
                marginTop: 2,
                display: 'inline-flex', 
                boxShadow: 4, 
                borderRadius: 2, 
                padding: 2, 
                backgroundColor: 'background.paper',
              }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', marginRight: 1  }}>
                  Devuelta:
                </Typography>
                <Typography sx={{ fontSize: '1rem', alignSelf: 'center' }}>
                  {Math.max(0, efectivoEntregado + pagoTransferencia - totalFactura).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
                </Typography>
              </Box>
            </Box>

            {/* Columna para el pago por transferencia */}
            <Box flex={1}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="banco-label">Banco</InputLabel>
                <Select
                  labelId="banco-label"
                  id="banco"
                  value={bancoSeleccionado}
                  label="Banco"
                  onChange={handleBancoChange}
                >
                  <MenuItem value="nequi">Nequi</MenuItem>
                  <MenuItem value="bancolombia">Bancolombia</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Pago por Transferencia"
                type="number"
                fullWidth
                margin="normal"
                value={pagoTransferencia}
                onChange={handlePagoTransferenciaChange}
              />
              <TextField
                label="Pago en Efectivo"
                type="number"
                fullWidth
                margin="normal"
                value={efectivoEntregado}
                onChange={handleEfectivoEntregadoChange}
              />
            </Box>
          </Stack>
        )}

      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handlePago}>Procesar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentDialog;
