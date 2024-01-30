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
  AccordionDetails,
  Table,
  TableContainer,
  TableRow,
  TableBody,
  TableHead,
  TableCell,
  Grid
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';

const PaymentDialogApartado = ({ open, onClose, totalFactura, procesarPago, ventaResumen }) => {
  const [metodoPago, setMetodoPago] = useState('efectivo');
  const [bancoSeleccionado, setBancoSeleccionado] = useState('');
  const [efectivoEntregado, setEfectivoEntregado] = useState('');
  const [pagoTransferencia, setPagoTransferencia] = useState('');
  const [pendientePago, setPendientePago] = useState(0);

  const handleMetodoPagoChange = (event) => {
    setMetodoPago(event.target.value);
    setEfectivoEntregado('')
    setPagoTransferencia('')
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

  const StyledButton = styled(Button)(({ theme }) => ({
    fontWeight: 'bold',
    textTransform: 'none',
    fontSize: '1rem',
    padding: theme.spacing(1, 2),
    margin: theme.spacing(1), 
  }));

  useEffect(() => {
    setPendientePago(Math.max(0, totalFactura - (efectivoEntregado + pagoTransferencia)).toLocaleString('es-CO', { style: 'currency', currency: 'COP' }));
  }, [pagoTransferencia, efectivoEntregado, totalFactura]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Procesar Apartado</DialogTitle>
      <DialogContent>
      <Accordion sx={{ marginBottom: 2, boxShadow: 4, borderRadius: 3 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Resumen de la Venta</Typography>
        </AccordionSummary>
        <AccordionDetails style={{ maxHeight: '200px', overflowY: 'auto' }}>
        <Box>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 2 }}>
            Datos del Cliente
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Typography variant="body1">Nombre: {ventaResumen.cliente.nombre}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body1">Documento: {ventaResumen.cliente.docIdentidad}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body1">Teléfono: {ventaResumen.cliente.telefono}</Typography>
            </Grid>
          </Grid>
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mt: 2, mb: 2 }}>Detalle de Productos</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Producto</TableCell>
                    <TableCell align="right">Cantidad</TableCell>
                    <TableCell align="right">Precio Unitario</TableCell>
                    <TableCell align="right">Precio Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ventaResumen.productosVendidos.map((producto, index) => (
                    <TableRow key={index}>
                      <TableCell component="th" scope="row">
                        {producto.nombre}
                      </TableCell>
                      <TableCell align="right">
                        {producto.cantidad}
                      </TableCell>
                      <TableCell align="right">
                        {producto.precio_unitario_venta.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
                      </TableCell>
                      <TableCell align="right">
                        {(producto.precio_unitario_venta * producto.cantidad).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
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
                Restante por pagar:
              </Typography>
              <Typography sx={{ fontSize: '1rem', alignSelf: 'center' }}>
                {pendientePago}
              </Typography>
            </Box>
            <Box sx={{ width: '50%' }}>
              <TextField
                label="Pago en efectivo"
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
          <Stack direction="row" spacing={2}>
            <Box flex={1} sx={{ display: 'flex', flexDirection: 'column' }}>
              {/* Restante por pagar */}
              <Box sx={{
                display: 'flex', 
                alignItems: 'center',
                boxShadow: 4, 
                borderRadius: 2, 
                padding: 2, 
                backgroundColor: 'background.paper',
                marginTop: 2
              }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', marginRight: 1 }}>
                  Restante por pagar:
                </Typography>
                <Typography sx={{ fontSize: '1rem' }}>
                  {pendientePago}
                </Typography>
              </Box>

            </Box>

            {/* Espacio para campos adicionales de transferencia si es necesario */}
            <Box flex={1}>
              {/* Selector de banco */}
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

              {/* Campo de pago por transferencia */}
              <TextField
                label="Pago por Transferencia"
                type="number"
                fullWidth
                margin="normal"
                value={pagoTransferencia}
                onChange={handlePagoTransferenciaChange}
              />
            </Box>
          </Stack>
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
                  {pendientePago}
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
        <StyledButton 
          onClick={handleClose} 
          sx={{ 
            backgroundColor: 'error.main',
            '&:hover': {
              backgroundColor: 'error.dark', 
            }
          }}
        >
          Cancelar
        </StyledButton>
        <StyledButton 
          onClick={handlePago} 
          variant="contained" 
          sx={{ 
            backgroundColor: 'warning.light',
            '&:hover': {
              backgroundColor: 'warning.main', 
            }
          }}
        >
          Apartar
        </StyledButton>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentDialogApartado;
