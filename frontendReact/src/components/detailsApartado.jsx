import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ApartadoDialog = ({ apartadoInfo, open, handleClose }) => {
  const [metodoPago, setMetodoPago] = useState('efectivo');
  const [bancoSeleccionado, setBancoSeleccionado] = useState('');
  const [abonoTransferencia, setAbonoTransferencia] = useState('');
  const [abonoEfectivo, setAbonoEfectivo] = useState('');
  const [erroresPago, setErroresPago] = useState({});

  if (!apartadoInfo) return null;

  const handleMetodoPagoChange = (event) => {
    setMetodoPago(event.target.value);
    setErroresPago({});
  };

  const handleBancoChange = (event) => {
    setBancoSeleccionado(event.target.value);
  };

  const handleabonoEfectivoChange = (event) => {
    setAbonoEfectivo(Number(event.target.value));
  };

  const handleabonoTransferenciaChange = (event) => {
    setAbonoTransferencia(Number(event.target.value));
  };

  const formatCurrency = (amount) => {
    return amount.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
  };

  const handleAbono = () => {

    const fechaAbono = new Date();

    const nuevosErrores = {};
  
    if (metodoPago === 'efectivo') {
      if (abonoEfectivo === 0 || abonoEfectivo === '') {
        nuevosErrores.abonoEfectivo = 'El valor debe ser mayor a 0';
      }
      if (abonoEfectivo > apartadoInfo.saldoPendiente) {
        nuevosErrores.abonoEfectivo = 'Se está abonando más de lo necesario';
      }
    } 
    
    if (metodoPago === 'transferencia') {
      if (bancoSeleccionado === '') {
        nuevosErrores.banco = 'Seleccione un banco';
      }
      if (abonoTransferencia === 0 || abonoTransferencia === '') {
        nuevosErrores.abonoTransferencia = 'El valor debe ser mayor a 0';
      }
      if (abonoTransferencia > apartadoInfo.saldoPendiente) {
        nuevosErrores.abonoTransferencia = 'Se está abonando más de lo necesario';
      }
    } 
    
    if (metodoPago === 'mixto') {
      if (bancoSeleccionado === '') {
        nuevosErrores.banco = 'Seleccione un banco';
      }
      if (abonoEfectivo === 0 || abonoEfectivo === '') {
        nuevosErrores.abonoEfectivo = 'El valor debe ser mayor a 0';
      }
      if (abonoTransferencia === 0 || abonoTransferencia === '') {
        nuevosErrores.abonoTransferencia = 'El valor debe ser mayor a 0';
      }
      if (abonoEfectivo > apartadoInfo.saldoPendiente || abonoTransferencia > apartadoInfo.saldoPendiente || (abonoTransferencia + abonoEfectivo) > apartadoInfo.saldoPendiente) {
        nuevosErrores.abonoEfectivo = 'Se está abonando más de lo necesario';
      }
    }

    // Verifica si hay errores en la validación
    if (nuevosErrores.abonoEfectivo || nuevosErrores.abonoTransferencia || nuevosErrores.banco) {
      setErroresPago(nuevosErrores);
      return;
    } else {

      if (metodoPago === "efectivo"){
        setAbonoTransferencia(0)
        setBancoSeleccionado('NoAplica')
      } else if (metodoPago === "transferencia") {
        setAbonoEfectivo(0)
      }

      const anteriorMetodoPago = apartadoInfo.metodoPago
      const anteriorPagoTransferencia = apartadoInfo.pagoTransferencia
      const anteriorPagoEfectivo = apartadoInfo.pagoEfectivo
      const anteriorHistorialAbono = apartadoInfo.historialAbonos

      if (anteriorMetodoPago === "efectivo" || anteriorMetodoPago === "transferencia") {
        if (anteriorMetodoPago !== metodoPago) {
          apartadoInfo.metodoPago = "mixto"
        }
      }

      apartadoInfo.pagoTransferencia = abonoTransferencia + anteriorPagoTransferencia
      apartadoInfo.pagoEfectivo = abonoEfectivo + anteriorPagoEfectivo
      apartadoInfo.totalAbonado = apartadoInfo.pagoTransferencia + apartadoInfo.pagoEfectivo
      apartadoInfo.saldoPendiente = apartadoInfo.totalFactura - apartadoInfo.totalAbonado

      const infoAbono = {
        fechaAbono: fechaAbono.toISOString(),
        abono: 0,
      }

      apartadoInfo.historialAbonos = anteriorHistorialAbono.append(infoAbono)
    }
  };

  const StyledButton = styled(Button)(({ theme }) => ({
    fontWeight: 'bold',
    textTransform: 'none',
    fontSize: '1rem',
    padding: theme.spacing(1, 2),
    margin: theme.spacing(1), 
  }));

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Detalle de Apartado</DialogTitle>
      <DialogContent>
        <Box mb={2} display="flex" justifyContent="space-between">
            <Typography variant="body1">
                Fecha: {new Date(apartadoInfo.fechaApartado).toLocaleString('es-CO', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true
                })}
            </Typography>
          <Typography variant="body1">ID Apartado: {apartadoInfo._id}</Typography>
        </Box>

        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Datos del Cliente</Typography>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Typography variant="body1"><span style={{ fontWeight: 'bold' }}>Nombre:</span> {apartadoInfo.cliente.nombre}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body1"><span style={{ fontWeight: 'bold' }}>Documento:</span> {apartadoInfo.cliente.docIdentidad}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body1"><span style={{ fontWeight: 'bold' }}>Telefono:</span> {apartadoInfo.cliente.telefono}</Typography>
          </Grid>
        </Grid>

        <Accordion sx={{ marginBottom: 2, boxShadow: 4, borderRadius: 3, mt: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Resumen de la Venta</Typography>
          </AccordionSummary>
          <AccordionDetails style={{ maxHeight: '200px', overflowY: 'auto' }}>
            <Box>     
              <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 1, mb: 2 }}>Detalle de Pago</Typography>
              <TableContainer>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Producto</TableCell>
                      <TableCell align="right">Cantidad</TableCell>
                      <TableCell align="right">Precio Unitario</TableCell>
                      <TableCell align="right">Precio Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {apartadoInfo.productosVendidos.map((producto) => (
                      <TableRow key={producto._id}>
                        <TableCell>{producto.nombre}</TableCell>
                        <TableCell align="right">{producto.cantidad}</TableCell>
                        <TableCell align="right">{formatCurrency(producto.precio_unitario_venta)}</TableCell>
                        <TableCell align="right">{formatCurrency(producto.precio_total)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2, mb: 2 }}>Detalle del Abono</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body1"><span style={{ fontWeight: 'bold' }}>Pago Transferencia:</span> {formatCurrency(apartadoInfo.abonoTransferencia)}</Typography>
                  <Typography variant="body1"><span style={{ fontWeight: 'bold' }}>Banco:</span> {apartadoInfo.banco}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1"><span style={{ fontWeight: 'bold' }}>Método de Pago:</span> {apartadoInfo.metodoPago}</Typography>
                  <Typography variant="body1"><span style={{ fontWeight: 'bold' }}>Pago Efectivo:</span> {formatCurrency(apartadoInfo.abonoEfectivo)}</Typography>
                </Grid>
              </Grid>

            </Box>
          </AccordionDetails>
        </Accordion>

        <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2, mb: 2 }}>Detalle del Abono</Typography>
        <Grid container spacing={2} justifyContent="space-between">
          <Grid item xs={6}>
            <Box sx={{ 
              width: '100%',
              display: 'flex', 
              boxShadow: 4, 
              borderRadius: 2, 
              padding: 2, 
              backgroundColor: '#F53F3F',
              justifyContent: 'space-between'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Saldo Pendiente:
              </Typography>
              <Typography sx={{ fontSize: '1rem', alignSelf: 'center' }}>
                {formatCurrency(apartadoInfo.saldoPendiente)}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ 
              width: '100%',
              display: 'flex', 
              boxShadow: 4, 
              borderRadius: 2, 
              padding: 2, 
              backgroundColor: '#7DCE5A',
              justifyContent: 'space-between'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Total Abonado:
              </Typography>
              <Typography sx={{ fontSize: '1rem', alignSelf: 'center' }}>
                {formatCurrency(apartadoInfo.totalAbonado)}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ 
          marginTop: 2,
          display: 'flex', 
          justifyContent: 'space-between',
          boxShadow: 4, 
          borderRadius: 2, 
          padding: 2, 
          backgroundColor: 'background.paper',
        }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
              Total Factura: {formatCurrency(apartadoInfo.totalFactura)}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography variant="h6" sx={{ opacity: 0.8 }}>
              Vendedor: {apartadoInfo.vendedor}
            </Typography>
          </Box>
        </Box>

        <Accordion sx={{ marginBottom: 2, boxShadow: 4, borderRadius: 3, mt: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Ingreso de Abono</Typography>
          </AccordionSummary>
          <AccordionDetails>

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
                  dd
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
              <Box flex={1}>
                <TextField
                  label="Pago en efectivo"
                  type="number"
                  fullWidth
                  margin="normal"
                  value={abonoEfectivo}
                  onChange={handleabonoEfectivoChange}
                  error={!!erroresPago.abonoEfectivo}
                  helperText={erroresPago.abonoEfectivo}
                />
              </Box>
            </Stack>
          )}

          {metodoPago === 'transferencia' && (
            <Stack direction="row" spacing={2}>
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
                    error={!!erroresPago.banco}
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
                  value={abonoTransferencia}
                  onChange={handleabonoTransferenciaChange}
                  error={!!erroresPago.abonoTransferencia}
                  helperText={erroresPago.abonoTransferencia}
                />
              </Box>
            </Stack>
          )}

          {metodoPago === 'mixto' && (
            <Stack direction="row" spacing={2}>
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
                    error={!!erroresPago.banco}
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
                  value={abonoTransferencia}
                  onChange={handleabonoTransferenciaChange}
                  error={!!erroresPago.abonoTransferencia}
                  helperText={erroresPago.abonoTransferencia}
                />
                <TextField
                  label="Pago en Efectivo"
                  type="number"
                  fullWidth
                  margin="normal"
                  value={abonoEfectivo}
                  onChange={handleabonoEfectivoChange}
                  error={!!erroresPago.abonoEfectivo}
                  helperText={erroresPago.abonoEfectivo}
                />
              </Box>
            </Stack>
          )}

          </AccordionDetails>
        </Accordion>
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
          onClick={handleAbono} 
          variant="contained" 
          sx={{ 
            backgroundColor: 'success.light',
            '&:hover': {
              backgroundColor: 'success.main', 
            }
          }}
        >
          Abonar
        </StyledButton>
      </DialogActions>
    </Dialog>
  );
};

export default ApartadoDialog;
