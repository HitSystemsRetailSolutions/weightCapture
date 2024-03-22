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
    clientId: (process.env.NODE_ENV) ? `${process.env.MQTT_CLIENT_ID}-${process.env.NODE_ENV}` : process.env.MQTT_CLIENT_ID,
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

async function rebutData(data,ip) {
  client.publish(process.env.MQTT_CLIENT_ID + '/Estat' , 'Datos recibidos del cliente:' + data.toString());
  console.log('Datos recibidos del cliente:', data.toString());

  let pes = data.toString().split(',')[2];
  console.log(pes)
  if (/^\d+$/.test(pes)){
    client.publish(process.env.MQTT_CLIENT_ID + '/Estat' , `format incorrecte `);
  }else{
    sql.connect(dbConfig).then(() => {
      let sqlSt = `INSERT INTO hit.dbo.Temperatures (id,tmSt,ip,Val) VALUES (newid(),getdate(),'${ip}','${pes}')
                  delete fac_demo.dbo.impresoracola where impresora = 'Obrador_02_cascos3' 
                  insert into fac_demo.dbo.impresoracola  (id,impresora,texte) values (newid(),'Obrador_02_cascos3','Rebut pes \n ************************************\n \n PES: ${pes}\n \n\n \nData: ' + FORMAT(GETDATE(), 'yyyy-MM-dd HH:mm:ss') + '\n \n ************************************\n') `;
      sql.query(sqlSt).then(() => {
        client.publish(process.env.MQTT_CLIENT_ID + '/Estat' , `Datos ${pes} insertados en la base de datos `);
      }).catch((err) => {
        client.publish(process.env.MQTT_CLIENT_ID + '/Estat' , 'Error en la inserción de datos:' + err);
      });
    });
  }  
}

// Crear un servidor TCP
const server = net.createServer((socket) => {
    console.log('Cliente conectado');
    client.publish(process.env.MQTT_CLIENT_ID + '/Estat' , 'Cliente conectado');

    // Mostrar la dirección y puerto del cliente conectado
    console.log(`Cliente conectado desde ${socket.remoteAddress}:${socket.remotePort}`);
    client.publish(process.env.MQTT_CLIENT_ID + '/Estat' , `Cliente conectado desde ${socket.remoteAddress}:${socket.remotePort}`);

    // Manejar el evento de recepción de datos
    socket.on('data', (data) => {
      const clientIp = socket.remoteAddress;
      rebutData(data,clientIp); 
//      socket.write('Mensaje recibido\n');
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
//    rebutData('1,ST,     0.925,','192.168.3.3')
});

// Manejar errores del servidor
server.on('error', (error) => {
    client.publish(process.env.MQTT_CLIENT_ID + '/Estat' , 'Error del servidor:' + error);
    console.error('Error del servidor:', error);
});
