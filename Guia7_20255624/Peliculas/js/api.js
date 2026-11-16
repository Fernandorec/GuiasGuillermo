const CLAVE_API = "2883579fe0msh3c36111a72a97d4p123c24jsnbd5397933466";
const HOST_API = "online-movie-database.p.rapidapi.com";
export const URL_BASE = `https://${HOST_API}`;

const opcionesFetch = {
  method: "GET",
  headers: {
    "x-rapidapi-key": CLAVE_API,
    "x-rapidapi-host": HOST_API,
  },
};

export const obtenerDatos = async function (url) {
  const respuesta = await fetch(url, opcionesFetch);

  if (!respuesta.ok) {
    if (respuesta.status == 429) {
      throw new Error("Se agotaron las peticiones permitidas. Intente más tarde.");
    }
    if (respuesta.status == 401 || respuesta.status == 403) {
      throw new Error("La clave de la API no es válida o no tiene suscripción.");
    }
    throw new Error(`Error del servidor (código ${respuesta.status}).`);
  }

  return await respuesta.json();
};
