// ── Datos de productos con stock y mínimos ────────────────────────────
const productos = [
  { id: 1, nombre: "Hamburguesa Clásica", imagen: "img/CLASICA.png", ingredientes: ["Lechuga", "Tomate", "Queso", "Cebolla" , "Carne" , "Catsup" , "Pan"], stock: 10, minStock: 3 },
  { id: 2, nombre: "Hamburguesa BBQ", imagen: "img/BBQ.png", ingredientes: ["Bacon", "Lechuga", "Tomate", "Cebolla" , "Carne" , "Cebolla caramelizada", "Salsa BBQ" , "Pan"], stock: 5, minStock: 2 },
  { id: 3, nombre: "Hamburguesa Hawaiana", imagen: "img/HAWAIANA.png", ingredientes: ["Bacon", "Queso", "Cebolla caramelizada", "Salsa BBQ" , "Lechuga", "Tomate", "Cebolla" , "Carne" , "Pan"], stock: 5, minStock: 2 },
  { id: 4, nombre: "Hamburguesa Doble", imagen: "img/DOBLE.png", ingredientes: ["Lechuga", "Tomate", "Queso", "Cebolla" , "Carne x2" , "Catsup" , "Pan"], stock: 5, minStock: 2 },
  { id: 5, nombre: "Hamburguesa Mixta", imagen: "img/MIXTA.png", ingredientes: ["Lechuga", "Tomate", "Queso", "Cebolla" , "Carne" , "Pollo" , "Catsup" , "Pan"], stock: 5, minStock: 2 },
  { id: 6, nombre: "Hamburguesa de pollo", imagen: "img/POLLO.png", ingredientes: ["Lechuga", "Tomate", "Queso", "Cebolla" , "Pollo" , "Catsup" , "Pan"], stock: 5, minStock: 2 },
  { id: 7, nombre: "Hamburguesa de Vegetariana", imagen: "img/VEGETARIANA.png", ingredientes: ["Lechuga", "Tomate", "Queso", "Cebolla" , "Hongo" , "Mantequilla" , "Pan"], stock: 5, minStock: 2 },
  { id: 8, nombre: "Banderia", imagen: "img/ban.png", ingredientes: ["Lechuga", "Tomate", "Queso", "Cebolla" , "Hongo" , "Mantequilla" , "Pan"], stock: 5, minStock: 2 },
  { id: 9, nombre: "Hot dog", imagen: "img/HOT DOG.png", ingredientes: ["Cebolla", "Tomate", "Catsup", "Mostaza" , "Salchica" , "Pan"], stock: 5, minStock: 2 },
  { id: 10, nombre: "Salchipapas", imagen: "img/SALCHI.png", ingredientes: ["Sazonador", "Papas", "Salchicha"], stock: 5, minStock: 2 },
  { id: 11, nombre: "Orden de papas", imagen: "img/PAPAS.png", ingredientes: ["Sazonador", "Papas"], stock: 5, minStock: 2 },
  { id: 12, nombre: "Coca-Cola", imagen: "img/COCA.png", ingredientes: [], stock: 20, minStock: 5 },
  { id: 13, nombre: "Sprite", imagen: "img/SPRITE.png", ingredientes: [], stock: 15, minStock: 5 },
  { id: 14, nombre: "Fanta Naranja", imagen: "img/FANTA.png", ingredientes: [], stock: 10, minStock: 3 },
  { id: 15, nombre: "Pepsi", imagen: "img/PEPSI.png", ingredientes: [], stock: 10, minStock: 3 },
  { id: 16, nombre: "Manzanita", imagen: "img/MANZANITA.png", ingredientes: [], stock: 10, minStock: 3 },
  { id: 17, nombre: "Agua de Horchata", imagen: "img/HORCHATA.png", ingredientes: [], stock: 10, minStock: 3 },
  { id: 18, nombre: "Agua de Jamaica", imagen: "img/JAMAICA.png", ingredientes: [], stock: 10, minStock: 3 },
  { id: 19, nombre: "Agua de Limón", imagen: "img/LIMON.png", ingredientes: [], stock: 10, minStock: 3 }
];

// Helpers para localStorage
function getHistorial() { return JSON.parse(localStorage.getItem('historialPedidos')) || []; }
function setHistorial(historial) { localStorage.setItem('historialPedidos', JSON.stringify(historial)); }
function getPedido() { return JSON.parse(localStorage.getItem("pedido")) || []; }
function setPedido(p) { localStorage.setItem("pedido", JSON.stringify(p)); }
function getKitchen() { return JSON.parse(localStorage.getItem("kitchenOrders")) || []; }
function setKitchen(k) { localStorage.setItem("kitchenOrders", JSON.stringify(k)); }

