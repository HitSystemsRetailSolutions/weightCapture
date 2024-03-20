const net = require('net');
const mqtt = require('mqtt');
const sql = require('mssql');
require('dotenv').config();

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
      encrypt: false, // Per a Azure
      trustServerCertificate: true // Només per a desenvolupament
    },
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 15000,
    },
    requestTimeout: 10000,
  };
  // Configuració del client MQTT
  const mqttOptions = {
    host: process.env.MQTT_HOST,
    port: process.env.MQTT_PORT,
    clientId: process.env.MQTT_CLIENT_ID,
    username: process.env.MQTT_USER,
    password: process.env.MQTT_PASSWORD,
  };

// Connexió al servidor MQTT
const client = mqtt.connect(mqttOptions);

client.on('connect', () => {
  console.log('Connectat al servidor MQTT', process.env.MQTT_HOST);

  // Subscripció al topic desitjat
  client.subscribe(process.env.MQTT_CLIENT_ID + '/#', (err) => {
    if (!err) {
      console.log('Subscrit al topic: ', process.env.MQTT_CLIENT_ID + '/#');
    }
  });
});
client.on('error', (err) => {
  console.error('Error en el client MQTT:', err);
});
  
// Crear un servidor TCP
const server = net.createServer((socket) => {
    console.log('Cliente conectado');
    client.publish(process.env.MQTT_CLIENT_ID + '/Estat' , 'Cliente conectado');

    // Mostrar la dirección y puerto del cliente conectado
    console.log(`Cliente conectado desde ${socket.remoteAddress}:${socket.remotePort}`);
    client.publish(process.env.MQTT_CLIENT_ID + '/Estat' , `Cliente conectado desde ${socket.remoteAddress}:${socket.remotePort}`);

    // Manejar el evento de recepción de datos
    socket.on('data', (data) => {
        client.publish(process.env.MQTT_CLIENT_ID + '/Estat' , 'Datos recibidos del cliente:' + data.toString());
        console.log('Datos recibidos del cliente:', data.toString());
        // Opcionalmente, enviar una respuesta al cliente
        socket.write('Mensaje recibido\n');
    });
    // Manejar el cierre de la conexión
    socket.on('close', () => {
        client.publish(process.env.MQTT_CLIENT_ID + '/Estat' ,'Cliente desconectado');
        console.log('Cliente desconectado');
    });
    // Manejar erroresº
    socket.on('error', (error) => {
        client.publish(process.env.MQTT_CLIENT_ID + '/Estat' ,'Error en la conexión:'  + error);
        console.error('Error en la conexión:', error);
    });
});

// El servidor escucha en el puerto 8080
server.listen(8081, () => {
    console.log('Servidor escuchando en el puerto 8081');
    client.publish(process.env.MQTT_CLIENT_ID + '/Estat' , 'Servidor escuchando en el puerto 8081');
});

// Manejar errores del servidor
server.on('error', (error) => {
    client.publish(process.env.MQTT_CLIENT_ID + '/Estat' , 'Error del servidor:' + error);
    console.error('Error del servidor:', error);
});
