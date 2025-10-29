// Variable global para almacenar todas las tareas
let todasLasTareas = [];
let filtroActual = 'todas';

// Función asíncrona que consume la API usando fetch()
async function obtenerTareas() {
    try {
        // 1. Hacer la solicitud GET a la API (limitando a 20 tareas)
        const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=20');
        
        // Verificar si la respuesta es exitosa
        if (!response.ok) {
            throw new Error('Error en la solicitud HTTP');
        }
        
        // 2. Esperar la respuesta y convertirla a formato JSON
        const data = await response.json();
        
        // 3. Devolver los datos listos para ser usados
        return data;
    } catch (error) {
        // Si hay un error, lo lanzamos para manejarlo en la función principal
        throw error;
    }
}

// Función para actualizar estadísticas
function actualizarEstadisticas() {
    const completadas = todasLasTareas.filter(t => t.completed).length;
    const total = todasLasTareas.length;
    const porcentaje = Math.round((completadas/total)*100);
    
    const statsDiv = document.querySelector('.stats');
    if (statsDiv) {
        statsDiv.innerHTML = `
            <strong>📊 Progreso:</strong> ${completadas} de ${total} tareas completadas 
            (${porcentaje}%)
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${porcentaje}%">${porcentaje}%</div>
            </div>
        `;
    }
}

// Función para filtrar tareas
function filtrarTareas(filtro) {
    filtroActual = filtro;
    const taskItems = document.querySelectorAll('.task-item');
    
    taskItems.forEach(item => {
        const isCompleted = item.classList.contains('completed');
        
        if (filtro === 'todas') {
            item.classList.remove('hidden');
        } else if (filtro === 'completadas' && isCompleted) {
            item.classList.remove('hidden');
        } else if (filtro === 'pendientes' && !isCompleted) {
            item.classList.remove('hidden');
        } else {
            item.classList.add('hidden');
        }
    });
}

// Función para alternar el estado de una tarea
function toggleTarea(taskId) {
    const tarea = todasLasTareas.find(t => t.id === taskId);
    if (tarea) {
        tarea.completed = !tarea.completed;
        actualizarEstadisticas();
    }
}

// Función para eliminar una tarea
function eliminarTarea(taskId, taskElement) {
    todasLasTareas = todasLasTareas.filter(t => t.id !== taskId);
    taskElement.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
        taskElement.remove();
        actualizarEstadisticas();
    }, 300);
}

// Función para mostrar las tareas en el DOM
function mostrarTareas(tareas) {
    const resultado = document.getElementById('resultado');
    todasLasTareas = tareas;
    
    // Limpiar el mensaje de "Cargando..."
    resultado.innerHTML = '';
    
    // Crear elemento de estadísticas
    const stats = document.createElement('div');
    stats.className = 'stats';
    resultado.appendChild(stats);
    
    // Actualizar estadísticas iniciales
    actualizarEstadisticas();
    
    // Recorrer el arreglo de tareas y crear elementos
    tareas.forEach(tarea => {
        // Crear elementos usando createElement
        const taskItem = document.createElement('div');
        taskItem.className = `task-item ${tarea.completed ? 'completed' : ''}`;
        taskItem.dataset.id = tarea.id;
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.checked = tarea.completed;
        
        // Hacer el checkbox interactivo
        checkbox.addEventListener('change', function() {
            taskItem.classList.toggle('completed');
            taskText.classList.toggle('completed');
            toggleTarea(tarea.id);
            filtrarTareas(filtroActual);
        });
        
        const taskText = document.createElement('span');
        taskText.className = `task-text ${tarea.completed ? 'completed' : ''}`;
        taskText.textContent = tarea.title;
        
        const taskId = document.createElement('span');
        taskId.className = 'task-id';
        taskId.textContent = `#${tarea.id}`;
        
        // Botón de eliminar
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'task-delete';
        deleteBtn.textContent = '🗑️';
        deleteBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            if (confirm('¿Eliminar esta tarea?')) {
                eliminarTarea(tarea.id, taskItem);
            }
        });
        
        // Hacer toda la tarea clickeable
        taskItem.addEventListener('click', function(e) {
            if (e.target !== checkbox && e.target !== deleteBtn) {
                checkbox.click();
            }
        });
        
        // Usar appendChild para agregar elementos al DOM
        taskItem.appendChild(checkbox);
        taskItem.appendChild(taskText);
        taskItem.appendChild(taskId);
        taskItem.appendChild(deleteBtn);
        
        resultado.appendChild(taskItem);
    });
}

// Configurar filtros
function configurarFiltros() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remover clase active de todos los botones
            filterBtns.forEach(b => b.classList.remove('active'));
            // Agregar clase active al botón clickeado
            this.classList.add('active');
            // Filtrar tareas
            const filtro = this.dataset.filter;
            filtrarTareas(filtro);
        });
    });
}

// Función principal que maneja la carga y errores
async function cargarTareas() {
    const resultado = document.getElementById('resultado');
    
    // Manejo de Carga: mostrar mensaje mientras se hace el fetch
    resultado.innerHTML = '<div class="loading">Cargando tareas</div>';
    
    try {
        // Llamar a la función que hace el fetch
        const tareas = await obtenerTareas();
        
        // Si la solicitud es exitosa, mostrar los datos
        mostrarTareas(tareas);
        
        // Configurar los filtros
        configurarFiltros();
        
    } catch (error) {
        // Si la solicitud falla, mostrar mensaje de error amigable
        resultado.innerHTML = `
            <div class="error">
                ❌ No se pudieron cargar las tareas. Intenta más tarde.
                <br><br>
                <small>Detalle técnico: ${error.message}</small>
            </div>
        `;
    }
}

// CSS adicional para la animación
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Ejecutar la función cuando carga la página
window.addEventListener('DOMContentLoaded', cargarTareas);