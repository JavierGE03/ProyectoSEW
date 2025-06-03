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
            const apiKey = 'ed548af0-b823-4656-8754-a1616bcaa0e0';
            const url = 'http://eventregistry.org/api/v1/article/getArticles';
            
            const data = {
                "query": {
                    "$query": {
                        "$and": [
                            {
                                "locationUri": "http://en.wikipedia.org/wiki/Gijón"
                            },
                            {
                                "lang": "spa"
                            }
                        ]
                    },
                    "$filter": {
                        "forceMaxDataTimeWindow": "31"
                    }
                },
                "resultType": "articles",
                "articlesSortBy": "date",
                "apiKey": apiKey
            };

            console.log('Intentando obtener noticias...');
            
            const respuesta = await $.ajax({
                url: url,
                type: "POST",
                data: JSON.stringify(data),
                contentType: "application/json"
            });

            console.log('Datos recibidos:', respuesta);
            
            if (respuesta.error) {
                throw new Error(`Error de API: ${respuesta.error}`);
            }
            
            // Adaptado a la estructura específica del JSON
            return respuesta.articles?.results?.slice(0, 5) || [];
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
                .attr('datetime', noticia.dateTime)
                .text(new Date(noticia.dateTime).toLocaleDateString());
            const descripcion = $('<p>').text(noticia.body?.split('\n')[0] || ''); // Primera línea del body
            const enlace = $('<a>')
                .attr('href', noticia.url)
                .attr('target', '_blank')
                .text('Leer más');

            if (noticia.image) {
                const imagen = $('<img>')
                    .attr('src', noticia.image)
                    .attr('alt', noticia.title);
                articulo.append(imagen);
            }

            articulo.append(titulo, fecha, descripcion, enlace);
            lista.append($('<li>').append(articulo));
        });

        this.contenedor.empty().append(lista);
    }
}