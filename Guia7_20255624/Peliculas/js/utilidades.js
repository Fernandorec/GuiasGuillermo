const divMensaje = document.getElementById("idMensaje");

export const vaciarContenedor = function (contenedor) {
  while (contenedor.firstChild) {
    contenedor.removeChild(contenedor.firstChild);
  }
};

export const mostrarMensaje = function (texto, tipo) {
  vaciarContenedor(divMensaje);
  const alerta = document.createElement("div");
  alerta.setAttribute("class", `alert alert-${tipo}`);
  alerta.textContent = texto;
  divMensaje.appendChild(alerta);
};

export const ocultarMensaje = function () {
  vaciarContenedor(divMensaje);
};
