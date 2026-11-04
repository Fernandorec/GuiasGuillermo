const campos = {
  carnet: {
    id: "idCarnet",
    nombre: "Carnet",
    regex: /^[A-Za-z]{2}\d{3}$/,
    explicacion: "2 letras + 3 dígitos (AB001)",
  },
  nombre: {
    id: "idNombreCompleto",
    nombre: "Nombre completo",
    regex: /^\p{L}{2,}(?:\s+\p{L}{2,})+$/u,
    explicacion: "Palabra de 2+ letras, seguida de 1 o más palabras separadas por espacios",
  },
  dui: {
    id: "idDui",
    nombre: "DUI",
    regex: /^\d{8}-\d$/,
    explicacion: "8 dígitos, guion, 1 dígito",
  },
  nit: {
    id: "idNit",
    nombre: "NIT",
    regex: /^\d{4}-\d{6}-\d{3}-\d$/,
    explicacion: "4 dígitos, guion, 6 dígitos, guion, 3 dígitos, guion, 1 dígito",
  },
  fecha: {
    id: "idFechaNacimiento",
    nombre: "Fecha de nacimiento",
    regex: /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/(\d{4})$/,
    explicacion: "Día (01-31) / mes (01-12) / año (4 dígitos)",
  },
  correo: {
    id: "idCorreo",
    nombre: "Correo electrónico",
    regex: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/,
    explicacion: "Usuario, @, dominio y extensión de 2+ letras",
  },
  edad: {
    id: "idEdad",
    nombre: "Edad",
    regex: /^\d{1,3}$/,
    explicacion: "Solo dígitos, de 1 a 3",
  },
};

const formulario = document.getElementById("idFormEstudiante");
const resultado = document.getElementById("idResultado");
const feedbackFecha = document.getElementById("idFechaFeedback");

function validarFecha(texto) {
  const partes = campos.fecha.regex.exec(texto);
  if (!partes) return "Formato: dd/mm/aaaa  Ej: 25/12/2001";

  const dia = Number(partes[1]);
  const mes = Number(partes[2]);
  const anio = Number(partes[3]);
  const fecha = new Date(anio, mes - 1, dia);

  if (fecha.getDate() !== dia || fecha.getMonth() !== mes - 1) {
    return "La fecha no existe en el calendario";
  }
  if (fecha > new Date()) return "La fecha no puede ser futura";
  if (anio < 1900) return "El año debe ser 1900 o posterior";
  return "";
}

function validarCampo(clave) {
  const campo = campos[clave];
  const input = document.getElementById(campo.id);
  const valor = input.value.trim();
  let error = "";

  if (clave === "fecha") {
    error = validarFecha(valor);
    if (error) feedbackFecha.textContent = error;
  } else if (!campo.regex.test(valor)) {
    error = "Formato no válido";
  }

  input.classList.toggle("is-valid", error === "");
  input.classList.toggle("is-invalid", error !== "");
  return error;
}

document.getElementById(campos.edad.id).addEventListener("input", (e) => {
  e.target.value = e.target.value.replace(/\D/g, "");
});

document.getElementById(campos.carnet.id).addEventListener("input", (e) => {
  e.target.value = e.target.value.toUpperCase();
});

for (const clave in campos) {
  document.getElementById(campos[clave].id).addEventListener("input", () => {
    validarCampo(clave);
  });
}

document.getElementById("idBtnValidar").addEventListener("click", () => {
  const incorrectos = [];

  for (const clave in campos) {
    if (validarCampo(clave) !== "") {
      incorrectos.push(campos[clave].nombre);
    }
  }

  if (incorrectos.length === 0) {
    resultado.innerHTML = `<div class="alert alert-success mb-0">Todos los datos de la ficha son válidos.</div>`;
  } else {
    resultado.innerHTML = `<div class="alert alert-danger mb-0">Corrija los siguientes campos: <strong>${incorrectos.join(", ")}</strong>.</div>`;
  }
});

document.getElementById("idBtnLimpiar").addEventListener("click", () => {
  formulario.reset();
  formulario.querySelectorAll(".is-valid, .is-invalid").forEach((input) => {
    input.classList.remove("is-valid", "is-invalid");
  });
  resultado.innerHTML = "";
  document.getElementById(campos.carnet.id).focus();
});

let filas = "";
for (const clave in campos) {
  const campo = campos[clave];
  filas += `<tr>
    <td>${campo.nombre}</td>
    <td><code>${String(campo.regex).replace(/</g, "&lt;")}</code></td>
    <td>${campo.explicacion}</td>
  </tr>`;
}
document.getElementById("idTablaRegex").innerHTML = filas;
