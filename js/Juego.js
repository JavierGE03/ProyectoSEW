class Juego {
    constructor() {
        this.preguntas = [
            {
                pregunta: "¿Cómo se llama la escultura situada al final del paseo marítimo de Gijón, conocida como 'La Lloca'?",
                opciones: [
                    "La Madre del Emigrante",
                    "Solidaridad",
                    "Sombras de Luz",
                    "Elogio del Horizonte",
                    "Galileo Galilei XV"
                ],
                correcta: 0,
                imagen: "multimedia/Lloca.jpg"
            },
            {
                pregunta: "¿Qué edificio aparece en la imagen y es conocido como 'La Iglesiona'?",
                opciones: [
                    "Iglesia de San Pedro",
                    "Basílica del Sagrado Corazón",
                    "Casa Gerardo",
                    "Café Dindurra",
                    "Sidrería Puente Romano"
                ],
                correcta: 1,
                imagen: "multimedia/basilica.jpg"
            },
            {
                pregunta: "¿Qué ruta turística de la aplicación recorre la costa y termina en el Mirador de la Providencia?",
                opciones: [
                    "Ruta Gastronómica por Gijón Centro",
                    "Ruta Mixta: Tapas y Monumentos",
                    "Senda del Cervigón",
                    "Ruta de los Museos",
                    "Ruta de la Sidra"
                ],
                correcta: 2,
                imagen: "multimedia/Providencia.jpg"
            },
            {
                pregunta: "¿Cuál es el nombre del restaurante de alta cocina asturiana con estrella Michelin que aparece en la aplicación?",
                opciones: [
                    "Casa Gerardo",
                    "La Salgar",
                    "Tierra Astur",
                    "El Candil",
                    "Coalla"
                ],
                correcta: 1,
                imagen: "multimedia/Coalla.jpg"
            },
            {
                pregunta: "¿Qué escultura de la imagen representa cadenas entrelazadas y simboliza la unión y la libertad?",
                opciones: [
                    "Sombras de Luz",
                    "Solidaridad",
                    "Galileo Galilei XV",
                    "La Madre del Emigrante",
                    "Mirador de la Providencia"
                ],
                correcta: 1,
                imagen: "multimedia/escultura-solidaridad.jpg"
            },
            {
                pregunta: "¿Qué escultura moderna situada al inicio de la Senda del Cervigón aparece en la imagen?",
                opciones: [
                    "Sombras de Luz",
                    "Solidaridad",
                    "La Madre del Emigrante",
                    "Elogio del Horizonte",
                    "Galileo Galilei XV"
                ],
                correcta: 0,
                imagen: "multimedia/Sombras.jpg"
            },
            {
                pregunta: "¿Cómo se llama el café histórico de Gijón que aparece en la ruta gastronómica?",
                opciones: [
                    "Café Dindurra",
                    "Café Gijón",
                    "Café Central",
                    "Café Moderno",
                    "Café Asturias"
                ],
                correcta: 0,
                imagen: "multimedia/Dindurra.jpg"
            },
            {
                pregunta: "¿Qué plaza emblemática de Gijón aparece en la imagen?",
                opciones: [
                    "Plaza Mayor",
                    "Plaza del Ayuntamiento",
                    "Plaza de Europa",
                    "Plaza del Carmen",
                    "Plaza San Miguel"
                ],
                correcta: 0,
                imagen: "multimedia/Plaza_Mayor.jpg"
            },
            {
                pregunta: "¿Qué restaurante de cocina fusión es el punto de inicio de la Ruta Gastronómica por Gijón Centro?",
                opciones: [
                    "Umami Gijón",
                    "Zascandil",
                    "La Salgar",
                    "Casa Gerardo",
                    "Tierra Astur"
                ],
                correcta: 0,
                imagen: "multimedia/umami.jpg"
            },
            {
                pregunta: "¿Qué tienda gourmet de productos asturianos aparece en la ruta gastronómica?",
                opciones: [
                    "Coalla",
                    "La Gijonesa",
                    "Casa Trabanco",
                    "Casa Victor",
                    "Zascandil"
                ],
                correcta: 1,
                imagen: "multimedia/Gijonesa.jpg"
            }
        ];
        this.preguntaActual = 0;
        this.respuestas = [];
    }

    iniciar() {
        const seccionPrincipal = document.querySelector('main > section');
    
        const seccionJuego = document.createElement('section');
        seccionPrincipal.appendChild(seccionJuego);
        
        this.contenedor = seccionJuego;        
        this.mostrarPregunta();
    }

    mostrarPregunta() {
        if (this.preguntaActual < this.preguntas.length) {
            const pregunta = this.preguntas[this.preguntaActual];

            this.contenedor.innerHTML = `
                <h3>Pregunta ${this.preguntaActual + 1} de ${this.preguntas.length}</h3>
                <p>${pregunta.pregunta}</p>
                ${pregunta.imagen ? `<figure><img src="${pregunta.imagen}" alt="Ayuda visual"></figure>` : ''}
                <h4></h4>
                <section>
                    <fieldset>
                        <legend>Selecciona una respuesta:</legend>
                        ${pregunta.opciones.map((opcion, index) => `
                            <label>
                                <input type="radio" name="respuesta" value="${index}">
                                ${opcion}
                            </label>
                        `).join('')}
                    </fieldset>
                </section>
                <section>
                    <nav>
                        ${this.preguntaActual > 0 ? 
                            '<button type="button">Anterior</button>' : 
                            ''}
                        <button type="submit">Siguiente</button>
                    </nav>
                </section>
            `;

            const botones = this.contenedor.querySelectorAll('button');
            botones[botones.length - 1].addEventListener('click', () => this.siguientePregunta());

            if (botones.length > 1) {
                botones[0].addEventListener('click', () => this.anteriorPregunta());
            }
        } else {
            this.mostrarResultado();
        }
    }

    siguientePregunta() {
        const seleccionada = this.contenedor.querySelector('input[name="respuesta"]:checked');
        const mensajeError = this.contenedor.querySelector('h4');
        
        if (!seleccionada) {
            mensajeError.textContent = '⚠️ Por favor, selecciona una respuesta antes de continuar';
            mensajeError.style.opacity = '1';
            return;
        }

        mensajeError.textContent = '';
        this.respuestas[this.preguntaActual] = parseInt(seleccionada.value);
        this.preguntaActual++;
        this.mostrarPregunta();
    }

    anteriorPregunta() {
        if (this.preguntaActual > 0) {
            this.preguntaActual--;
            this.mostrarPregunta();
            
            // Marcar la respuesta previamente seleccionada
            const respuestaPrevia = this.respuestas[this.preguntaActual];
            if (respuestaPrevia !== undefined) {
                const radio = this.contenedor.querySelector(`input[value="${respuestaPrevia}"]`);
                if (radio) radio.checked = true;
            }
        }
    }

    mostrarResultado() {
    const aciertos = this.respuestas.filter((respuesta, index) => 
        respuesta === this.preguntas[index].correcta
    ).length;

    this.contenedor.innerHTML = `
        <section>
            <h3>¡Test completado!</h3>
            <p>Has acertado ${aciertos} de 10 preguntas</p>
            <p>Tu puntuación final es:</p>
            <h2>${aciertos}</h2>
            <button type="button">Volver a intentar</button>
        </section>
    `;
    const botonReinicio = this.contenedor.querySelector('button');
    botonReinicio.addEventListener('click', () => {
        this.preguntaActual = 0;
        this.respuestas = [];
        this.mostrarPregunta();
    });
}
}
