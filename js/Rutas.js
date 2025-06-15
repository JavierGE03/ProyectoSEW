class Rutas {
    constructor() {
        this.rutas = [];
    }

    inicializar() {
        let rutasArticle = document.querySelector('main > article');
        if (!rutasArticle) {
            rutasArticle = document.createElement('article');
            document.querySelector('main').appendChild(rutasArticle);
        }
        rutasArticle.innerHTML = '';
        
        // Crear una sección para el formulario de carga
        const cargaSection = document.createElement('section');
        cargaSection.setAttribute('aria-label', 'Carga de rutas');
        
        // Crear un formulario para mantener el control
        const form = document.createElement('form');
        form.onsubmit = (e) => e.preventDefault(); // Evitar envío de formulario
        
        // Crear el label
        const label = document.createElement('label');
        label.textContent = 'Selecciona un archivo XML de rutas: ';
        label.setAttribute('for', 'rutasXmlInput');
        label.style.marginRight = '1em';
        
        // Crear el input
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.xml';
        input.id = 'rutasXmlInput';
        input.addEventListener('change', (e) => this.cargarXML(e.target.files[0]));
        
        // Añadir elementos al DOM
        form.appendChild(label);
        form.appendChild(input);
        cargaSection.appendChild(form);
        rutasArticle.appendChild(cargaSection);
    }

    async cargarXML(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(e.target.result, "text/xml");
            this.rutas = Array.from(xmlDoc.getElementsByTagName('ruta')).map(ruta => ({
                nombre: ruta.getElementsByTagName('nombre')[0]?.textContent || '',
                tipo: ruta.getElementsByTagName('tipo')[0]?.textContent || '',
                descripcion: ruta.getElementsByTagName('descripcion')[0]?.textContent || '',
                planimetria: ruta.getElementsByTagName('planimetria')[0]?.textContent || '',
                altimetria: ruta.getElementsByTagName('altimetria')[0]?.textContent || '',
                transporte: ruta.getElementsByTagName('transporte')[0]?.textContent || '',
                agencia: ruta.getElementsByTagName('agencia')[0]?.textContent || '',
                horario: this.extraerHorario(ruta.getElementsByTagName('horario')[0]),
                hitos: this.extraerHitos(ruta)
            }));
            this.mostrarListaRutas();
        };
        reader.readAsText(file);
    }

    extraerHorario(horarioElem) {
        if (!horarioElem) return null;
        return {
            fecha_inicio: horarioElem.getElementsByTagName('fecha_inicio')[0]?.textContent || '',
            hora_inicio: horarioElem.getElementsByTagName('hora_inicio')[0]?.textContent || '',
            duracion: horarioElem.getElementsByTagName('duracion')[0]?.textContent || ''
        };
    }

    extraerHitos(rutaElement) {
        return Array.from(rutaElement.getElementsByTagName('hito')).map(hito => ({
            nombre: hito.getElementsByTagName('nombre')[0]?.textContent || '',
            descripcion: hito.getElementsByTagName('descripcion')[0]?.textContent || '',
            coordenadas: {
                lon: parseFloat(hito.querySelector('coordenadas longitud')?.textContent || 0),
                lat: parseFloat(hito.querySelector('coordenadas latitud')?.textContent || 0),
                alt: parseFloat(hito.querySelector('coordenadas altitud')?.textContent || 0)
            },
            distancia_anterior: hito.getElementsByTagName('distancia_anterior')[0]?.textContent || '',
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

            // Información adicional
            const ul = document.createElement('ul');
            if (ruta.tipo) {
                const liTipo = document.createElement('li');
                liTipo.textContent = `Tipo: ${ruta.tipo}`;
                ul.appendChild(liTipo);
            }
            if (ruta.transporte) {
                const liTransporte = document.createElement('li');
                liTransporte.textContent = `Transporte: ${ruta.transporte}`;
                ul.appendChild(liTransporte);
            }
            if (ruta.agencia) {
                const liAgencia = document.createElement('li');
                liAgencia.textContent = `Agencia: ${ruta.agencia}`;
                ul.appendChild(liAgencia);
            }
            if (ruta.horario) {
                const liHorario = document.createElement('li');
                liHorario.textContent = `Horario: ${ruta.horario.fecha_inicio ? 'Fecha inicio: ' + ruta.horario.fecha_inicio + ', ' : ''}${ruta.horario.hora_inicio ? 'Hora inicio: ' + ruta.horario.hora_inicio + ', ' : ''}${ruta.horario.duracion ? 'Duración: ' + ruta.horario.duracion : ''}`;
                ul.appendChild(liHorario);
            }

            const button = document.createElement('button');
            button.textContent = 'Ver detalles';
            button.addEventListener('click', () => this.mostrarDetallesRuta(index));

            article.appendChild(h2);
            article.appendChild(p);
            if (ul.children.length > 0) article.appendChild(ul);
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

        // Información adicional
        const ul = document.createElement('ul');
        if (ruta.tipo) {
            const liTipo = document.createElement('li');
            liTipo.textContent = `Tipo: ${ruta.tipo}`;
            ul.appendChild(liTipo);
        }
        if (ruta.transporte) {
            const liTransporte = document.createElement('li');
            liTransporte.textContent = `Transporte: ${ruta.transporte}`;
            ul.appendChild(liTransporte);
        }
        if (ruta.agencia) {
            const liAgencia = document.createElement('li');
            liAgencia.textContent = `Agencia: ${ruta.agencia}`;
            ul.appendChild(liAgencia);
        }
        if (ruta.horario) {
            const liHorario = document.createElement('li');
            liHorario.textContent = `Horario: ${ruta.horario.fecha_inicio ? 'Fecha inicio: ' + ruta.horario.fecha_inicio + ', ' : ''}${ruta.horario.hora_inicio ? 'Hora inicio: ' + ruta.horario.hora_inicio + ', ' : ''}${ruta.horario.duracion ? 'Duración: ' + ruta.horario.duracion : ''}`;
            ul.appendChild(liHorario);
        }

        const botonVolver = document.createElement('button');
        botonVolver.textContent = 'Volver';
        botonVolver.addEventListener('click', () => this.mostrarListaRutas());

        const figure = document.createElement('figure');
        const mapaContainer = document.createElement('div');
        const altimetriaContainer = document.createElement('div');
        figure.appendChild(mapaContainer);
        figure.appendChild(altimetriaContainer);

        article.appendChild(h2);
        article.appendChild(p);
        if (ul.children.length > 0) article.appendChild(ul);
        article.appendChild(botonVolver);
        article.appendChild(figure);

        if (ruta.planimetria) {
            this.cargarKMLDesdeURL('xml/' + ruta.planimetria, mapaContainer, ruta);
        } else {
            mapaContainer.textContent = "No hay mapa disponible.";
        }

        if (ruta.altimetria) {
            this.cargarSVGDesdeURL('xml/' + ruta.altimetria, altimetriaContainer);
        } else {
            altimetriaContainer.textContent = "No hay altimetría disponible.";
        }

        ruta.hitos.forEach((hito, i) => {
            const hitoSection = document.createElement('section');
            const hitoNombre = document.createElement('h3');
            hitoNombre.textContent = hito.nombre;
            const hitoDesc = document.createElement('p');
            hitoDesc.textContent = hito.descripcion;


            hitoSection.appendChild(hitoNombre);
            hitoSection.appendChild(hitoDesc);

            // Solo mostrar coordenadas y distancia si NO es el primer hito
            if (i > 0) {
                const hitoCoords = document.createElement('p');
                hitoCoords.textContent = `Coordenadas: Longitud ${hito.coordenadas.lon}, Latitud ${hito.coordenadas.lat}, Altitud ${hito.coordenadas.alt}`;
                hitoSection.appendChild(hitoCoords);

                if (hito.distancia_anterior) {
                    const hitoDist = document.createElement('p');
                    hitoDist.textContent = `Distancia desde el anterior: ${hito.distancia_anterior} m`;
                    hitoSection.appendChild(hitoDist);
                }
            }
            
            if (hito.fotos && Array.isArray(hito.fotos)) {
                hito.fotos.forEach(foto => {
                    const img = document.createElement('img');
                    img.src = foto.startsWith('/multimedia/') ? foto.substring(1) : foto;
                    img.alt = hito.nombre;
                    hitoSection.appendChild(img);
                });
            }

            article.appendChild(hitoSection);
        });

        rutasArticle.appendChild(article);
    }

    cargarKMLDesdeURL(url, contenedor, ruta) {
        fetch(url)
            .then(response => response.text())
            .then(kmlText => {
                contenedor.innerHTML = "";
                const map = new ol.Map({
                    target: contenedor,
                    layers: [new ol.layer.Tile({ source: new ol.source.OSM() })],
                    view: new ol.View({
                        center: ol.proj.fromLonLat([
                            ruta.hitos[0]?.coordenadas.lon || -5.6639,
                            ruta.hitos[0]?.coordenadas.lat || 43.5453
                        ]),
                        zoom: 14
                    })
                });

                const kmlSource = new ol.source.Vector({
                    features: new ol.format.KML().readFeatures(kmlText, {
                        featureProjection: 'EPSG:3857'
                    })
                });

                map.addLayer(new ol.layer.Vector({ source: kmlSource }));
            })
            .catch(() => {
                contenedor.textContent = "No se pudo cargar el mapa.";
            });
    }

    cargarSVGDesdeURL(url, contenedor) {
        fetch(url)
            .then(response => response.text())
            .then(svgText => {
                contenedor.innerHTML = svgText;
            })
            .catch(() => {
                contenedor.textContent = "No se pudo cargar la altimetría.";
            });
    }
}