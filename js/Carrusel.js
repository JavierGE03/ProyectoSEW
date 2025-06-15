class Carrusel {
    constructor(seccion) {
        this.imagenes = [
            {
                src: "multimedia/Plaza_Mayor.jpg",
                alt: "Plaza Mayor de Gijón",
                descripcion: "Centro histórico y corazón de la ciudad"
            },
            {
                src: "multimedia/Sanpedro.jpg",
                alt: "Iglesia de San Pedro",
                descripcion: "Emblemático templo junto al mar"
            },
            {
                src: "multimedia/basilica.jpg",
                alt: "Basílica del Sagrado Corazón",
                descripcion: "La Iglesiona, símbolo de Gijón"
            },
            {
                src: "multimedia/Sombras.jpg",
                alt: "Escultura Sombras de Luz",
                descripcion: "Arte moderno en el paseo marítimo"
            },
            {
                src: "multimedia/Mapa.jpg",
                alt: "Mapa de Gijón",
                descripcion: "Situación geográfica del concejo"
            }
        ];
        this.indiceActual = 0;
        this.seccion = seccion;
        this.crearEstructura();
        this.inicializar();
    }

    crearEstructura() {
        // Crear artículo con su encabezado
        const articulo = document.createElement('article');
        
        // Crear botones de navegación
        const btnAnterior = document.createElement('button');
        btnAnterior.textContent = "◄";
        btnAnterior.setAttribute('type', 'button');
        
        const btnSiguiente = document.createElement('button');
        btnSiguiente.textContent = "►";
        btnSiguiente.setAttribute('type', 'button');
        
        // Crear figura con imagen y leyenda
        const figura = document.createElement('figure');
        const imagen = document.createElement('img');
        imagen.src = this.imagenes[0].src;
        imagen.alt = this.imagenes[0].alt;
        
        const leyenda = document.createElement('figcaption');
        leyenda.textContent = this.imagenes[0].descripcion;
        
        figura.appendChild(imagen);
        figura.appendChild(leyenda);
        
        // Ensamblar el carrusel
        articulo.appendChild(btnAnterior);
        articulo.appendChild(figura);
        articulo.appendChild(btnSiguiente);
        
        // Añadir a la sección
        this.seccion.appendChild(articulo);
        
        // Guardar referencias
        this.btnAnterior = btnAnterior;
        this.btnSiguiente = btnSiguiente;
        this.imagen = imagen;
        this.leyenda = leyenda;
    }
    
    inicializar() {
        this.btnAnterior.addEventListener('click', () => {
            this.mostrarAnterior();
        });
        
        this.btnSiguiente.addEventListener('click', () => {
            this.mostrarSiguiente();
        });
    }
    
    mostrarAnterior() {
        this.indiceActual = (this.indiceActual - 1 + this.imagenes.length) % this.imagenes.length;
        this.actualizarImagen();
    }
    
    mostrarSiguiente() {
        this.indiceActual = (this.indiceActual + 1) % this.imagenes.length;
        this.actualizarImagen();
    }
    
    actualizarImagen() {
        const imagenActual = this.imagenes[this.indiceActual];
        this.imagen.src = imagenActual.src;
        this.imagen.alt = imagenActual.alt;
        this.leyenda.textContent = imagenActual.descripcion;
    }
}