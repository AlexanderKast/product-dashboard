/***********************
 *  app.js CORREGIDO   *
 ***********************/

// 1. Crear instancia de Supabase usando la librería global
//    Nota: Asegúrate de usar tu URL y tu clave de Supabase reales
const { createClient } = window.supabase;
const supabaseUrl = 'https://gifmeubmhmfklgmphjfx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpZm1ldWJtaG1ma2xnbXBoamZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2ODQzNDQsImV4cCI6MjA2MDI2MDM0NH0.B-uY1_QHtDEn9VY4IfMlHHGG8K_HszfDSzjQdv984WY'; // Reemplaza con tu clave
const supabase = createClient(supabaseUrl, supabaseKey);

// 2. Definir las etapas y sus colores (igual que en el código React)
const stages = [
  "Descubrimiento", 
  "Investigación", 
  "Análisis", 
  "Validación",
  "Preparación", 
  "Testeo", 
  "Escalando",
  "Descartado"
];

const stageColors = {
  "Descubrimiento": "bg-gray-100 border-gray-400",
  "Investigación": "bg-blue-100 border-blue-400",
  "Análisis": "bg-indigo-100 border-indigo-400",
  "Validación": "bg-purple-100 border-purple-400",
  "Preparación": "bg-yellow-100 border-yellow-400",
  "Testeo": "bg-orange-100 border-orange-400",
  "Escalando": "bg-green-100 border-green-400",
  "Descartado": "bg-red-100 border-red-400"
};

// 3. Estado global para manejar la data y lo seleccionado
let state = {
  products: [],
  newProduct: "",
  selectedProduct: null,
  filters: { stage: "Todos" },
};

// Funciones de ayuda
function filterProducts() {
  if (state.filters.stage === "Todos") return state.products;
  return state.products.filter((p) => p.stage === state.filters.stage);
}

function getStageCounters() {
  const counters = {};
  for (let s of stages) {
    counters[s] = state.products.filter((p) => p.stage === s).length;
  }
  return counters;
}

/*******************************************************
 *        FUNCIONES CRUD CON SUPABASE (ASYNC)          *
 *******************************************************/
async function fetchProducts() {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching products:", error);
      return [];
    }
    return data;
  } catch (err) {
    console.error("Unexpected error fetching products:", err);
    return [];
  }
}

async function addProduct() {
  const productName = state.newProduct.trim();
  if (!productName) return;

  try {
    const { data, error } = await supabase
      .from("products")
      .insert([
        {
          name: productName,
          stage: "Descubrimiento",
          score: 0,
          notes: ""
        }
      ])
      .select();

    if (error) {
      alert("Error al agregar producto: " + error.message);
      return;
    }

    setState({
      products: [data[0], ...state.products],
      newProduct: ""
    });
  } catch (err) {
    console.error("Unexpected error adding product:", err);
  }
}

async function updateProduct(id, updates) {
  try {
    const { error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", id);

    if (error) {
      alert("Error al actualizar producto: " + error.message);
      return;
    }

    setState({
      products: state.products.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
      // Si el producto que estamos editando es el seleccionado, lo actualizamos también en selectedProduct
      selectedProduct:
        state.selectedProduct && state.selectedProduct.id === id
          ? { ...state.selectedProduct, ...updates }
          : state.selectedProduct
    });
  } catch (err) {
    console.error("Unexpected error updating product:", err);
  }
}

async function deleteProduct(id) {
  try {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Error al eliminar producto: " + error.message);
      return;
    }

    setState({
      products: state.products.filter((p) => p.id !== id),
      selectedProduct:
        state.selectedProduct && state.selectedProduct.id === id
          ? null
          : state.selectedProduct
    });
  } catch (err) {
    console.error("Unexpected error deleting product:", err);
  }
}

/*******************************************************
 *           RENDERIZADO PRINCIPAL (UI)                *
 *******************************************************/

function setState(newState) {
  // Actualiza el estado y vuelve a renderizar
  state = { ...state, ...newState };
  render();
  // Si hay un producto seleccionado, engancha los listeners del panel
  if (state.selectedProduct) attachSelectedProductListeners();
}

