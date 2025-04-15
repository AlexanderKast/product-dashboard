// evaluator.js

// -------------- DATOS Y ESTADO INICIAL --------------
const evaluatorContainer = document.getElementById("evaluator-container");

const categories = [
  {
    name: "Características básicas del producto",
    criteria: [
      { id: 1, name: 'Soluciona un problema o necesidad real', description: '¿Qué tan importante es el problema que resuelve?' },
      { id: 2, name: 'Lo requiere un público muy grande', description: '¿Es una necesidad generalizada en muchas personas?' },
      { id: 3, name: 'Cambia la forma en que se hace un proceso', description: '¿Revoluciona o mejora significativamente alguna actividad?' },
      { id: 4, name: 'Alto valor percibido', description: '¿Las personas estarían dispuestas a pagar un precio premium?' },
      { id: 5, name: 'Efecto WOW o viral', description: '¿Genera asombro o interés inmediato al verlo?' },
      { id: 6, name: 'Ofrece múltiples usos/funciones', description: '¿Tiene versatilidad en sus aplicaciones?' },
    ]
  },
  {
    name: "Mercado y competencia",
    criteria: [
      { id: 7, name: 'No está en tiendas físicas locales', description: '¿Es difícil encontrarlo en tiendas cercanas?' },
      { id: 8, name: 'Sin mucha competencia (menos de 5 proveedores)', description: '¿Cuántos proveedores/competidores ofrecen este producto?' },
      { id: 9, name: 'Buena estacionalidad o demanda actual', description: '¿Es temporada adecuada o hay demanda creciente?' },
      { id: 10, name: 'No está saturado en redes/anuncios', description: '¿Ves muchos anuncios de este producto en redes sociales?' },
      { id: 11, name: 'Se está vendiendo bien en otros países', description: '¿Está teniendo éxito en mercados internacionales?' },
      { id: 12, name: 'Es de un nicho no tan concurrido', description: '¿El nicho tiene menos competencia que las categorías principales?' },
    ]
  },
  {
    name: "Rentabilidad y operación",
    criteria: [
      { id: 13, name: 'Buen margen de ganancia (permite 3x)', description: '¿Permite un margen mínimo del triple de su costo?' },
      { id: 14, name: 'Bajo costo de producción/adquisición', description: '¿Su costo base es relativamente bajo?' },
      { id: 15, name: 'Permitiría importar inventario propio', description: '¿Es viable importarlo directamente en el futuro?' },
      { id: 16, name: 'Se puede vender en kit/packs', description: '¿Se pueden crear combos o kits con este producto?' },
      { id: 17, name: 'Permite generar upsells/cross-sells', description: '¿Se pueden ofrecer productos complementarios?' },
      { id: 18, name: 'Fácil de almacenar/gestionar', description: '¿No es voluminoso, frágil o complicado de manipular?' },
    ]
  },
  {
    name: "Calidad y percepción",
    criteria: [
      { id: 19, name: 'Buenas reseñas en Amazon/AliExpress', description: '¿Tienen evaluaciones positivas de usuarios reales?' },
      { id: 20, name: 'No ofrece cambios exagerados/irreales', description: '¿Evita prometer resultados imposibles o milagrosos?' },
      { id: 21, name: 'Producto que funcionó hace un año', description: '¿Ha demostrado potencial de ventas en el pasado?' },
      { id: 22, name: 'Es versión mejorada de producto exitoso', description: '¿Es una evolución o versión 2.0 de algo que funcionó?' },
      { id: 23, name: 'No es perecedero/tiene buena vida útil', description: '¿No tiene fecha de caducidad o es de larga duración?' },
      { id: 24, name: 'Calidad suficiente/confiable', description: '¿Cumple con estándares mínimos de calidad y durabilidad?' },
    ]
  },
  {
    name: "Marketing y comunicación",
    criteria: [
      { id: 25, name: 'Jugará con la emoción del cliente', description: '¿Conectará emocionalmente con el consumidor?' },
      { id: 26, name: 'Dificultad para pautarlo (en el buen sentido)', description: '¿Es difícil de pautar para la competencia/requiere experiencia?' },
      { id: 27, name: 'Permite diferentes ángulos de venta', description: '¿Se puede enfocar desde distintas perspectivas/nichos?' },
      { id: 28, name: 'Fácil de generar contenido para él', description: '¿Es sencillo crear videos/fotos mostrando beneficios?' },
      { id: 29, name: 'Fácil uso e instalación', description: '¿No requiere conocimientos técnicos o instalación compleja?' },
      { id: 30, name: 'Es atractivo visualmente', description: '¿Se ve bien en fotos/videos y capta atención?' },
    ]
  },
  {
    name: "Potencial a largo plazo",
    criteria: [
      { id: 31, name: 'Ahorra tiempo o dinero al cliente', description: '¿Optimiza recursos del usuario de alguna manera?' },
      { id: 32, name: 'Podría generar compras recurrentes', description: '¿El cliente necesitaría comprarlo más de una vez?' },
      { id: 33, name: 'Puede evolucionar a marca propia', description: '¿Tiene potencial para convertirse en una marca?' },
    ]
  },
];

