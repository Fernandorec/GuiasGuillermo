const inputNombre = document.getElementById("idTxtNombre");
const inputApellido = document.getElementById("idTxtApellido");
const inputFechaNacimiento = document.getElementById("idTxtFechaNacimiento");
const inputRdMasculino = document.getElementById("idRdMasculino");
const inputRdFemenino = document.getElementById("idRdFemenino");
const cmbPais = document.getElementById("idCmbPais");
const inputDireccion = document.getElementById("idTxtDireccion");
const inputNombrePais = document.getElementById("idNombrePais");

const buttonAgregarPaciente = document.getElementById("idBtnAgregar");
const buttonLimpiarPaciente = document.getElementById("idBtnLimpiar");
const buttonMostrarPaciente = document.getElementById("idBtnMostrar");
const buttonAgregarPais = document.getElementById("idBtnAddPais");

const contenedorTabla = document.getElementById("idTablaPacientes");

const notificacion = document.getElementById("idNotificacion");
const toast = new bootstrap.Toast(notificacion);
const mensaje = document.getElementById("idMensaje");

const idModal = document.getElementById("idModal");

function leerStorage(clave) {
  try {
    return JSON.parse(localStorage.getItem(clave)) || [];
  } catch (error) {
    return [];
  }
}

function guardarStorage(clave, datos) {
  localStorage.setItem(clave, JSON.stringify(datos));
}

let arrayPaciente = leerStorage("pacientes");
let paisesNuevos = leerStorage("paises");
let posicionEditando = -1;

