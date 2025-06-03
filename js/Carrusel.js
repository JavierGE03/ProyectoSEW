class Carrusel {
    constructor(selector) {
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
        this.contenedor = document.querySelector(selector);
        this.inicializar();
    }

    inicializar() {
        const btnAnterior = this.contenedor.querySelector('button:first-of-type');
        const btnSiguiente = this.contenedor.querySelector('button:last-of-type');
        
        btnAnterior.addEventListener('click', () => this.mostrarAnterior());
        btnSiguiente.addEventListener('click', () => this.mostrarSiguiente());
    }

    mostrarImagen(indice) {
        const imagen = this.imagenes[indice];
        const figure = this.contenedor.querySelector('figure');
        const img = figure.querySelector('img');
        const figcaption = figure.querySelector('figcaption');
        
        img.src = imagen.src;
        img.alt = imagen.alt;
        figcaption.textContent = imagen.descripcion;
    }

    mostrarSiguiente() {
        this.indiceActual = (this.indiceActual + 1) % this.imagenes.length;
        this.mostrarImagen(this.indiceActual);
    }

    mostrarAnterior() {
        this.indiceActual = (this.indiceActual - 1 + this.imagenes.length) % this.imagenes.length;
        this.mostrarImagen(this.indiceActual);
    }
}