let state = {
  productName: "",
  scores: categories.reduce((acc, category) => {
    category.criteria.forEach(criterion => {
      acc[criterion.id] = 0;
    });
    return acc;
  }, {}),
  totalScore: 0,
  maxPossibleScore: 0,
  evaluation: "",
  recommendation: "",
  expandedCategory: null,
};

// -------------- FUNCIÓN PARA CALCULAR RESULTADOS --------------
function calculateResults() {
  const criteriaCount = categories.reduce((count, category) => count + category.criteria.length, 0);
  state.maxPossibleScore = criteriaCount * 5;

  state.totalScore = Object.values(state.scores).reduce((sum, score) => sum + score, 0);
  let percentage = state.maxPossibleScore === 0 ? 0 : (state.totalScore / state.maxPossibleScore) * 100;

  if (percentage >= 80) {
    state.evaluation = '¡PRODUCTO GANADOR EXCEPCIONAL!';
    state.recommendation = 'Extraordinario potencial. Prioriza este producto para testeo inmediato y prepárate para escalar agresivamente.';
  } else if (percentage >= 70) {
    state.evaluation = 'PRODUCTO MUY PROMETEDOR';
    state.recommendation = 'Gran potencial. Testea con presupuesto suficiente y prepárate para escalarlo rápidamente si funciona.';
  } else if (percentage >= 60) {
    state.evaluation = 'BUEN POTENCIAL';
    state.recommendation = 'Producto con potencial sólido. Testea con cautela y optimiza los puntos débiles antes de escalar.';
  } else if (percentage >= 50) {
    state.evaluation = 'POTENCIAL MODERADO';
    state.recommendation = 'Oportunidad visible pero con limitaciones. Considera mejorar los aspectos con menor puntuación antes de testear.';
  } else {
    state.evaluation = 'RECONSIDERAR';
    state.recommendation = 'Este producto presenta demasiados desafíos. Busca alternativas con mejor puntuación o identifica cómo mejorar significativamente estos aspectos.';
  }
}

