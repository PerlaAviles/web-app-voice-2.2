document.addEventListener('DOMContentLoaded', function () {
    const resultDiv = document.getElementById('result');
    let nuevaPestanaAbierta = false; // Bandera para controlar si ya se abrió una nueva pestaña
    let ultimoComando = ''; // Variable para almacenar el último comando ejecutado

    // Comprobar si el navegador admite la API de reconocimiento de voz
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        // Definir configuraciones del reconocimiento de voz
        // Configurar el idioma a español
        recognition.lang = 'es-ES';
        recognition.continuous = true; // Activar el reconocimiento continuo

        // Función para manejar los comandos de voz
        function manejarComandos(transcript) {
            console.log('Transcripción de voz:', transcript);

            // Ejecutar acciones según el comando de voz
            if (transcript.includes('abrir nueva pestaña') && !nuevaPestanaAbierta) {
                abrirNuevaPestana();
                nuevaPestanaAbierta = true; // Actualizar la bandera
            } else if (transcript.includes('ir a google')) {
                const url = obtenerUrl(transcript);
                if (url) {
                    window.location.href = 'https://www.google.com';
                    resultDiv.innerHTML = '<p>Ir a <strong>Google</strong>.</p>';
                } else {
                    resultDiv.innerHTML = '<p>Error: No se proporcionó una URL válida.</p>';
                }
            } else if (transcript.includes('cerrar pestaña')) {
                window.close();
                resultDiv.innerHTML = '<p>Pestaña cerrada.</p>';
            } else if (transcript.includes('cerrar navegador')) {
                window.open('', '_self', '');
                window.close();
                resultDiv.innerHTML = '<p>Navegador cerrado.</p>';
            } else {
                resultDiv.innerHTML = `<p>Comando no reconocido. Repitiendo último comando: <strong>${ultimoComando}</strong>.</p>`;
                ejecutarComando(ultimoComando); // Ejecutar el último comando
                recognition.start(); // Reiniciar el reconocimiento de voz para continuar escuchando
                return; // Detener la ejecución para evitar agregar el comando nuevamente
            }

            // Actualizar el último comando ejecutado
            ultimoComando = transcript;

            // Reiniciar el reconocimiento de voz para continuar escuchando
            recognition.start();
        }

        // Función para ejecutar un comando específico
        function ejecutarComando(comando) {
            if (comando.includes('abrir nueva pestaña') && !nuevaPestanaAbierta) {
                abrirNuevaPestana();
                nuevaPestanaAbierta = true; // Actualizar la bandera
            } else if (comando.includes('ir a google')) {
                const url = obtenerUrl(comando);
                if (url) {
                    window.location.href = 'https://www.google.com';
                    resultDiv.innerHTML = '<p>Ir a <strong>Google</strong>.</p>';
                } else {
                    resultDiv.innerHTML = '<p>Error: No se proporcionó una URL válida.</p>';
                }
            } else if (comando.includes('cerrar pestaña')) {
                window.close();
                resultDiv.innerHTML = '<p>Pestaña cerrada.</p>';
            } else if (comando.includes('cerrar navegador')) {
                window.open('', '_self', '');
                window.close();
                resultDiv.innerHTML = '<p>Navegador cerrado.</p>';
            } else {
                resultDiv.innerHTML = '<p>Comando no reconocido.</p>';
            }
        }

        // Función para abrir una nueva pestaña
        function abrirNuevaPestana() {
            window.open('https://www.google.com', '_blank');
            resultDiv.innerHTML = '<p>Nueva pestaña abierta.</p>';
        }

        // Escuchar cuando se haya detectado un resultado
        recognition.onresult = function (event) {
            const transcript = event.results[0][0].transcript.toLowerCase();
            // Llamar a la función para manejar los comandos
            manejarComandos(transcript);
        };

        // Escuchar errores
        recognition.onerror = function (event) {
            console.error('Error de reconocimiento de voz:', event.error);
            resultDiv.innerHTML = '<p>Error al procesar la orden de voz. Por favor, inténtalo de nuevo.</p>';
        };

        // Iniciar el reconocimiento de voz
        recognition.start();

    } else {
        // Si el navegador no admite la API de reconocimiento de voz, mostrar un mensaje de error
        resultDiv.innerHTML = '<p>Tu navegador no admite la API de reconocimiento de voz. Por favor, actualízalo a una versión más reciente.</p>';
    }
});

// Función para obtener la URL de un comando
function obtenerUrl(transcript) {
    const palabras = transcript.split(' ');
    const indexIrA = palabras.indexOf('ir') + 1;
    return palabras.slice(indexIrA).join(' ');
}
