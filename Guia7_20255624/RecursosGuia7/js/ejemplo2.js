const formulario = document.forms["frmRegistro"];
const button = document.forms["frmRegistro"].elements["btnRegistro"];

const modal = new bootstrap.Modal(document.getElementById("idModal"), {});

const bodyModal = document.getElementById("idBodyModal");
const tituloModal = document.getElementById("modalLabel");
const expresionCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const inputNombre = document.getElementById("idNombre");
const inputApellidos = document.getElementById("idApellidos");
const inputFechaNacimiento = document.getElementById("idFechaNac");
const inputCorreo = document.getElementById("idCorreo");
const inputPassword = document.getElementById("idPassword");
const inputPasswordRepetir = document.getElementById("idPasswordRepetir");
const selectPais = document.getElementById("idCmPais");
const inputArchivo = document.getElementById("idArchivo");
const listaCheckboxes = document.querySelectorAll('input[type="checkbox"]');
const listaRadios = document.querySelectorAll('input[name="idRdCarrera"]');


const obtenerFechaHoy = function () {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, "0");
  const dia = String(hoy.getDate()).padStart(2, "0");
  return `${hoy.getFullYear()}-${mes}-${dia}`;
};

const marcarError = function (elemento) {
  elemento.className = elemento.className + " is-invalid";
};

const limpiarErrores = function () {
  const camposConError = formulario.querySelectorAll(".is-invalid");
  for (let i = 0; i < camposConError.length; i++) {
    camposConError[i].className = camposConError[i].className.replace(
      " is-invalid",
      "",
    );
  }
  const alertaAnterior = document.getElementById("idAlertaErrores");
  if (alertaAnterior) {
    alertaAnterior.parentNode.removeChild(alertaAnterior);
  }
};

const mostrarErrores = function (listaErrores) {
  const alerta = document.createElement("div");
  alerta.setAttribute("id", "idAlertaErrores");
  alerta.setAttribute("class", "alert alert-danger");

  const lista = document.createElement("ul");
  lista.setAttribute("class", "mb-0");
  for (let i = 0; i < listaErrores.length; i++) {
    const item = document.createElement("li");
    item.textContent = listaErrores[i];
    lista.appendChild(item);
  }

  alerta.appendChild(lista);
  formulario.insertBefore(alerta, formulario.firstChild);
};

const obtenerTextoLabel = function (input) {
  return document.querySelector(`label[for="${input.id}"]`).textContent.trim();
};

const crearFila = function (etiqueta, valor) {
  const fila = document.createElement("tr");
  const celdaEtiqueta = document.createElement("th");
  celdaEtiqueta.textContent = etiqueta;
  const celdaValor = document.createElement("td");
  celdaValor.textContent = valor;
  fila.appendChild(celdaEtiqueta);
  fila.appendChild(celdaValor);
  return fila;
};

const mostrarResumen = function () {
  let interesesMarcados = [];
  for (let i = 0; i < listaCheckboxes.length; i++) {
    if (listaCheckboxes[i].checked) {
      interesesMarcados.push(obtenerTextoLabel(listaCheckboxes[i]));
    }
  }

  let carreraElegida = "";
  for (let i = 0; i < listaRadios.length; i++) {
    if (listaRadios[i].checked) {
      carreraElegida = obtenerTextoLabel(listaRadios[i]);
    }
  }

  const paisElegido = selectPais.options[selectPais.selectedIndex].text;

  let nombreArchivo = "Sin archivo seleccionado";
  if (inputArchivo.files.length > 0) {
    nombreArchivo = inputArchivo.files[0].name;
  }

  const tabla = document.createElement("table");
  tabla.setAttribute("class", "table table-striped table-bordered mb-0");
  const cuerpoTabla = document.createElement("tbody");
  cuerpoTabla.appendChild(crearFila("Nombres", inputNombre.value.trim()));
  cuerpoTabla.appendChild(crearFila("Apellidos", inputApellidos.value.trim()));
  cuerpoTabla.appendChild(
    crearFila("Fecha de nacimiento", inputFechaNacimiento.value),
  );
  cuerpoTabla.appendChild(
    crearFila("Correo electrónico", inputCorreo.value.trim()),
  );
  cuerpoTabla.appendChild(
    crearFila("Contraseña", "*".repeat(inputPassword.value.length)),
  );
  cuerpoTabla.appendChild(crearFila("Intereses", interesesMarcados.join(", ")));
  cuerpoTabla.appendChild(crearFila("Carrera", carreraElegida));
  cuerpoTabla.appendChild(crearFila("País de origen", paisElegido));
  cuerpoTabla.appendChild(crearFila("Avatar", nombreArchivo));
  tabla.appendChild(cuerpoTabla);

  tituloModal.textContent = "Datos del registro";
  while (bodyModal.firstChild) {
    bodyModal.removeChild(bodyModal.firstChild);
  }
  bodyModal.appendChild(tabla);
  modal.show();
};