// -------------- FUNCIÓN DE RENDERIZADO --------------
function renderEvaluator() {
  calculateResults(); // Actualiza resultados antes de renderizar

  evaluatorContainer.innerHTML = `
    <div class="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h1 class="text-2xl font-bold text-center mb-6 text-blue-700">Calificador de Productos Ganadores - 33 Criterios</h1>
      
      <!-- Input para el nombre del producto -->
      <div class="mb-4">
        <label class="block text-gray-700 font-semibold mb-2">Nombre del Producto:</label>
        <input type="text" id="product-name" placeholder="Ingresa el nombre del producto" class="w-full p-2 border border-gray-300 rounded" value="${state.productName}" />
      </div>
      
      <!-- Sección de evaluación de criterios -->
      <div class="mb-6">
        <h2 class="text-xl font-semibold mb-3 text-gray-800">Evalúa cada criterio (1-5):</h2>
        ${categories.map((category, catIndex) => {
          // Cálculo de puntaje de la categoría
          let catTotal = 0, catPossible = category.criteria.length * 5;
          category.criteria.forEach(c => {
            catTotal += state.scores[c.id];
          });
          let catPercentage = catPossible > 0 ? Math.round((catTotal / catPossible) * 100) : 0;
          return `
            <div class="mb-4 border border-gray-200 rounded-md overflow-hidden">
              <div class="flex justify-between items-center p-3 bg-gray-100 cursor-pointer" data-catindex="${catIndex}">
                <span class="font-bold text-gray-800">${category.name}</span>
                <span class="text-sm font-medium">${catTotal}/${catPossible} (${catPercentage}%)</span>
              </div>
              <div class="category-criteria ${state.expandedCategory === catIndex ? '' : 'hidden'}">
                ${category.criteria.map(criterion => `
                  <div class="mb-3 p-2 bg-gray-50 rounded-md">
                    <div class="flex justify-between items-center mb-1">
                      <span class="font-medium text-gray-800">${criterion.name}</span>
                      <span class="text-sm text-gray-500">${criterion.description}</span>
                    </div>
                    <div class="flex gap-2 mt-2">
                      ${[1,2,3,4,5].map(score => `
                        <button data-criterion="${criterion.id}" data-score="${score}"
                          class="w-12 h-9 rounded-md font-bold flex items-center justify-center transition-colors ${state.scores[criterion.id] == score ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}">
                          ${score}
                        </button>
                      `).join('')}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>
      
      <!-- Resultados finales -->
      <div class="p-4 rounded-lg bg-blue-50 border border-blue-200">
        <div class="flex justify-between items-center mb-3">
          <h3 class="text-lg font-bold">Puntuación Total:</h3>
          <span class="text-2xl font-bold text-blue-700">${state.totalScore}/${state.maxPossibleScore} (${Math.round((state.totalScore/state.maxPossibleScore)*100)}%)</span>
        </div>
        <div class="w-full bg-gray-300 rounded-full h-3 mb-4">
          <div class="h-3 rounded-full ${state.totalScore/state.maxPossibleScore >= 0.8 ? 'bg-green-500' : state.totalScore/state.maxPossibleScore >= 0.7 ? 'bg-green-400' : state.totalScore/state.maxPossibleScore >= 0.6 ? 'bg-blue-400' : state.totalScore/state.maxPossibleScore >= 0.5 ? 'bg-yellow-400' : 'bg-red-400'}"
               style="width: ${(state.totalScore/state.maxPossibleScore)*100}%"></div>
        </div>
        <div class="mb-2">
          <h3 class="text-lg font-bold">Evaluación:</h3>
          <p class="text-xl font-bold ${state.totalScore/state.maxPossibleScore >= 0.8 ? 'text-green-600' : state.totalScore/state.maxPossibleScore >= 0.7 ? 'text-green-500' : state.totalScore/state.maxPossibleScore >= 0.6 ? 'text-blue-600' : state.totalScore/state.maxPossibleScore >= 0.5 ? 'text-yellow-600' : 'text-red-600'}">
            ${state.evaluation}
          </p>
        </div>
        <div>
          <h3 class="text-lg font-bold">Recomendación:</h3>
          <p class="text-gray-700">${state.recommendation}</p>
        </div>
      </div>
    </div>
  `;

  // -------------- ASIGNAR EVENTOS --------------
  // Actualizar nombre del producto
  document.getElementById("product-name").addEventListener("input", (e) => {
    state.productName = e.target.value;
  });

  // Para expandir/contraer categorías al hacer clic en su encabezado
  document.querySelectorAll('[data-catindex]').forEach(header => {
    header.addEventListener("click", () => {
      const index = parseInt(header.getAttribute("data-catindex"));
      state.expandedCategory = state.expandedCategory === index ? null : index;
      renderEvaluator();
    });
  });

  // Asignar evento a los botones de puntaje
  document.querySelectorAll('button[data-criterion]').forEach(btn => {
    btn.addEventListener("click", () => {
      const criterionId = parseInt(btn.getAttribute("data-criterion"));
      const score = parseInt(btn.getAttribute("data-score"));
      state.scores[criterionId] = score;
      renderEvaluator();
    });
  });
}

// -------------- INICIALIZAR --------------
renderEvaluator();
