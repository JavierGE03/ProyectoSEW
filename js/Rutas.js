class Rutas {
    constructor() {
        this.rutas = [];
    }

    inicializar() {
        // Crea un único article para rutas
        let rutasArticle = document.querySelector('main > article');
        if (!rutasArticle) {
            rutasArticle = document.createElement('article');
            document.querySelector('main').appendChild(rutasArticle);
        }
        rutasArticle.innerHTML = '';
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.xml';
        input.addEventListener('change', (e) => this.cargarXML(e.target.files[0]));
        rutasArticle.appendChild(input);
    }

    async cargarXML(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(e.target.result, "text/xml");
            this.rutas = Array.from(xmlDoc.getElementsByTagName('ruta')).map(ruta => ({
                nombre: ruta.getElementsByTagName('nombre')[0].textContent,
                tipo: ruta.getElementsByTagName('tipo')[0].textContent,
                descripcion: ruta.getElementsByTagName('descripcion')[0].textContent,
                planimetria: ruta.getElementsByTagName('planimetria')[0].textContent,
                altimetria: ruta.getElementsByTagName('altimetria')[0].textContent,
                hitos: this.extraerHitos(ruta)
            }));
            this.mostrarListaRutas();
        };
        reader.readAsText(file);
    }

    extraerHitos(rutaElement) {
    return Array.from(rutaElement.getElementsByTagName('hito')).map(hito => ({
        nombre: hito.getElementsByTagName('nombre')[0].textContent,
        descripcion: hito.getElementsByTagName('descripcion')[0].textContent,
        coordenadas: {
            lon: parseFloat(hito.querySelector('coordenadas longitud').textContent),
            lat: parseFloat(hito.querySelector('coordenadas latitud').textContent),
            alt: parseFloat(hito.querySelector('coordenadas altitud').textContent)
        },
        fotos: Array.from(hito.getElementsByTagName('foto')).map(f => f.textContent)
    }));
}

    mostrarListaRutas() {
        const rutasArticle = document.querySelector('main > article');
        rutasArticle.innerHTML = '';

        this.rutas.forEach((ruta, index) => {
            const article = document.createElement('article');
            const h2 = document.createElement('h2');
            h2.textContent = ruta.nombre;
            const p = document.createElement('p');
            p.textContent = ruta.descripcion;

            const button = document.createElement('button');
            button.textContent = 'Ver detalles';
            button.addEventListener('click', () => this.mostrarDetallesRuta(index));

            article.appendChild(h2);
            article.appendChild(p);
            article.appendChild(button);
            rutasArticle.appendChild(article);
        });
    }

    async mostrarDetallesRuta(index) {
        const ruta = this.rutas[index];
        const rutasArticle = document.querySelector('main > article');
        rutasArticle.innerHTML = '';

        const article = document.createElement('article');
        const h2 = document.createElement('h2');
        h2.textContent = ruta.nombre;
        const p = document.createElement('p');
        p.textContent = ruta.descripcion;

        const botonVolver = document.createElement('button');
        botonVolver.textContent = 'Volver';
        botonVolver.addEventListener('click', () => this.mostrarListaRutas());

        const kmlInput = document.createElement('input');
        kmlInput.type = 'file';
        kmlInput.accept = '.kml';

        const svgInput = document.createElement('input');
        svgInput.type = 'file';
        svgInput.accept = '.svg';

        // Usar figure como contenedor único para los div de mapa y altimetría
        const figure = document.createElement('figure');

        // Mapa
        const mapaContainer = document.createElement('div');

        // Altimetría
        const altimetriaContainer = document.createElement('div');
        

        figure.appendChild(mapaContainer);
        figure.appendChild(altimetriaContainer);

        article.appendChild(h2);
        article.appendChild(p);
        article.appendChild(botonVolver);
        article.appendChild(kmlInput);
        article.appendChild(svgInput);
        article.appendChild(figure);

        // Mostrar información de los hitos
        ruta.hitos.forEach(hito => {
            const hitoSection = document.createElement('section');
            const hitoNombre = document.createElement('h3');
            hitoNombre.textContent = hito.nombre;
            const hitoDesc = document.createElement('p');
            hitoDesc.textContent = hito.descripcion;

            hitoSection.appendChild(hitoNombre);
            hitoSection.appendChild(hitoDesc);

            // Mostrar fotos si existen
            if (hito.fotos && Array.isArray(hito.fotos)) {
                hito.fotos.forEach(foto => {
                    const img = document.createElement('img');
                    // Corrige la ruta si empieza por "/multimedia/"
                    img.src = foto.startsWith('/multimedia/') ? foto.substring(1) : foto;
                    img.alt = hito.nombre;
                    hitoSection.appendChild(img);
                });
            }

            article.appendChild(hitoSection);
        });

        kmlInput.addEventListener('change', (e) => {
            this.cargarKML(e.target.files[0], mapaContainer, ruta);
        });

        svgInput.addEventListener('change', (e) => {
            this.cargarSVG(e.target.files[0], altimetriaContainer);
        });

        rutasArticle.appendChild(article);
    }

    cargarKML(file, contenedor, ruta) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const map = new ol.Map({
                target: contenedor,
                layers: [new ol.layer.Tile({source: new ol.source.OSM()})],
                view: new ol.View({
                    center: ol.proj.fromLonLat([ruta.hitos[0].coordenadas.lon, ruta.hitos[0].coordenadas.lat]),
                    zoom: 14
                })
            });

            const kmlSource = new ol.source.Vector({
                features: new ol.format.KML().readFeatures(e.target.result, {
                    featureProjection: 'EPSG:3857'
                })
            });

            map.addLayer(new ol.layer.Vector({source: kmlSource}));
        };
        reader.readAsText(file);
    }

    cargarSVG(file, contenedor) {
        const reader = new FileReader();
        reader.onload = (e) => {
            // Inserta el SVG tal cual, sin modificarlo
            contenedor.innerHTML = e.target.result;
        };
        reader.readAsText(file);
    }
}