function render() {
    const app = document.getElementById("app");
    if (!app) return;
  
    // --- PRESERVAR VALORES Y POSICIÓN DEL CURSOR ---
    
    // Para el input del nuevo producto
    const newProductInputEl = document.getElementById("new-product");
    const newProductValue = newProductInputEl ? newProductInputEl.value : "";
    const isNewProductFocused = newProductInputEl && (document.activeElement === newProductInputEl);
    
    // Para el textarea de notas del producto seleccionado
    const notesInputEl = document.getElementById("selected-notes");
    let notesValue = "";
    let notesSelectionStart = 0;
    let notesSelectionEnd = 0;
    let isNotesFocused = false;
    if (notesInputEl) {
      notesValue = notesInputEl.value;
      notesSelectionStart = notesInputEl.selectionStart;
      notesSelectionEnd = notesInputEl.selectionEnd;
      isNotesFocused = document.activeElement === notesInputEl;
    }
    
    // --- GENERAR EL HTML COMPLETO ---
    const filteredProducts = filterProducts();
    const stageCounters = getStageCounters();
  
    let html = `
      <div class="p-4 bg-gray-50 rounded-lg shadow">
        <h1 class="text-2xl font-bold text-center mb-6 text-blue-700">
          Tablero de Seguimiento de Productos
        </h1>
    
        <!-- Filtros y Estadísticas -->
        <div class="mb-6 flex flex-wrap items-center justify-between">
          <div class="mb-2 md:mb-0">
            <label class="mr-2 font-medium">Filtrar por etapa:</label>
            <select id="filter-stage" class="border p-1 rounded">
              <option value="Todos" ${state.filters.stage === "Todos" ? "selected" : ""}>Todos</option>
              ${stages.map(stg => `<option value="${stg}" ${state.filters.stage === stg ? "selected" : ""}>${stg}</option>`).join("")}
            </select>
          </div>
          <div class="flex flex-wrap gap-2">
            ${stages.map(stg => `
              <div class="px-3 py-1 rounded-full text-xs ${stageColors[stg]} border">
                ${stg}: ${stageCounters[stg] || 0}
              </div>
            `).join("")}
          </div>
        </div>
    
        <!-- Agregar Nuevo Producto -->
        <div class="mb-6 flex">
          <input
            type="text"
            id="new-product"
            placeholder="Nombre del nuevo producto"
            class="flex-grow p-2 border rounded-l"
          />
          <button id="btn-add-product" class="bg-blue-600 text-white px-4 rounded-r hover:bg-blue-700">
            Agregar
          </button>
        </div>
    
        <!-- Lista de Productos -->
        <div class="mb-6">
          <h2 class="text-lg font-semibold mb-2">
            Productos (${filteredProducts.length})
          </h2>
          ${
            filteredProducts.length === 0
              ? `<div class="text-center py-4 text-gray-500">
                   No hay productos en esta etapa. Agrega uno nuevo o cambia el filtro.
                 </div>`
              : `<div class="overflow-x-auto">
                  <table class="min-w-full bg-white">
                    <thead>
                      <tr class="bg-gray-100 text-gray-700">
                        <th class="py-2 px-3 text-left">Nombre</th>
                        <th class="py-2 px-3 text-left">Etapa</th>
                        <th class="py-2 px-3 text-left">Puntuación</th>
                        <th class="py-2 px-3 text-left">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${filteredProducts.map(product => renderProductRow(product)).join("")}
                    </tbody>
                  </table>
                </div>`
          }
        </div>
    
        <!-- Detalle de Producto Seleccionado -->
        ${state.selectedProduct ? renderSelectedProduct(state.selectedProduct) : ""}
      </div>
    `;
    
    // --- INYECTAR EL HTML ---
    app.innerHTML = html;
    
    // --- RESTAURAR VALORES Y POSICIÓN DEL CURSOR ---
    
    // Para el input del nuevo producto
    const newProductInputNew = document.getElementById("new-product");
    if (newProductInputNew) {
      newProductInputNew.value = newProductValue;
      if (isNewProductFocused) newProductInputNew.focus();
    }
    
    // Para el textarea de notas
    const notesInputNew = document.getElementById("selected-notes");
    if (notesInputNew) {
      // Restablece el texto manualmente (aunque ya se inserta en el HTML, esto garantiza consistencia)
      notesInputNew.value = notesValue;
      if (isNotesFocused) {
        notesInputNew.focus();
        // Restaurar la posición del cursor
        notesInputNew.setSelectionRange(notesSelectionStart, notesSelectionEnd);
      }
    }
    
    // --- ENGANCHE DE EVENTOS PRINCIPALES ---
    document.getElementById("filter-stage").addEventListener("change", (e) => {
      setState({ filters: { stage: e.target.value } });
    });
    
    const newProductInput = document.getElementById("new-product");
    newProductInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        state.newProduct = newProductInput.value;
        addProduct();
      }
    });
    document.getElementById("btn-add-product").addEventListener("click", () => {
      state.newProduct = newProductInput.value;
      addProduct();
    });
    
    // Event delegation para filas de productos
    document.querySelectorAll("tr[data-id]").forEach((row) => {
      row.addEventListener("click", (ev) => {
        if (ev.target.classList.contains("delete-product")) return;
        const id = parseInt(row.getAttribute("data-id"));
        const product = state.products.find(p => p.id === id);
        setState({ selectedProduct: product });
      });
    });
    
    document.querySelectorAll(".delete-product").forEach((btn) => {
      btn.addEventListener("click", (ev) => {
        ev.stopPropagation();
        const id = parseInt(btn.getAttribute("data-id"));
        deleteProduct(id);
      });
    });
    
    // Si hay un producto seleccionado, enganchar eventos del panel
    if (state.selectedProduct) {
      attachSelectedProductListeners();
    }
  }
  
  

