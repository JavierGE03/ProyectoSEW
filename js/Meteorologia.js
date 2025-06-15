class Meteorologia {
    constructor(selectorActual, selectorPrevision) {
        this.contenedorActual = $(selectorActual);
        this.contenedorPrevision = $(selectorPrevision);
        this.crearEstructura();
        this.inicializar();
    }
    crearEstructura() {
        // Crear articles para cada sección
        const articleActual = document.createElement('article');
        const articlePrevision = document.createElement('article');

        // Añadir los articles a sus respectivas secciones
        this.contenedorActual.append(articleActual);
        this.contenedorPrevision.append(articlePrevision);

        // Actualizar los selectores para apuntar a los nuevos articles
        this.contenedorActual = this.contenedorActual.find('article');
        this.contenedorPrevision = this.contenedorPrevision.find('article');
    }

    async inicializar() {
        try {
            await this.mostrarPrevisionOpenMeteo();
        } catch (error) {
            console.error('Error al cargar datos meteorológicos:', error);
        }
    }

    async mostrarPrevisionOpenMeteo() {
        try {
            const url = 'https://api.open-meteo.com/v1/forecast?latitude=43.53573&longitude=-5.66152&hourly=temperature_2m';
            const respuesta = await $.ajax({
                url: url,
                method: 'GET'
            });

           // Buscar la hora más cercana a la actual
            const ahoraSistema = new Date();
            let indiceCercano = 0;
            let diferenciaMin = Infinity;
            respuesta.hourly.time.forEach((t, i) => {
                const diff = Math.abs(new Date(t) - ahoraSistema);
                if (diff < diferenciaMin) {
                    diferenciaMin = diff;
                    indiceCercano = i;
                }
            });
            const horaActual = respuesta.hourly.time[indiceCercano];
            const tempActual = respuesta.hourly.temperature_2m[indiceCercano];
            const htmlActual = `
                <table>
                    <caption>Temperatura actual</caption>
                    <tbody>
                        <tr>
                            <th scope="row">Fecha y hora</th>
                            <td>${new Date(horaActual).toLocaleString('es')}</td>
                        </tr>
                        <tr>
                            <th scope="row">Temperatura</th>
                            <td>${tempActual}°C</td>
                        </tr>
                    </tbody>
                </table>
            `;
            this.contenedorActual.html(htmlActual);
            
            // Mostramos la previsión para las próximas 24 horas
            const htmlPrevision = this.generarHTMLPrevisionesOpenMeteo(respuesta.hourly);
            this.contenedorPrevision.html(htmlPrevision);

        } catch (error) {
            console.error('Error al obtener previsión:', error);
            this.contenedorActual.html('<p>Error al cargar la temperatura actual</p>');
            this.contenedorPrevision.html('<p>Error al cargar la previsión</p>');
        }
    }

   generarHTMLPrevisionesOpenMeteo(hourly) {
    // Agrupar temperaturas por día
    const dias = {};
    hourly.time.forEach((hora, i) => {
        const dia = hora.slice(0, 10); // "YYYY-MM-DD"
        if (!dias[dia]) dias[dia] = [];
        dias[dia].push(hourly.temperature_2m[i]);
    });

    // Calcular estadísticas de cada día y quedarnos con los 7 primeros días
    const resumen = Object.entries(dias)
        .slice(0, 7)
        .map(([dia, temps]) => {
            const media = temps.reduce((a, b) => a + b, 0) / temps.length;
            const max = Math.max(...temps);
            const min = Math.min(...temps);
            return {
                dia,
                media: media.toFixed(1),
                max: max.toFixed(1),
                min: min.toFixed(1)
            };
        });

    // Generar HTML limpio (tabla sin estilos en línea)
    return `
        <table>
            <thead>
                <tr>
                    <th>Día</th>
                    <th>Media 🌡️</th>
                    <th>Mínima ⬇️</th>
                    <th>Máxima ⬆️</th>
                </tr>
            </thead>
            <tbody>
                ${resumen.map(d =>
                    `<tr>
                        <td>
                            <strong>${new Date(d.dia).toLocaleDateString('es', { weekday: 'long' })}</strong><br>
                            <small>${new Date(d.dia).toLocaleDateString('es', { day: '2-digit', month: '2-digit' })}</small>
                        </td>
                        <td>${d.media}°C</td>
                        <td>${d.min}°C</td>
                        <td>${d.max}°C</td>
                    </tr>`
                ).join('')}
            </tbody>
        </table>
    `;
}
}
