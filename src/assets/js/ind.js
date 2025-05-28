// Al cargar la página, deshabilitar las opciones de mesas ocupadas
document.addEventListener("DOMContentLoaded", function () {
  const mesasOcupadas = JSON.parse(localStorage.getItem("mesasOcupadas")) || [];
  mesasOcupadas.forEach(function (mesa) {
    const option = document.querySelector(`#mesa option[value="${mesa}"]`);
    if (option) option.disabled = true;
  });
});

// Validar formulario de ingreso usuario y mesa
function validarFormulario() {
  const nombre = document.getElementById("nombre").value.trim();
  const mesa = document.getElementById("mesa").value;

  if (!nombre) {
    alert("Por favor, ingresa tu nombre.");
    return false;
  }
  if (!mesa) {
    alert("Por favor, selecciona una mesa.");
    return false;
  }

  let mesasOcupadas = JSON.parse(localStorage.getItem("mesasOcupadas")) || [];
  if (!mesasOcupadas.includes(mesa)) {
    mesasOcupadas.push(mesa);
  }
  localStorage.setItem("mesasOcupadas", JSON.stringify(mesasOcupadas));
  localStorage.setItem("usuario", nombre);
  localStorage.setItem("mesa", mesa);
  localStorage.removeItem("producto");
  window.location.href = "menu.html";

  return false; // evitar envío estándar del formulario
}

// Liberar mesa ocupada
function liberarMesa(mesaLiberada) {
  let mesasOcupadas = JSON.parse(localStorage.getItem("mesasOcupadas")) || [];

  mesasOcupadas = mesasOcupadas.filter(mesa => mesa !== mesaLiberada);

  localStorage.setItem("mesasOcupadas", JSON.stringify(mesasOcupadas));

  // Habilitar la opción visualmente si existe en el DOM
  const option = document.querySelector(`#mesa option[value="${mesaLiberada}"]`);
  if (option) option.disabled = false;

  alert(`Mesa ${mesaLiberada} ha sido liberada.`);
}

// Borrar todos los datos de localStorage y recargar página
function borrarLocalStorage() {
  if (confirm("¿Deseas borrar todos los datos guardados (mesas, usuario, etc.)?")) {
    localStorage.removeItem("mesasOcupadas");
    localStorage.removeItem("usuario");
    localStorage.removeItem("mesa");
    localStorage.removeItem("producto");

    location.reload();
  }
}