/*******************************************************
 *       FUNCIONES PARA RENDERIZAR SUB-SECCIONES       *
 *******************************************************/
function renderProductRow(product) {
  // Determinar color de la barra de progreso
  let barColor = "bg-red-500";
  if (product.score >= 132) barColor = "bg-green-500";
  else if (product.score >= 99) barColor = "bg-blue-500";
  else if (product.score >= 66) barColor = "bg-yellow-500";

  // Determinar si la fila está "seleccionada"
  const isSelected =
    state.selectedProduct && state.selectedProduct.id === product.id
      ? "bg-blue-50"
      : "";

  return `
    <tr 
      class="border-b hover:bg-gray-50 cursor-pointer ${isSelected}" 
      data-id="${product.id}"
    >
      <td class="py-2 px-3">${product.name}</td>
      <td class="py-2 px-3">
        <div 
          class="px-2 py-1 rounded text-xs inline-block ${stageColors[product.stage]} border"
        >
          ${product.stage}
        </div>
      </td>
      <td class="py-2 px-3">
        <div class="flex items-center">
          <span class="mr-2">${product.score}/165</span>
          <div class="w-20 bg-gray-200 rounded-full h-2">
            <div
              class="h-2 rounded-full ${barColor}"
              style="width: ${(product.score / 165) * 100}%"
            ></div>
          </div>
        </div>
      </td>
      <td class="py-2 px-3">
        <button 
          class="text-red-600 hover:text-red-800 delete-product"
          data-id="${product.id}"
        >
          Eliminar
        </button>
      </td>
    </tr>
  `;
}

function renderSelectedProduct(product) {
  // Panel de detalle del producto seleccionado
  return `
    <div class="border rounded-lg p-4 bg-white">
      <h2 class="text-lg font-semibold mb-3">${product.name}</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <!-- Etapa -->
        <div>
          <label class="block text-sm font-medium mb-1">Etapa:</label>
          <select 
            id="selected-stage"
            class="w-full p-2 border rounded"
          >
            ${stages
              .map(
                (stage) => `
                  <option value="${stage}" ${
                    stage === product.stage ? "selected" : ""
                  }>${stage}</option>
                `
              )
              .join("")}
          </select>
        </div>
        <!-- Puntuación -->
        <div>
          <label class="block text-sm font-medium mb-1">Puntuación:</label>
          <input
            type="number"
            min="0"
            max="50"
            id="selected-score"
            value="${product.score}"
            class="w-full p-2 border rounded"
          />
        </div>
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">Notas:</label>
        <textarea
          id="selected-notes"
          class="w-full p-2 border rounded h-24"
          placeholder="Agrega tus notas sobre este producto..."
        >${product.notes || ""}</textarea>
      </div>

      <div class="flex justify-end">
        <button 
          id="btn-close-selected"
          class="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 mr-2"
        >
          Cerrar
        </button>
        <button
          id="btn-delete-selected"
          class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Eliminar
        </button>
      </div>
    </div>
  `;
}

/*******************************************************
 *   ENGANCHE DE EVENTOS PARA EL PRODUCTO SELECCIONADO *
 *******************************************************/
function attachSelectedProductListeners() {
  const product = state.selectedProduct;
  if (!product) return;

  const selectedStage = document.getElementById("selected-stage");
  const selectedScore = document.getElementById("selected-score");
  const selectedNotes = document.getElementById("selected-notes");

  const btnCloseSelected = document.getElementById("btn-close-selected");
  const btnDeleteSelected = document.getElementById("btn-delete-selected");

  // Cambio de etapa
  selectedStage.addEventListener("change", (e) => {
    updateProduct(product.id, { stage: e.target.value });
  });

  // Cambio de puntuación
  selectedScore.addEventListener("change", (e) => {
    const newScore = parseInt(e.target.value) || 0;
    updateProduct(product.id, { score: newScore });
  });

  // Cambio de notas
  selectedNotes.addEventListener("input", (e) => {
    updateProduct(product.id, { notes: e.target.value });
  });

  // Botón "Cerrar"
  btnCloseSelected.addEventListener("click", () => {
    setState({ selectedProduct: null });
  });

  // Botón "Eliminar"
  btnDeleteSelected.addEventListener("click", () => {
    deleteProduct(product.id);
  });
}

/*******************************************************
 *         INICIALIZAR LA APP AL CARGAR LA PÁGINA       *
 *******************************************************/
(async function init() {
  // Cargar productos desde Supabase
  const products = await fetchProducts();
  setState({ products });
})();
