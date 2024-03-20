# WeightCapture System

## Descripció

El sistema WeightCapture és una solució integrada dissenyada per capturar i emmagatzemar dades de pesatge des de diverses balances a una base de dades centralitzada. Aquesta aplicació facilita la gestió de dades en temps real, proporcionant una interfície entre dispositius de pesatge, una base de dades SQL per a l'emmagatzematge de dades, i una connexió MQTT per a la comunicació remota i el seguiment d'estat.

<p align="Left">
  <img src="Logo.webp" alt="logo" width="300" height="300">
</p>

## Característiques

- **Connexió a Balances**: Recull dades de pesatge de manera eficient i les emmagatzema a la base de dades.
- **Integració amb MQTT**: Utilitza MQTT per a la comunicació entre el sistema central i els dispositius permesos, així com per a la publicació d'estats i alertes.
- **Gestió de la Base de Dades**: Configuració segura per a la connexió a bases de dades SQL, amb opcions per a Azure i entorns de desenvolupament.
- **Interfície TCP**: Crea un servidor TCP per a la recepció de dades i la interacció amb clients.

## Configuració Inicial

### Requeriments

- Node.js
- MQTT Broker (per exemple, Mosquitto)
- SQL Server (o compatible amb Azure SQL)

### Instal·lació

1. Clona el repositori a la teva màquina local.
2. Instal·la les dependències necessàries executant `npm install` al directori del projecte.
3. Configura les variables d'entorn necessàries en un fitxer `.env` basant-te en `.env.example`.

### Variables d'Entorn

- `DB_USER`: Usuari de la base de dades.
- `DB_PASSWORD`: Contrasenya de la base de dades.
- `DB_SERVER`: Servidor de la base de dades.
- `DB_DATABASE`: Nom de la base de dades.
- `MQTT_HOST`: Host del servidor MQTT.
- `MQTT_PORT`: Port del servidor MQTT.
- `MQTT_CLIENT_ID`: Identificador del client MQTT.
- `MQTT_USER`: Usuari per a la connexió MQTT.
- `MQTT_PASSWORD`: Contrasenya per a la connexió MQTT.

## Ús

Per iniciar el sistema, executa:

```bash
node server.js
