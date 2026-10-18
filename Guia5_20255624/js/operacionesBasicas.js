// Obtiene los dos operandos desde los campos del formulario
function obtenerNumeros() {
    const numero1 = parseFloat(document.querySelector("#idNumero1").value);
    const numero2 = parseFloat(document.querySelector("#idNumero2").value);
    return { numero1, numero2 };
}

// Muestra el resultado (o un mensaje de error) en el párrafo
function mostrarResultado(mensaje) {
    document.querySelector("#idResultado").innerHTML = mensaje;
}

// Valida los datos y ejecuta la operación recibida
function operar(simbolo, operacion) {
    const { numero1, numero2 } = obtenerNumeros();

    if (isNaN(numero1) || isNaN(numero2)) {
        mostrarResultado("Debe ingresar dos números válidos.");
        return;
    }

    if (simbolo === "/" && numero2 === 0) {
        mostrarResultado("No es posible dividir entre cero.");
        return;
    }

    mostrarResultado(`${numero1} ${simbolo} ${numero2} = ${operacion(numero1, numero2)}`);
}

document.querySelector("#idBtnSumar").addEventListener("click", () => operar("+", (a, b) => a + b));
document.querySelector("#idBtnRestar").addEventListener("click", () => operar("-", (a, b) => a - b));
document.querySelector("#idBtnMultiplicar").addEventListener("click", () => operar("*", (a, b) => a * b));
document.querySelector("#idBtnDividir").addEventListener("click", () => operar("/", (a, b) => a / b));
