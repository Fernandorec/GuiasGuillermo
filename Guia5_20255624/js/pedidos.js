let pedidos = [];

function registrarPedido() {
  let nombreProducto = prompt("Ingresa el nombre del producto");

  if (nombreProducto === null) return;

  let precioUnitario = parseFloat(prompt("Ingresa el precio unitario"));
  let cantidadSolicitada = Number(prompt("Ingresa la cantidad solicitada"));

  if (
    nombreProducto.trim() === "" || !Number.isFinite(precioUnitario) || precioUnitario <= 0 || !Number.isInteger(cantidadSolicitada) || cantidadSolicitada <= 0
  ) {
    alert("Error: ingresa datos válidos.");
    return;
  }

  let pedido = {
    producto: nombreProducto.trim(),
    precio: precioUnitario,
    cantidad: cantidadSolicitada,
  };

  pedidos.push(pedido);

  mostrarPedidos(pedidos); //Luego de leer los requerimientos abajo  hare otra funcion para mostrarlos xd
}

function calcularSubtotales(listaPedidos) {
  return listaPedidos.map(function (pedido) {
    return {
      ...pedido,
      subtotal: pedido.precio * pedido.cantidad,
    };
  });
}

function filtrarPedidos(precioMaximo) {
  return pedidos.filter(function (pedido) {
    return pedido.precio <= precioMaximo;
  });
}

function calcularTotales(listaPedidos) {
  return listaPedidos.reduce(
    function (totales, pedido) {
      totales.unidades += pedido.cantidad;
      totales.monto += pedido.precio * pedido.cantidad;

      return totales;
    },
    { unidades: 0, monto: 0 },
  );
}

function mostrarPedidos(listaPedidos) {
  let tabla = document.getElementById("tablaPedidos");
  let pedidosConSubtotal = calcularSubtotales(listaPedidos);

  tabla.innerHTML = pedidosConSubtotal
    .map(function (pedido) {
      return `
            <tr>
                <td>${pedido.producto}</td>
                <td>$${pedido.precio.toFixed(2)}</td>
                <td>${pedido.cantidad}</td>
                <td>$${pedido.subtotal.toFixed(2)}</td>
            </tr>
        `;
    })
    .join("");

  let totales = calcularTotales(listaPedidos);

  document.getElementById("totalUnidades").textContent = totales.unidades;
  document.getElementById("montoTotal").textContent = totales.monto.toFixed(2);
}

function aplicarFiltro() {
  let campoPrecio = document.getElementById("precioMaximo");
  let precioMaximo = Number(campoPrecio.value);

  if (
    campoPrecio.value.trim() === "" ||
    !Number.isFinite(precioMaximo) ||
    precioMaximo <= 0
  ) {
    alert("Ingresa un precio máximo válido.");
    return;
  }

  let pedidosFiltrados = filtrarPedidos(precioMaximo);

  mostrarPedidos(pedidosFiltrados);
}

function mostrarTodos() {
  mostrarPedidos(pedidos);
}

function limpiarPedidos() {
  pedidos = [];

  mostrarPedidos(pedidos);

  document.getElementById("precioMaximo").value = "";
}

document
  .getElementById("btnAgregar")
  .addEventListener("click", registrarPedido);
document.getElementById("btnFiltrar").addEventListener("click", aplicarFiltro);
document
  .getElementById("btnMostrarTodos")
  .addEventListener("click", mostrarTodos);
document.getElementById("btnLimpiar").addEventListener("click", limpiarPedidos);
