const net = require('net');

// Crear un cliente TCP
const client = new net.Socket();

// Conectar al servidor
client.connect(8081, '192.168.1.47', () => {
    console.log('Conectado al servidor');
    // Aquí podrías listar los eventos que piensas manejar
    console.log('Eventos del canal TCP manejados: data, close, error');
});

// Manejar el evento de conexión establecida
client.on('connect', () => {
    console.log('El socket TCP está abierto y listo para comunicarse');
    client.write('ST');

/*    for (let i = 0; i <= 200; i++) {
        // Convertir el código ASCII a caracter
        const char = String.fromCharCode(i);
        // Enviar el caracter al cliente
        client.write(char);
    }
    // Opcional: enviar una nueva línea al final para separar los mensajes
    client.write('\n');*/
    console.log('Enviado!');
});

// Manejar el evento de recepción de datos
client.on('data', (data) => {
    console.log('Datos recibidos del servidor:', data.toString());
});

// Establecer un temporizador para cerrar la conexión después de 2 minutos
setTimeout(() => {
    client.end(); // Cierra la conexión
    console.log('Conexión cerrada después de 2 minutos');
}, 120000); // 120000 milisegundos = 2 minutos

// Manejar el cierre de la conexión
client.on('close', () => {
    console.log('Conexión cerrada');
});

// Manejar errores de conexión
client.on('error', (error) => {
    console.error('Error de conexión:', error);
});
