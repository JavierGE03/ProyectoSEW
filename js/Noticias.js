class Noticias {
    constructor(seccion) {
        this.seccion = seccion;
        this.inicializar();
    }

    async inicializar() {
        try {
            const noticias = await this.obtenerNoticias();
            this.mostrarNoticias(noticias);
        } catch (error) {
            console.error('Error al cargar noticias:', error);
            // Creamos el artículo con un encabezado aún en caso de error
            const articulo = document.createElement('article');
            const h3 = document.createElement('h3');
            h3.textContent = 'Error en el servicio de noticias';
            const mensaje = document.createElement('p');
            mensaje.textContent = 'No se pudieron cargar las noticias en este momento';
            
            articulo.appendChild(h3);
            articulo.appendChild(mensaje);
            this.seccion.appendChild(articulo);
        }
    }

    async obtenerNoticias() {
        try {
            const url = 'https://newsdata.io/api/1/latest?apikey=pub_2ed9958de11246df8df9859df0544622&q=Gijon&language=es';

            const respuesta = await $.ajax({
                url: url,
                type: "GET",
                dataType: "json"
            });

            // Devuelve los primeros 5 resultados
            return respuesta.results?.slice(0, 5) || [];
        } catch (error) {
            console.error('Error detallado:', error);
            throw error;
        }
    }

    mostrarNoticias(noticias) {
        // Crear el artículo contenedor (sin encabezado, ya existe el h2 en la sección)
        const articulo = document.createElement('article');
        const lista = document.createElement('ol');

        noticias.forEach(noticia => {
            const itemLista = document.createElement('li');
            const noticiaArticulo = document.createElement('article');

            // Cada noticia tiene su propio encabezado h3
            const titulo = document.createElement('h3');
            titulo.textContent = noticia.title;

            const fecha = document.createElement('time');
            fecha.setAttribute('datetime', noticia.pubDate);
            fecha.textContent = new Date(noticia.pubDate).toLocaleDateString();

            const descripcion = document.createElement('p');
            descripcion.textContent = noticia.description || '';

            const enlace = document.createElement('a');
            enlace.setAttribute('href', noticia.link);
            enlace.setAttribute('target', '_blank');
            enlace.textContent = 'Leer más';

            if (noticia.image_url) {
                const imagen = document.createElement('img');
                imagen.setAttribute('src', noticia.image_url);
                imagen.setAttribute('alt', noticia.title);
                noticiaArticulo.appendChild(imagen);
            }

            noticiaArticulo.appendChild(titulo);
            noticiaArticulo.appendChild(fecha);
            noticiaArticulo.appendChild(descripcion);
            noticiaArticulo.appendChild(enlace);

            itemLista.appendChild(noticiaArticulo);
            lista.appendChild(itemLista);
        });

        articulo.appendChild(lista);

        // Limpiar la sección y agregar el artículo
        this.seccion.querySelector('article')?.remove();
        this.seccion.appendChild(articulo);
    }
}