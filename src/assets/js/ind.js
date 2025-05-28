// Al cargar la página, deshabilitar las opciones de mesas ocupadas (en formulario ingreso usuario)
document.addEventListener("DOMContentLoaded", function () {
  const mesasOcupadas = JSON.parse(localStorage.getItem("mesasOcupadas")) || [];
  mesasOcupadas.forEach(function (mesa) {
    const option = document.querySelector(`#mesa option[value="${mesa}"]`);
    if (option) option.disabled = true;
  });

  // Si estamos en la pantalla del mesero con el select de mesas, cargar opciones
  cargarOpcionesMesas();
  // Mostrar pedido de la mesa seleccionada inicialmente
  mostrarPedidoMesaSeleccionada();

  // Escuchar cambio en el select para actualizar pedido mostrado
  const selectMesa = document.getElementById("selectMesa");
  if (selectMesa) {
    selectMesa.addEventListener("change", mostrarPedidoMesaSeleccionada);
  }
});

// Validar formulario de ingreso usuario y mesa (sin cambios)
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

// Función para cargar opciones de mesas en el select del mesero
function cargarOpcionesMesas() {
  const select = document.getElementById("selectMesa");
  if (!select) return;

  // Obtener mesas ocupadas (pedidos en cocina)
  const pedidos = JSON.parse(localStorage.getItem("kitchenOrders")) || [];

  // Obtener lista única de mesas con pedidos
  const mesasConPedidos = [...new Set(pedidos.map(p => p.mesa))];

  // Limpiar select actual
  select.innerHTML = "";

  if (mesasConPedidos.length === 0) {
    const option = document.createElement("option");
    option.textContent = "No hay mesas con pedidos";
    option.disabled = true;
    option.selected = true;
    select.appendChild(option);
    return;
  }

  // Añadir opción por cada mesa con pedido
  mesasConPedidos.forEach(mesa => {
    const option = document.createElement("option");
    option.value = mesa;
    option.textContent = `Mesa ${mesa}`;
    select.appendChild(option);
  });

  // Seleccionar la primera mesa por defecto
  select.value = mesasConPedidos[0];
}

// Función para mostrar pedido filtrado por la mesa seleccionada
function mostrarPedidoMesaSeleccionada() {
  const contenedor = document.getElementById("pedidoMesero");
  const select = document.getElementById("selectMesa");
  if (!contenedor || !select) return;

  const mesaSeleccionada = select.value;
  const pedidos = JSON.parse(localStorage.getItem("kitchenOrders")) || [];

  // Filtrar pedidos solo de la mesa seleccionada
  const pedidoMesa = pedidos.find(p => p.mesa === mesaSeleccionada);

  // Limpiar contenedor
  contenedor.innerHTML = "";

  if (!pedidoMesa || !pedidoMesa.items || pedidoMesa.items.length === 0) {
    contenedor.innerHTML = "<p>No hay productos para esta mesa.</p>";
    return;
  }

  // Crear tabla para mostrar los productos
  const tabla = document.createElement("table");
  tabla.className = "table table-striped";

  tabla.innerHTML = `
    <thead>
      <tr><th>Producto</th><th>Ingredientes</th></tr>
    </thead>
  `;

  const tbody = document.createElement("tbody");

  pedidoMesa.items.forEach(item => {
    const tr = document.createElement("tr");
    const ingredientesTexto = item.ingredientes && item.ingredientes.length
      ? item.ingredientes.join(", ")
      : "Sin ingredientes";

    tr.innerHTML = `<td>${item.nombre}</td><td>${ingredientesTexto}</td>`;
    tbody.appendChild(tr);
  });

  tabla.appendChild(tbody);
  contenedor.appendChild(tabla);
}

// Liberar mesa ocupada (sin cambios)
function liberarMesa(mesaLiberada) {
  let mesasOcupadas = JSON.parse(localStorage.getItem("mesasOcupadas")) || [];

  mesasOcupadas = mesasOcupadas.filter(mesa => mesa !== mesaLiberada);

  localStorage.setItem("mesasOcupadas", JSON.stringify(mesasOcupadas));

  // Habilitar la opción visualmente si existe en el DOM
  const option = document.querySelector(`#mesa option[value="${mesaLiberada}"]`);
  if (option) option.disabled = false;

  alert(`Mesa ${mesaLiberada} ha sido liberada.`);

  // Refrescar opciones de mesas en el selector (por si estaba en mesero.html)
  cargarOpcionesMesas();
  mostrarPedidoMesaSeleccionada();
}

// Borrar todos los datos de localStorage y recargar página (sin cambios)
function borrarLocalStorage() {
  if (confirm("¿Deseas borrar todos los datos guardados (mesas, usuario, etc.)?")) {
    localStorage.removeItem("mesasOcupadas");
    localStorage.removeItem("usuario");
    localStorage.removeItem("mesa");
    localStorage.removeItem("producto");
    localStorage.removeItem("kitchenOrders");

    location.reload();
  }
}
