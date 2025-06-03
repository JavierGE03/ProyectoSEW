class Meteorologia {
    constructor(selectorActual, selectorPrevision) {
        this.apiKey = 'c59ed51647296b593ab3b397488fb503';
        this.ciudad = 'Gijon';
        this.lat = 43.5357;
        this.lon = -5.6615;
        this.contenedorActual = $(selectorActual);
        this.contenedorPrevision = $(selectorPrevision);
        this.inicializar();
    }

    async inicializar() {
        try {
            await Promise.all([
                this.mostrarTiempoActual(),
                this.mostrarPrevisión()
            ]);
        } catch (error) {
            console.error('Error al cargar datos meteorológicos:', error);
        }
    }

    async mostrarTiempoActual() {
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${this.lat}&lon=${this.lon}&units=metric&lang=es&appid=${this.apiKey}`;
            const respuesta = await $.ajax({
                url: url,
                method: 'GET'
            });

            const html = `
                <section>
                    <h3>${respuesta.name}</h3>
                    <img src="https://openweathermap.org/img/wn/${respuesta.weather[0].icon}@2x.png" 
                         alt="${respuesta.weather[0].description}">
                    <p>${Math.round(respuesta.main.temp)}°C</p>
                    <p>${respuesta.weather[0].description}</p>
                    <ul>
                        <li>Humedad: ${respuesta.main.humidity}%</li>
                        <li>Viento: ${Math.round(respuesta.wind.speed * 3.6)} km/h</li>
                        <li>Presión: ${respuesta.main.pressure} hPa</li>
                    </ul>
                </section>
            `;

            this.contenedorActual.html(html);
        } catch (error) {
            console.error('Error al obtener tiempo actual:', error);
            this.contenedorActual.html('<p>Error al cargar el tiempo actual</p>');
        }
    }

    async mostrarPrevisión() {
        try {
            const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${this.lat}&lon=${this.lon}&units=metric&lang=es&appid=${this.apiKey}`;
            const respuesta = await $.ajax({
                url: url,
                method: 'GET'
            });

            const previsionesDiarias = this.procesarPrevisiones(respuesta.list);
            const html = this.generarHTMLPrevisiones(previsionesDiarias);

            this.contenedorPrevision.html(html);
        } catch (error) {
            console.error('Error al obtener previsión:', error);
            this.contenedorPrevision.html('<p>Error al cargar la previsión</p>');
        }
    }

    procesarPrevisiones(previsiones) {
        const previsionesPorDia = {};
        
        previsiones.forEach(prev => {
            const fecha = new Date(prev.dt * 1000).toLocaleDateString();
            if (!previsionesPorDia[fecha]) {
                previsionesPorDia[fecha] = prev;
            }
        });

        return Object.values(previsionesPorDia).slice(0, 7);
    }

    generarHTMLPrevisiones(previsiones) {
        return `
            <ol>
                ${previsiones.map(prev => `
                    <li>
                        <h3>${new Date(prev.dt * 1000).toLocaleDateString('es', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long'
                        })}</h3>
                        <figure>
                            <img src="https://openweathermap.org/img/wn/${prev.weather[0].icon}@4x.png" 
                                 alt="${prev.weather[0].description}">
                            <figcaption>${Math.round(prev.main.temp)}°C</figcaption>
                        </figure>
                        <p>${prev.weather[0].description}</p>
                        <ul>
                            <li>Humedad: ${prev.main.humidity}%</li>
                            <li>Viento: ${Math.round(prev.wind.speed * 3.6)} km/h</li>
                            <li>Presión: ${prev.main.pressure} hPa</li>
                        </ul>
                    </li>
                `).join('')}
            </ol>
        `;
    }
}
