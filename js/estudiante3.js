
// Función asíncrona que consume la API usando fetch()
async function obtenerProductos() {
    try {
        // Aumentamos el límite para obtener más productos y detectar categorías
        const response = await fetch('https://dummyjson.com/products?limit=100');
        if (!response.ok) throw new Error('Error en la solicitud HTTP');
        const data = await response.json();

        // Detectar productos de "tecnología" de forma más flexible usando palabras clave
        const keywords = ['lap', 'smart', 'phone', 'tablet', 'mobile', 'accessory', 'camera', 'headphone', 'speaker', 'monitor', 'tv', 'electronics', 'console'];

        const productosTech = (data.products || []).filter(p => {
            const cat = (p.category || '').toLowerCase();
            const title = (p.title || '').toLowerCase();
            const desc = (p.description || '').toLowerCase();

            // Coincidencia por categoría exacta o por palabras clave en categoría/título/descripcion
            if (keywords.some(k => cat.includes(k))) return true;
            if (keywords.some(k => title.includes(k))) return true;
            if (keywords.some(k => desc.includes(k))) return true;
            return false;
        });

        // Si no se detecta ninguno, devolver todos los productos como fallback
        return productosTech.length ? productosTech : (data.products || []);
    } catch (error) {
        throw error;
    }
}

// Función para mostrar los productos en el DOM
function mostrarProductos(productos) {
    const resultado = document.getElementById('resultado');
    
    // Limpiar el mensaje de "Cargando..."
    resultado.innerHTML = '';
    
    // Crear título
    const titulo = document.createElement('h2');
    titulo.textContent = `💻 ${productos.length} Productos disponibles`;
    titulo.style.marginBottom = '25px';
    titulo.style.color = '#667eea';
    resultado.appendChild(titulo);
    
    // Crear grid de productos
    const productsGrid = document.createElement('div');
    productsGrid.className = 'products-grid';
    
    // Recorrer el arreglo de productos y crear elementos
    productos.forEach(producto => {
        // Crear elementos usando createElement
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.style.position = 'relative';
        
        // Si hay descuento, mostrar badge
        if (producto.discountPercentage > 0) {
            const discountBadge = document.createElement('div');
            discountBadge.className = 'product-discount';
            discountBadge.textContent = `-${Math.round(producto.discountPercentage)}%`;
            productCard.appendChild(discountBadge);
        }
        
        const image = document.createElement('img');
        image.src = producto.thumbnail;
        image.alt = producto.title;
        image.className = 'product-image';
        
        // Manejar error de carga de imagen
        image.onerror = function() {
            this.style.display = 'flex';
            this.style.alignItems = 'center';
            this.style.justifyContent = 'center';
            this.style.fontSize = '3em';
            this.alt = '📦';
        };
        
        const productInfo = document.createElement('div');
        productInfo.className = 'product-info';
        
        const title = document.createElement('div');
        title.className = 'product-title';
        title.textContent = producto.title;
        
        const price = document.createElement('div');
        price.className = 'product-price';
        price.textContent = `$${producto.price.toFixed(2)}`;
        
        const category = document.createElement('span');
        category.className = 'product-category';
        
        // Traducir categorías al español
        const traducciones = {
            'laptops': '💻 Laptops',
            'smartphones': '📱 Smartphones',
            'tablets': '📱 Tablets',
            'mobile-accessories': '🔌 Accesorios',
            'automotive': '🚗 Automotriz'
        };
        category.textContent = traducciones[producto.category] || producto.category;
        
        const rating = document.createElement('div');
        rating.className = 'product-rating';
        const stars = '⭐'.repeat(Math.round(producto.rating));
        rating.innerHTML = `${stars} ${producto.rating.toFixed(1)} / 5`;
        
        const stock = document.createElement('span');
        stock.className = 'product-stock';
        stock.textContent = `✓ ${producto.stock} en stock`;
        
        // Agregar evento click para mostrar detalles
        productCard.addEventListener('click', function() {
            alert(`
🛒 ${producto.title}

💰 Precio: $${producto.price}
⭐ Rating: ${producto.rating} / 5
📦 Stock: ${producto.stock} unidades
🏷️ Categoría: ${category.textContent}
${producto.discountPercentage > 0 ? `\n🎉 ¡${Math.round(producto.discountPercentage)}% de descuento!` : ''}

📝 Descripción: ${producto.description}
            `);
        });
        
        // Usar appendChild para agregar elementos al DOM
        productInfo.appendChild(title);
        productInfo.appendChild(price);
        productInfo.appendChild(category);
        productInfo.appendChild(rating);
        productInfo.appendChild(stock);
        
        productCard.appendChild(image);
        productCard.appendChild(productInfo);
        
        productsGrid.appendChild(productCard);
    });
    
    resultado.appendChild(productsGrid);
}

// Función principal que maneja la carga y errores
async function cargarProductos() {
    const resultado = document.getElementById('resultado');
    
    // Manejo de Carga: mostrar mensaje mientras se hace el fetch
    resultado.innerHTML = '<div class="loading">Cargando productos</div>';
    
    try {
        const productos = await obtenerProductos();
        mostrarProductos(productos);
    } catch (error) {
        resultado.innerHTML = '';
        const err = document.createElement('div');
        err.className = 'error';
        err.innerHTML = `
            ❌ No se pudieron cargar los productos. Intenta más tarde.
            <br><br>
            <small>Detalle técnico: ${error.message}</small>
        `;
        const retry = document.createElement('button');
        retry.textContent = 'Reintentar';
        retry.style.marginTop = '12px';
        retry.onclick = () => cargarProductos();
        err.appendChild(retry);
        resultado.appendChild(err);
        console.error('cargarProductos fallo:', error);
    }
}

// Ejecutar la función cuando carga la página
window.addEventListener('DOMContentLoaded', cargarProductos);