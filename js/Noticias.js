class Noticias {
    constructor(selector) {
        this.contenedor = $(selector);
        this.inicializar();
    }

    async inicializar() {
        try {
            const noticias = await this.obtenerNoticias();
            this.mostrarNoticias(noticias);
        } catch (error) {
            console.error('Error al cargar noticias:', error);
            this.contenedor.html('<p>Error al cargar las noticias</p>');
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
        const lista = $('<ol>');

        noticias.forEach(noticia => {
            const articulo = $('<article>');
            const titulo = $('<h3>').text(noticia.title);
            const fecha = $('<time>')
                .attr('datetime', noticia.pubDate)
                .text(new Date(noticia.pubDate).toLocaleDateString());
            const descripcion = $('<p>').text(noticia.description || '');
            const enlace = $('<a>')
                .attr('href', noticia.link)
                .attr('target', '_blank')
                .text('Leer más');

            if (noticia.image_url) {
                const imagen = $('<img>')
                    .attr('src', noticia.image_url)
                    .attr('alt', noticia.title);
                articulo.append(imagen);
            }

            articulo.append(titulo, fecha, descripcion, enlace);
            lista.append($('<li>').append(articulo));
        });

        this.contenedor.empty().append(lista);
    }
}