import React from 'react';

const ComprobanteImpresion = ({ datosApartado }) => {

  const fechaApartado = new Date(datosApartado.fechaApartado);

  // Formatear la fecha en un formato más legible
  // Ejemplo: 31 de enero de 2024, 21:59
  const fechaFormateada = fechaApartado.toLocaleString('es-CO', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  const tituloTexto = {
    fontWeight: 'bold'
  };

  // Estilos en línea para el div principal
  const facturaEstilos = {
    width: '58mm', 
    maxWidth: '58mm', 
    fontFamily: 'Arial, sans-serif',
    fontSize: '13px',
    textAlign: 'center',
    margin: '0 auto',
  };

  // Estilos en línea para la imagen
  const imagenEstilos = {
    maxWidth: '45mm',
    height: 'auto',
    marginTop: '5px',
    marginBottom: '5px',
  };

    // Estilos en línea para la imagen
    const imagenEstilosQR = {
      maxWidth: '40mm',
      height: 'auto',
      marginTop: '5px',
      marginBottom: '5px',
    };

  // Estilos en línea para la tabla
  const tablaEstilos = {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '12px' // Asegurándose de que la tabla también use el mismo tamaño de fuente
  };

  // Estilos en línea para celdas de la tabla
  const celdaEstilos = {
    padding: '8px',
    textAlign: 'left',
  };

  // Estilos en línea para uniformar el tamaño de la letra
  const estilosTexto = {
    fontSize: '12px',
    margin: '5px 0',
    textAlign: 'left' // Alineación a la izquierda
  };

  const formatDate = (date) => {

    const dateConvert = new Date(date);
    const dateFormated = dateConvert.toLocaleString('es-CO', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });

    return dateFormated
    
  };


  // Estilos para la sección de detalles de pago
  const estilosDetallesPago = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: '10px'
  };
  
  return (
    <div style={facturaEstilos}>
      <img 
        src="../../assets/logo-black-peq.png" 
        alt="Logo" 
        style={imagenEstilos}
      />
      <h2>CELUFLASH</h2>
      <p><span style={tituloTexto}>NIT:</span> 1001553520-6</p>
      <p><span style={tituloTexto}>Tel:</span> 3206603872 </p>
      <p>CRA 20 #22-08</p>
      <p>Doradal - Antioquia</p>
      <div style={{ borderTop: '1px dotted #000', margin: '5px 0' }}></div>
      <div style={estilosTexto}>
        <p><span style={tituloTexto}>COMPROBANTE DE ABONO.</span></p>
        <p><span style={tituloTexto}>Id:</span> {datosApartado._id}</p>
        <p><span style={tituloTexto}>Fecha:</span> {fechaFormateada}</p>
        <p><span style={tituloTexto}>Cliente:</span> {datosApartado.cliente.nombre}</p>
        <p><span style={tituloTexto}>CC/NIT:</span> {datosApartado.cliente.docIdentidad}</p>
        <p><span style={tituloTexto}>Tel:</span> {datosApartado.cliente.telefono}</p>
        <p><span style={tituloTexto}>Vendedor:</span> {datosApartado.vendedor}</p>
      </div>
      <div style={{ borderTop: '1px dotted #000', margin: '5px 0' }}></div>

      <table style={tablaEstilos}>
        <thead>
          <tr>
            <th style={celdaEstilos}>Nombre</th>
            <th style={celdaEstilos}>Cant.</th>
            <th style={celdaEstilos}>Vr Total</th>
          </tr>
        </thead>
        <tbody>
          {datosApartado.productosVendidos.map((producto) => (
            <tr key={producto._id}>
              <td style={celdaEstilos}>{producto.nombre}</td>
              <td style={celdaEstilos}>{producto.cantidad}</td>
              <td style={celdaEstilos}>{producto.precio_total.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
            </tr>
          ))}
        </tbody>
      </table>
  
      <div style={{ borderTop: '1px dotted #000', margin: '5px 0' }}></div>

      <div>
          <p style={{fontSize: '12px', margin: '5px 0', textAlign: 'right'}}><span style={tituloTexto}>T. Factura:</span> {datosApartado.totalFactura.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
      </div>

      <div style={{ borderTop: '1px dotted #000', margin: '5px 0' }}></div>

      <p style={{fontSize: '12px', margin: '5px 0', textAlign: 'left'}}><span style={tituloTexto}>Historial Abonos</span></p>

      <table style={tablaEstilos}>
        <thead>
          <tr>
            <th style={celdaEstilos}>Fecha</th>
            <th style={celdaEstilos}>Abono</th>
          </tr>
        </thead>
        <tbody>
          {datosApartado.historialAbonos.map((abono) => (
            <tr key={abono._id}>
              <td style={celdaEstilos}>{formatDate(abono.fechaAbono)}</td>
              <td style={celdaEstilos}>{abono.abono.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ borderTop: '1px dotted #000', margin: '5px 0' }}></div>

      <div>
        <p style={{fontSize: '12px', margin: '5px 0', textAlign: 'right'}}><span style={tituloTexto}>Abono Efectivo:</span> {datosApartado.pagoEfectivo.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
        <p style={{fontSize: '12px', margin: '5px 0', textAlign: 'right'}}><span style={tituloTexto}>Abono Transferencia:</span> {datosApartado.pagoTransferencia.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
      </div>

      <div style={{ borderTop: '1px dotted #000', margin: '5px 0' }}></div>

      <div style={estilosDetallesPago}>
        <div style={{textAlign: 'left', width: '50%'}}>
          <p style={estilosTexto}>
            <span style={tituloTexto}>Saldo pendiente:</span> {datosApartado.saldoPendiente.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </p>
        </div>
        <div style={{textAlign: 'right', width: '50%'}}>          
          <p style={estilosTexto}>
            <span style={tituloTexto}>Saldo abonado:</span> {datosApartado.totalAbonado.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </p>
        </div>
      </div>

      <div style={{ borderTop: '1px dotted #000', margin: '5px 0' }}></div>

      <p>** GRACIAS POR VISITARNOS **</p>
      <p style={{fontSize: "11px"}}>Abrimos todos los días de 9:00 a.m. a 12:00 p.m y 2:00pm 8:00pm, nos dedicamos a ofrecerle un servicio excepcional y atención personalizada.</p>
      <img 
        src="../../assets/instagram_qr.png" 
        alt="qr" 
        style={imagenEstilosQR}
      />
      <p>!Visítanos en instagram!</p>

      <p style={{fontStyle: "italic", fontSize: "8px"}}>Create by Yespa</p>


    </div>
  );
};

export default ComprobanteImpresion;