function escapar(texto) {
  return String(texto)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function mostrarMensaje(texto, tipo = "success") {
  mensaje.innerHTML = texto;
  notificacion.classList.remove("text-bg-success", "text-bg-danger", "text-bg-warning");
  notificacion.classList.add(`text-bg-${tipo}`);
  toast.show();
}

const limpiarForm = () => {
  inputNombre.value = "";
  inputApellido.value = "";
  inputFechaNacimiento.value = "";
  inputRdMasculino.checked = false;
  inputRdFemenino.checked = false;
  cmbPais.value = 0;
  inputDireccion.value = "";
  inputNombrePais.value = "";

  posicionEditando = -1;
  buttonAgregarPaciente.innerHTML = '<i class="bi bi-person-plus-fill"></i> Guardar Datos';
  buttonAgregarPaciente.classList.replace("btn-primary", "btn-success");

  inputNombre.focus();
};

const addPaciente = function () {
  let nombre = inputNombre.value.trim();
  let apellido = inputApellido.value.trim();
  let fechaNacimiento = inputFechaNacimiento.value;
  let sexo = "";
  if (inputRdMasculino.checked) {
    sexo = "Hombre";
  } else if (inputRdFemenino.checked) {
    sexo = "Mujer";
  }
  let pais = cmbPais.value;
  let labelPais = cmbPais.options[cmbPais.selectedIndex].text;
  let direccion = inputDireccion.value.trim();

  if (
    nombre != "" &&
    apellido != "" &&
    fechaNacimiento != "" &&
    sexo != "" &&
    pais != 0 &&
    direccion != ""
  ) {
    let paciente = {
      nombre: nombre,
      apellido: apellido,
      fechaNacimiento: fechaNacimiento,
      sexo: sexo,
      pais: labelPais,
      direccion: direccion,
    };

    if (posicionEditando == -1) {
      arrayPaciente.push(paciente);
      mostrarMensaje("Se ha registrado un nuevo paciente");
    } else {
      arrayPaciente[posicionEditando] = paciente;
      mostrarMensaje("Paciente actualizado correctamente");
    }

    guardarStorage("pacientes", arrayPaciente);
    limpiarForm();
    imprimirPacientes();
  } else {
    mostrarMensaje("Faltan campos por completar", "danger");
  }
};

function imprimirFilas() {
  let fila = "";

  arrayPaciente.forEach((paciente, i) => {
    fila += `<tr>
                <td scope="row" class="text-center fw-bold">${i + 1}</td>
                <td>${escapar(paciente.nombre)}</td>
                <td>${escapar(paciente.apellido)}</td>
                <td>${escapar(paciente.fechaNacimiento)}</td>
                <td>${escapar(paciente.sexo)}</td>
                <td>${escapar(paciente.pais)}</td>
                <td>${escapar(paciente.direccion)}</td>
                <td class="text-center">
                    <button type="button" class="btn btn-primary" data-accion="editar" data-index="${i}" title="Editar">
                        <i class="bi bi-pencil-square"></i>
                    </button>
                    <button type="button" class="btn btn-danger" data-accion="eliminar" data-index="${i}" title="Eliminar">
                        <i class="bi bi-trash3-fill"></i>
                    </button>
                </td>
            </tr>`;
  });
  return fila;
}

const imprimirPacientes = () => {
  if (arrayPaciente.length == 0) {
    contenedorTabla.innerHTML = "Ninguno";
    return;
  }

  let tabla = `<div class="table-responsive">
                <table class="table table-striped table-hover table-bordered">
                    <tr>
                        <th scope="col" class="text-center" style="width:5%">#</th>
                        <th scope="col" class="text-center" style="width:15%">Nombre</th>
                        <th scope="col" class="text-center" style="width:15%">Apellido</th>
                        <th scope="col" class="text-center" style="width:10%">Fecha nacimiento</th>
                        <th scope="col" class="text-center" style="width:10%">Sexo</th>
                        <th scope="col" class="text-center" style="width:10%">Pais</th>
                        <th scope="col" class="text-center" style="width:25%">Dirección</th>
                        <th scope="col" class="text-center" style="width:10%">Opciones</th>
                    </tr>
                    ${imprimirFilas()}
                </table>
            </div>`;
  contenedorTabla.innerHTML = tabla;
};

function editarPaciente(i) {
  let paciente = arrayPaciente[i];

  inputNombre.value = paciente.nombre;
  inputApellido.value = paciente.apellido;
  inputFechaNacimiento.value = paciente.fechaNacimiento;
  inputRdMasculino.checked = paciente.sexo == "Hombre";
  inputRdFemenino.checked = paciente.sexo == "Mujer";
  inputDireccion.value = paciente.direccion;

  cmbPais.value = 0;
  for (let opcion of cmbPais.options) {
    if (opcion.text == paciente.pais) {
      cmbPais.value = opcion.value;
    }
  }

  posicionEditando = i;
  buttonAgregarPaciente.innerHTML = '<i class="bi bi-check-circle"></i> Actualizar Datos';
  buttonAgregarPaciente.classList.replace("btn-success", "btn-primary");

  inputNombre.focus();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function eliminarPaciente(i) {
  let paciente = arrayPaciente[i];

  if (confirm(`¿Desea eliminar al paciente ${paciente.nombre} ${paciente.apellido}?`)) {
    arrayPaciente.splice(i, 1);
    guardarStorage("pacientes", arrayPaciente);

    if (posicionEditando == i) {
      limpiarForm();
    } else if (posicionEditando > i) {
      posicionEditando--;
    }

    imprimirPacientes();
    mostrarMensaje("Paciente eliminado correctamente", "warning");
  }
}

contenedorTabla.addEventListener("click", (e) => {
  let boton = e.target.closest("button[data-accion]");
  if (!boton) return;

  let i = Number(boton.dataset.index);
  if (boton.dataset.accion == "editar") {
    editarPaciente(i);
  } else {
    eliminarPaciente(i);
  }
});

let contadorGlobalOption = cmbPais.children.length;

function agregarOptionPais(nombrePais) {
  let option = document.createElement("option");
  option.textContent = nombrePais;
  option.value = contadorGlobalOption + 1;
  contadorGlobalOption++;
  cmbPais.appendChild(option);
}

paisesNuevos.forEach(agregarOptionPais);

const addPais = () => {
  let paisNew = inputNombrePais.value.trim();

  if (paisNew != "") {
    agregarOptionPais(paisNew);
    paisesNuevos.push(paisNew);
    guardarStorage("paises", paisesNuevos);
    mostrarMensaje("Pais agregado correctamente");
  } else {
    mostrarMensaje("Faltan campos por completar", "danger");
  }
};

buttonLimpiarPaciente.onclick = () => {
  limpiarForm();
};

buttonAgregarPaciente.onclick = () => {
  addPaciente();
};

buttonMostrarPaciente.onclick = () => {
  imprimirPacientes();
};

buttonAgregarPais.onclick = () => {
  addPais();
};

idModal.addEventListener("shown.bs.modal", () => {
  inputNombrePais.value = "";
  inputNombrePais.focus();
});

limpiarForm();
if (arrayPaciente.length > 0) {
  imprimirPacientes();
}
