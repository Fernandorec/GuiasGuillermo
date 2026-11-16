import { mostrarMensaje } from "./utilidades.js";
import { buscarPeliculas } from "./listado.js";

const formBuscar = document.getElementById("idFormBuscar");
const inputBuscar = document.getElementById("idBuscar");

formBuscar.addEventListener("submit", function (event) {
  event.preventDefault();
  const texto = inputBuscar.value.trim();

  if (texto == "") {
    mostrarMensaje("Escriba el título de una película para buscar.", "warning");
    return;
  }
  buscarPeliculas(texto);
});