// Render del menú (en menú.html)
function renderMenu() {
  const contenedor = document.getElementById("contenedor-productos");
  if (!contenedor) return;
  contenedor.innerHTML = "";

  productos.forEach(p => {
    const col = document.createElement("div");
    col.classList.add("col-md-4", "mb-3");
    col.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="${p.imagen}" class="card-img-top" alt="${p.nombre}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${p.nombre}</h5>
          <strong>Ingredientes:</strong>
          <div class="mb-2">
            ${p.ingredientes.map(ingrediente => `
              <div class="form-check">
                <input class="form-check-input" type="checkbox" checked value="${ingrediente}" id="check-${p.id}-${ingrediente}">
                <label class="form-check-label" for="check-${p.id}-${ingrediente}">${ingrediente}</label>
              </div>
            `).join("")}
          </div>
          <div class="mb-3">
            <label class="form-label">Agregar ingrediente extra (opcional):</label>
            <input type="text" class="form-control" id="extra-${p.id}" placeholder="Ej: Jalapeños">
          </div>
          <button class="btn btn-success mt-auto" onclick="agregarAlPedido(${p.id})">Agregar al pedido</button>
        </div>
      </div>
    `;
    contenedor.appendChild(col);
  });
}

// Añadir producto al pedido (menú.html)
function agregarAlPedido(id) {
  const pedido = getPedido();
  const producto = productos.find(p => p.id === id);

  const ingredientesQuitados = producto.ingredientes.filter(ingrediente => {
    const checkbox = document.getElementById(`check-${id}-${ingrediente}`);
    return checkbox && !checkbox.checked;
  });

  const ingredientesSeleccionados = producto.ingredientes.filter(ingrediente => {
    const checkbox = document.getElementById(`check-${id}-${ingrediente}`);
    return checkbox && checkbox.checked;
  });

  const extraInput = document.getElementById(`extra-${id}`);
  const ingredientesAgregados = [];
  if (extraInput && extraInput.value.trim() !== "") {
    ingredientesAgregados.push(extraInput.value.trim());
    ingredientesSeleccionados.push(extraInput.value.trim());
  }

  const pedidoFinal = {
    id: producto.id,
    nombre: producto.nombre,
    imagen: producto.imagen,
    ingredientes: ingredientesSeleccionados,
    agregados: ingredientesAgregados,
    quitados: ingredientesQuitados
  };

  pedido.push(pedidoFinal);
  setPedido(pedido);
  actualizarContador();
  alert(`"${producto.nombre}" agregado al pedido.`);
}

// Actualiza el contador en el ícono del carrito
function actualizarContador() {
  const c = document.getElementById("contadorOrden");
  if (c) c.textContent = getPedido().length;
}

// Render de pedidos (mesero.html)
function renderPedidoMesero() {
  const cont = document.getElementById("pedidoMesero");
  if (!cont) return;

  const usuario = localStorage.getItem("usuario");
  const mesa = localStorage.getItem("mesa");
  const pedido = getPedido();

  cont.innerHTML = "";

  if (!pedido.length) {
    cont.innerHTML = "<p>No hay productos.</p>";
    return;
  }

  cont.innerHTML += `
    <p><strong>Cliente:</strong> ${usuario}</p>
    <p><strong>Mesa:</strong> ${mesa}</p>
    <h4>Productos:</h4>
  `;

  pedido.forEach((item, i) => {
    const listaIngredientes = item.ingredientes?.length ? item.ingredientes.join(", ") : "Sin ingredientes";
    const agregados = item.agregados?.length ? item.agregados.join(", ") : "Ninguno";
    const quitados = item.quitados?.length ? item.quitados.join(", ") : "Ninguno";

    cont.innerHTML += `
      <div class="producto">
        <p><strong>${i + 1}. ${item.nombre}</strong></p>
        <p>🧂 Ingredientes actuales: ${listaIngredientes}</p>
        <p style="color:green;">➕ Agregados: ${agregados}</p>
        <p style="color:red;">➖ Quitados: ${quitados}</p>
        <button class="btn btn-sm btn-danger" onclick="eliminarProducto(${i})">Eliminar</button>
        <button class="btn btn-sm btn-warning" onclick="editarProducto(${i})">Editar</button>
      </div>
    `;
  });
}

// Funciones para editar pedido
function editarProducto(index) {
  const pedido = getPedido();
  const item = pedido[index];

  const modalContent = document.getElementById("modalEditarContenido");
  modalContent.innerHTML = `
    <h5>Editar ${item.nombre}</h5>
    <div>
      <strong>Ingredientes actuales:</strong>
      <ul id="ingredientesLista">
        ${item.ingredientes.map((ingrediente, i) => `
          <input type="checkbox" id="ingrediente${i}" ${item.ingredientes.includes(ingrediente) ? 'checked' : ''}>
          <label for="ingrediente${i}">${ingrediente}</label><br>
        `).join("")}
      </ul>
      <label for="nuevoIngrediente">Nuevo ingrediente:</label>
      <input type="text" id="nuevoIngrediente" class="form-control" placeholder="Ej: Jalapeños">
      <button class="btn btn-success mt-2" onclick="guardarEdicion(${index})">Guardar cambios</button>
    </div>
  `;
  const modal = new bootstrap.Modal(document.getElementById('modalEditar'));
  modal.show();
}

function guardarEdicion(index) {
  const pedido = getPedido();
  const item = pedido[index];

  const checkboxes = document.querySelectorAll('#ingredientesLista input[type="checkbox"]');
  const ingredientesEditados = [];

  checkboxes.forEach(checkbox => {
    if (checkbox.checked) {
      ingredientesEditados.push(checkbox.nextElementSibling.textContent);
    }
  });

  const nuevoIngrediente = document.getElementById('nuevoIngrediente').value.trim();
  if (nuevoIngrediente !== "") {
    ingredientesEditados.push(nuevoIngrediente);
  }

  item.ingredientes = ingredientesEditados;
  setPedido(pedido);

  const modal = bootstrap.Modal.getInstance(document.getElementById('modalEditar'));
  if (modal) modal.hide();

  renderOrdenModal();
  actualizarContador();
}

// Eliminar producto del pedido
function eliminarProducto(i) {
  const pd = getPedido();
  pd.splice(i, 1);
  setPedido(pd);
  renderPedidoMesero();
  actualizarContador();
}

// Vaciar pedido
function vaciarPedido() {
  if (confirm("Vaciar pedido?")) {
    setPedido([]);
    renderPedidoMesero();
    actualizarContador();
  }
}

// Enviar pedido a cocina (desde mesero.html)
function enviarACocina() {
  const pd = getPedido();
  if (!pd.length) return alert("No hay nada.");

  const mesa = localStorage.getItem("mesa");
  const usuario = localStorage.getItem("usuario");
  const timestamp = Date.now();

  // Guardar en cocina
  const k = getKitchen();
  k.push({ mesa, usuario, items: pd, timestamp, estado: "pendiente" });
  setKitchen(k);

  // Guardar en historial
  const historial = getHistorial();
  historial.push(...pd.map(p => ({
    id: p.id,
    nombre: p.nombre,
    fecha: new Date().toISOString().split("T")[0]
  })));
  setHistorial(historial);

  setPedido([]);
  renderPedidoMesero();
  actualizarContador();
  alert("Enviado a cocina");
  renderPedidosCocina();
}

// Renderizar pedidos en cocina (cocina.html)
function renderPedidosCocina() {
  const cont = document.getElementById("pedidosCocina");
  if (!cont) return;

  const pedidos = getKitchen();
  cont.innerHTML = "";

  if (!pedidos.length) {
    cont.innerHTML = "<p class='text-center fw-bold'>No hay pedidos.</p>";
    return;
  }

  const grid = document.createElement("div");
  grid.className = "orders-grid";

  pedidos.forEach((pedido, i) => {
    const card = document.createElement("div");
    const estado = pedido.estado || "pendiente";
    card.className = "order " + (estado === "completado" ? "status-completado" : "status-pendiente");

    const header = document.createElement("div");
    header.className = "order-header";
    header.textContent = `Mesa ${pedido.mesa} - ${pedido.usuario}`;
    card.appendChild(header);

    const body = document.createElement("div");
    body.className = "order-body";

    const ul = document.createElement("ul");
    pedido.items.forEach(item => {
      const li = document.createElement("li");
      let texto = item.nombre;
      if (item.ingredientes && item.ingredientes.length > 0) {
        texto += ` - Ingredientes: ${item.ingredientes.join(", ")}`;
      }
      li.textContent = texto;
      ul.appendChild(li);
    });
    body.appendChild(ul);
    card.appendChild(body);

    const footer = document.createElement("div");
    footer.className = "order-footer";

    const btn = document.createElement("button");
    btn.className = "btn btn-success";
    if (estado === "completado") {
      btn.textContent = "✅ Completado";
      btn.disabled = true;
      btn.classList.add("btn-secondary");
    } else {
      btn.textContent = "Marcar como completado";
      btn.onclick = () => completarPedido(i);
    }
    footer.appendChild(btn);
    card.appendChild(footer);

    grid.appendChild(card);
  });

  cont.appendChild(grid);
}

// Marcar pedido como completado (cocina.html)
function completarPedido(index) {
  const pedidos = getKitchen();
  if (!pedidos[index]) return;

  pedidos[index].estado = "completado";

  setKitchen(pedidos);
  renderPedidosCocina();
}

// Mostrar detalle del pedido en modal (para menú)
function renderOrdenModal() {
  const lista = document.getElementById("detalleOrden");
  const mensaje = document.getElementById("mensajeVacio");
  const pedido = getPedido();

  lista.innerHTML = "";
  if (!pedido.length) {
    mensaje.style.display = "block";
  } else {
    mensaje.style.display = "none";
    pedido.forEach(item => {
      const li = document.createElement("li");
      li.className = "list-group-item";
      li.textContent = item.nombre + (item.ingredientes.length ? ` (${item.ingredientes.join(", ")})` : "");
      lista.appendChild(li);
    });
  }
}

// Cerrar sesión
function cerrarSesion() {
  localStorage.removeItem("usuario");
  localStorage.removeItem("mesa");
  localStorage.removeItem("pedido");
  window.location.href = "login.html";
}

// Inicialización al cargar la página
window.addEventListener("DOMContentLoaded", () => {
  renderPedidosCocina();
  renderMenu();
  actualizarContador();
  renderPedidoMesero();
});
