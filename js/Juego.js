class Juego {
    constructor() {
        this.preguntas = [
            {
                pregunta: "¿Qué famosa escultura se encuentra en el paseo marítimo de Gijón?",
                opciones: [
                    "La Madre del Emigrante ('La Lloca')",
                    "El Pensador",
                    "La Sirena",
                    "El Pescador",
                    "El Marinero"
                ],
                correcta: 0
            },
            {
                pregunta: "¿Qué edificio emblemático alberga el Museo de Gijón?",
                opciones: [
                    "Palacio de los Deportes",
                    "Palacio de Revillagigedo",
                    "Casa Natal de Jovellanos",
                    "Teatro Jovellanos",
                    "Universidad Laboral"
                ],
                correcta: 1
            },
            {
                pregunta: "¿Cómo se llama la playa principal de Gijón?",
                opciones: [
                    "Playa del Arbeyal",
                    "Playa de Poniente",
                    "Playa de San Lorenzo",
                    "Playa del Rinconín",
                    "Playa de los Mayanes"
                ],
                correcta: 2
            },
            {
                pregunta: "¿Qué símbolo de Gijón es conocido como 'Elogio del Horizonte'?",
                opciones: [
                    "Un faro",
                    "Una estatua de bronce",
                    "Una fuente",
                    "Una escultura de hormigón de Chillida",
                    "Un mirador"
                ],
                correcta: 3
            },
            {
                pregunta: "¿Qué barrio histórico de Gijón es conocido como el barrio de los pescadores?",
                opciones: [
                    "Cimadevilla",
                    "La Arena",
                    "El Centro",
                    "La Calzada",
                    "Somió"
                ],
                correcta: 0
            },
            {
                pregunta: "¿Qué tipo de bebida es típica en las sidrerías de Gijón?",
                opciones: [
                    "Vino blanco",
                    "Sidra natural",
                    "Cerveza artesanal",
                    "Vermut",
                    "Sangría"
                ],
                correcta: 1
            },
            {
                pregunta: "¿Qué construcción romana se puede visitar en el barrio de Campo Valdés?",
                opciones: [
                    "Un acueducto",
                    "Un anfiteatro",
                    "Unas termas",
                    "Un templo",
                    "Una muralla"
                ],
                correcta: 2
            },
            {
                pregunta: "¿Qué fiesta popular se celebra en Gijón durante el mes de agosto?",
                opciones: [
                    "Carnaval",
                    "Feria de Muestras",
                    "San Valentín",
                    "Semana Grande",
                    "Navidad"
                ],
                correcta: 3
            },
            {
                pregunta: "¿Qué deporte tradicional asturiano se practica en Gijón?",
                opciones: [
                    "Bolos asturianos",
                    "Pelota vasca",
                    "Lucha leonesa",
                    "Balonmano",
                    "Rugby"
                ],
                correcta: 0
            },
            {
                pregunta: "¿Qué museo científico interactivo se encuentra en Gijón?",
                opciones: [
                    "Museo del Ferrocarril",
                    "Laboral Centro de Arte",
                    "Museo del Pueblo de Asturias",
                    "Acuario",
                    "Museo de la Sidra"
                ],
                correcta: 1
            }
        ];
        this.preguntaActual = 0;
        this.respuestas = [];
       this.preguntaActual = 0;
        this.respuestas = [];
    }

    iniciar() {
        this.contenedor = document.querySelector('main > section > section');
        this.mostrarPregunta();
    }

    mostrarPregunta() {
        if (this.preguntaActual < this.preguntas.length) {
            const pregunta = this.preguntas[this.preguntaActual];
            
            this.contenedor.innerHTML = `
                <h3>Pregunta ${this.preguntaActual + 1} de 10</h3>
                <p>${pregunta.pregunta}</p>
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
