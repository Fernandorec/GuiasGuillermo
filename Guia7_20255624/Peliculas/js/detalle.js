import { URL_BASE, obtenerDatos } from "./api.js";
import { vaciarContenedor } from "./utilidades.js";

const elementoModal = document.getElementById("idModalDetalle");
const modalDetalle = new bootstrap.Modal(elementoModal, {});
const tituloDetalle = document.getElementById("idTituloDetalle");
const cuerpoDetalle = document.getElementById("idCuerpoDetalle");

const crearLinea = function (etiqueta, valor) {
  const linea = document.createElement("p");
  linea.setAttribute("class", "mb-2");

  const negrita = document.createElement("strong");
  negrita.textContent = etiqueta + ": ";

  const contenido = document.createElement("span");
  contenido.textContent = valor;

  linea.appendChild(negrita);
  linea.appendChild(contenido);
  return linea;
};

const mostrarDetalle = function (info) {
  vaciarContenedor(cuerpoDetalle);

  const fila = document.createElement("div");
  fila.setAttribute("class", "row g-3");

  const columnaImagen = document.createElement("div");
  columnaImagen.setAttribute("class", "col-md-4");

  if (info.primaryImage && info.primaryImage.url) {
    const imagen = document.createElement("img");
    imagen.setAttribute("class", "img-fluid rounded");
    imagen.setAttribute("src", info.primaryImage.url);
    imagen.setAttribute("alt", tituloDetalle.textContent);
    columnaImagen.appendChild(imagen);
  } else {
    const sinImagen = document.createElement("div");
    sinImagen.setAttribute(
      "class",
      "bg-secondary text-white d-flex align-items-center justify-content-center rounded"
    );
    sinImagen.style.height = "300px";
    sinImagen.textContent = "Sin imagen";
    columnaImagen.appendChild(sinImagen);
  }

  const columnaTexto = document.createElement("div");
  columnaTexto.setAttribute("class", "col-md-8");

  let anio = "No disponible";
  if (info.releaseYear && info.releaseYear.year) {
    anio = info.releaseYear.year;
  }

  let calificacion = "Sin calificación";
  if (info.ratingsSummary && info.ratingsSummary.aggregateRating) {
    calificacion = `${info.ratingsSummary.aggregateRating} / 10 (${info.ratingsSummary.voteCount} votos)`;
  }

  let duracion = "No disponible";
  if (info.runtime && info.runtime.seconds) {
    const horas = Math.floor(info.runtime.seconds / 3600);
    const minutos = Math.floor((info.runtime.seconds % 3600) / 60);
    duracion = `${horas} h ${minutos} min`;
  }

  let clasificacion = "No disponible";
  if (info.certificate && info.certificate.rating) {
    clasificacion = info.certificate.rating;
  }

  let metascore = "No disponible";
  if (info.metacritic && info.metacritic.metascore) {
    metascore = info.metacritic.metascore.score;
  }

  const generos = [];
  if (info.interests && info.interests.edges) {
    for (let i = 0; i < info.interests.edges.length; i++) {
      const nodo = info.interests.edges[i].node;
      if (nodo.secondaryText && nodo.secondaryText.text == "Genre") {
        generos.push(nodo.primaryText.text);
      }
    }
  }
  const textoGeneros = generos.length > 0 ? generos.join(", ") : "No disponible";

  let sinopsis = "Sin sinopsis disponible";
  if (info.plot && info.plot.plotText && info.plot.plotText.plainText) {
    sinopsis = info.plot.plotText.plainText;
  }

  columnaTexto.appendChild(crearLinea("Año", anio));
  columnaTexto.appendChild(crearLinea("Calificación", calificacion));
  columnaTexto.appendChild(crearLinea("Duración", duracion));
  columnaTexto.appendChild(crearLinea("Clasificación", clasificacion));
  columnaTexto.appendChild(crearLinea("Metascore", metascore));
  columnaTexto.appendChild(crearLinea("Géneros", textoGeneros));
  columnaTexto.appendChild(crearLinea("Sinopsis", sinopsis));

  fila.appendChild(columnaImagen);
  fila.appendChild(columnaTexto);
  cuerpoDetalle.appendChild(fila);
};

export const verDetalle = async function (id, titulo) {
  tituloDetalle.textContent = titulo;
  vaciarContenedor(cuerpoDetalle);

  const cargando = document.createElement("p");
  cargando.setAttribute("class", "text-center my-4");
  cargando.textContent = "Cargando detalles...";
  cuerpoDetalle.appendChild(cargando);

  modalDetalle.show();

  try {
    const datos = await obtenerDatos(`${URL_BASE}/title/v2/get-overview?tconst=${id}`);
    let info = null;
    if (datos.data && datos.data.title) {
      info = datos.data.title;
    } else if (datos.title) {
      info = datos.title;
    }

    if (info == null) {
      throw new Error("No se recibieron datos de la película.");
    }
    mostrarDetalle(info);
  } catch (error) {
    vaciarContenedor(cuerpoDetalle);
    const alerta = document.createElement("div");
    alerta.setAttribute("class", "alert alert-danger");
    if (error instanceof TypeError) {
      alerta.textContent = "No se pudo conectar. Revise su conexión a internet.";
    } else {
      alerta.textContent = error.message;
    }
    cuerpoDetalle.appendChild(alerta);
  }
};
