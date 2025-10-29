
// Función asíncrona que consume la API usando fetch()
async function obtenerUsuarios() {
    try {
        // 1. Hacer la solicitud GET a la API
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        
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

// Función para mostrar los usuarios en el DOM
function mostrarUsuarios(usuarios) {
    const resultado = document.getElementById('resultado');
    
    // Limpiar el mensaje de "Cargando..."
    resultado.innerHTML = '';
    
    // Recorrer el arreglo de usuarios y crear elementos
    usuarios.forEach(usuario => {
        // Crear elementos usando createElement
        const userCard = document.createElement('div');
        userCard.className = 'user-card';
        
        const avatar = document.createElement('div');
        avatar.className = 'user-avatar';
        avatar.textContent = usuario.name.charAt(0);
        
        const userInfo = document.createElement('div');
        userInfo.className = 'user-info';
        
        const nombre = document.createElement('h3');
        nombre.textContent = usuario.name;
        
        const username = document.createElement('p');
        username.innerHTML = `<strong>Usuario:</strong> @${usuario.username}`;
        
        const email = document.createElement('p');
        email.innerHTML = `<strong>Email:</strong> ${usuario.email}`;
        
        const telefono = document.createElement('p');
        telefono.innerHTML = `<strong>Teléfono:</strong> ${usuario.phone}`;
        
        const ciudad = document.createElement('p');
        ciudad.innerHTML = `<strong>Ciudad:</strong> ${usuario.address.city}`;
        
        const compania = document.createElement('p');
        compania.innerHTML = `<strong>Empresa:</strong> ${usuario.company.name}`;
        
        // Usar appendChild para agregar elementos al DOM
        userInfo.appendChild(nombre);
        userInfo.appendChild(username);
        userInfo.appendChild(email);
        userInfo.appendChild(telefono);
        userInfo.appendChild(ciudad);
        userInfo.appendChild(compania);
        
        userCard.appendChild(avatar);
        userCard.appendChild(userInfo);
        
        resultado.appendChild(userCard);
    });
}

// Función principal que maneja la carga y errores
async function cargarUsuarios() {
    const resultado = document.getElementById('resultado');
    
    // Manejo de Carga: mostrar mensaje mientras se hace el fetch
    resultado.innerHTML = '<div class="loading">Cargando usuarios</div>';
    
    try {
        // Llamar a la función que hace el fetch
        const usuarios = await obtenerUsuarios();
        
        // Si la solicitud es exitosa, mostrar los datos
        mostrarUsuarios(usuarios);
        
    } catch (error) {
        // Si la solicitud falla, mostrar mensaje de error amigable
        resultado.innerHTML = `
            <div class="error">
                ❌ No se pudieron cargar los datos. Intenta más tarde.
                <br><br>
                <small>Detalle técnico: ${error.message}</small>
            </div>
        `;
    }
}

// Ejecutar la función cuando carga la página
window.addEventListener('DOMContentLoaded', cargarUsuarios);