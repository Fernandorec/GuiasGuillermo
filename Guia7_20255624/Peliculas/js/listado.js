import { URL_BASE, obtenerDatos } from "./api.js";
import { vaciarContenedor, mostrarMensaje, ocultarMensaje } from "./utilidades.js";
import { verDetalle } from "./detalle.js";

const botonBuscar = document.getElementById("idBtnBuscar");
const divListado = document.getElementById("idListado");

const crearTarjeta = function (pelicula) {
  const columna = document.createElement("div");
  columna.setAttribute("class", "col-6 col-md-4 col-lg-3");

  const tarjeta = document.createElement("div");
  tarjeta.setAttribute("class", "card h-100 tarjeta-pelicula");

  if (pelicula.i && pelicula.i.imageUrl) {
    const imagen = document.createElement("img");
    imagen.setAttribute("class", "card-img-top");
    imagen.setAttribute("src", pelicula.i.imageUrl);
    imagen.setAttribute("alt", pelicula.l);
    tarjeta.appendChild(imagen);
  } else {
    const sinImagen = document.createElement("div");
    sinImagen.setAttribute(
      "class",
      "bg-secondary text-white d-flex align-items-center justify-content-center"
    );
    sinImagen.style.height = "320px";
    sinImagen.textContent = "Sin imagen";
    tarjeta.appendChild(sinImagen);
  }

  const cuerpo = document.createElement("div");
  cuerpo.setAttribute("class", "card-body");

  const titulo = document.createElement("h5");
  titulo.setAttribute("class", "card-title");
  titulo.textContent = pelicula.l;

  const anio = document.createElement("p");
  anio.setAttribute("class", "card-text mb-1");
  anio.textContent = pelicula.y ? pelicula.y : "Año desconocido";

  const reparto = document.createElement("p");
  reparto.setAttribute("class", "card-text text-muted small");
  reparto.textContent = pelicula.s ? pelicula.s : "";

  cuerpo.appendChild(titulo);
  cuerpo.appendChild(anio);
  cuerpo.appendChild(reparto);
  tarjeta.appendChild(cuerpo);
  columna.appendChild(tarjeta);

  tarjeta.onclick = function () {
    verDetalle(pelicula.id, pelicula.l);
  };

  return columna;
};

export const buscarPeliculas = async function (texto) {
  vaciarContenedor(divListado);
  mostrarMensaje("Cargando resultados...", "info");
  botonBuscar.disabled = true;

  try {
    const datos = await obtenerDatos(
      `${URL_BASE}/auto-complete?q=${encodeURIComponent(texto)}`
    );

    const lista = datos.d || [];
    const peliculas = [];
    for (let i = 0; i < lista.length; i++) {
      if (lista[i].id.startsWith("tt")) {
        peliculas.push(lista[i]);
      }
    }

    if (peliculas.length == 0) {
      mostrarMensaje(`No se encontraron resultados para "${texto}".`, "warning");
      return;
    }

    ocultarMensaje();
    for (let i = 0; i < peliculas.length; i++) {
      divListado.appendChild(crearTarjeta(peliculas[i]));
    }
  } catch (error) {
    if (error instanceof TypeError) {
      mostrarMensaje("No se pudo conectar. Revise su conexión a internet.", "danger");
    } else {
      mostrarMensaje(error.message, "danger");
    }
  } finally {
    botonBuscar.disabled = false;
  }
};
