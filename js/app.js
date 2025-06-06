
document.addEventListener('DOMContentLoaded', () => {
  const select = document.getElementById('tipoPrestamo');

  fetch('data/prestamos.json')
    .then(res => res.json())
    .then(data => {
      data.forEach(item => {
        const option = document.createElement('option');
        option.value = item.tasa;
        option.textContent = item.tipo;
        select.appendChild(option);
      });
    });

  document.getElementById('formulario').addEventListener('submit', function(e) {
    e.preventDefault();
    const monto = parseFloat(document.getElementById('monto').value);
    const plazo = parseInt(document.getElementById('plazo').value);
    const tasa = parseFloat(document.getElementById('tipoPrestamo').value);
    const edad = parseInt(document.getElementById('edad').value);
    const ingreso = parseFloat(document.getElementById('ingreso').value);

    if (edad < 18) {
      Swal.fire('Error', 'Debes ser mayor de edad para solicitar un préstamo.', 'error');
      return;
    }

    const cuota = calcularCuota(monto, tasa / 12, plazo);
    if (cuota > ingreso * 0.4) {
      Swal.fire('Rechazado', 'La cuota supera el 40% de tus ingresos.', 'warning');
      return;
    }

    const total = cuota * plazo;

    document.getElementById('resultado').innerHTML = `
      <h3>Resultado de la simulación</h3>
      <p><strong>Cuota mensual:</strong> $${cuota.toFixed(2)}</p>
      <p><strong>Total a pagar:</strong> $${total.toFixed(2)}</p>
      <p><strong>Tasa anual:</strong> ${(tasa * 100).toFixed(2)}%</p>
    `;
  });

  function calcularCuota(monto, tasaMensual, cuotas) {
    return monto * (tasaMensual * Math.pow(1 + tasaMensual, cuotas)) / 
           (Math.pow(1 + tasaMensual, cuotas) - 1);
  }
});