// Revisa que un campo no esté vacío
const revisarVacio = function (input, nombreCampo, listaErrores) {
  if (input.value.trim() == "") {
    listaErrores.push(`El campo "${nombreCampo}" no puede estar vacío.`);
    marcarError(input);
  }
};

const validarFormulario = function () {
  limpiarErrores();
  const listaErrores = [];

  // a. Campos no vacíos
  revisarVacio(inputNombre, "Nombres", listaErrores);
  revisarVacio(inputApellidos, "Apellidos", listaErrores);
  revisarVacio(inputFechaNacimiento, "Fecha de nacimiento", listaErrores);
  revisarVacio(inputCorreo, "Correo electrónico", listaErrores);
  revisarVacio(inputPassword, "Contraseña", listaErrores);
  revisarVacio(inputPasswordRepetir, "Repetir contraseña", listaErrores);

  // b. Fecha no mayor a hoy
  if (
    inputFechaNacimiento.value != "" &&
    inputFechaNacimiento.value > obtenerFechaHoy()
  ) {
    listaErrores.push("La fecha de nacimiento no puede ser posterior a hoy.");
    marcarError(inputFechaNacimiento);
  }

  // c. Correo válido (expresión regular)
  if (
    inputCorreo.value.trim() != "" &&
    !expresionCorreo.test(inputCorreo.value.trim())
  ) {
    listaErrores.push("El correo electrónico no tiene un formato válido.");
    marcarError(inputCorreo);
  }

  // d. Contraseñas iguales
  if (
    inputPassword.value != "" &&
    inputPasswordRepetir.value != "" &&
    inputPassword.value != inputPasswordRepetir.value
  ) {
    listaErrores.push("Las contraseñas no coinciden.");
    marcarError(inputPassword);
    marcarError(inputPasswordRepetir);
  }

  // e. Al menos un interés
  let cantidadIntereses = 0;
  for (let i = 0; i < listaCheckboxes.length; i++) {
    if (listaCheckboxes[i].checked) {
      cantidadIntereses++;
    }
  }
  if (cantidadIntereses == 0) {
    listaErrores.push("Seleccione al menos un interés.");
    for (let i = 0; i < listaCheckboxes.length; i++) {
      marcarError(listaCheckboxes[i]);
    }
  }

  // f. Una carrera
  let hayCarreraSeleccionada = false;
  for (let i = 0; i < listaRadios.length; i++) {
    if (listaRadios[i].checked) {
      hayCarreraSeleccionada = true;
    }
  }
  if (!hayCarreraSeleccionada) {
    listaErrores.push("Seleccione la carrera que estudia.");
    for (let i = 0; i < listaRadios.length; i++) {
      marcarError(listaRadios[i]);
    }
  }

  // g. País
  if (selectPais.selectedIndex == 0) {
    listaErrores.push("Seleccione un país de origen.");
    marcarError(selectPais);
  }

  if (listaErrores.length > 0) {
    mostrarErrores(listaErrores);
  } else {
    mostrarResumen();
  }
};

button.onclick = () => {
  validarFormulario();
};
