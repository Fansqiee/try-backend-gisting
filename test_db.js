const Mqtt = require("mqtt");
const { Pool, Client } = require('pg');

// Konfigurasi database PostgreSQL
const dbConfig = {
  user: 'postgres',
  host: 'localhost',
  database: 'Local_DB',
  password: 'user',
  port: 5432 // Port default PostgreSQL
};

const pool = new Pool(dbConfig);

const mqtt = Mqtt.connect("mqtt://vps.isi-net.org", {
    port: 1883,
    username: "unila",
    password: "pwdMQTT@123",
    clientId: 'mqttjs_' + Math.random(),
    keepalive: 60,
    reconnectPeriod: 1000,
    clean: true,
});

mqtt.on("connect", () => {
    console.log(`MQTT Connected on host: mqtt://vps.isi-net.org`);

    const topic = "dummyICS";
    mqtt.subscribe(topic, () => {
        console.log("Subscribed to topic " + topic);
    });

    mqtt.on("message", (topic, message) => {
        const payload = message.toString();
        try {
            const data = JSON.parse(payload);

            const datetime = data.datetime;
            const humidity_280 = data.humidity_280;
            const pressure_280 = data.pressure_280;
            const temperature_280 = data.temperature_280;
            const temperature_388 = data.temperature_388;
            const pressure_388 = data.pressure_388;
            const phsensor = data.phsensor;
            const tdsSensor = data.tdsSensor;
            const moistureSensor = data.moistureSensor;
            const anemoMeter = data.anemoMeter;
            const windVane = data.windVane;
            const currentSensor = data.currentSensor;
            const rainIntensity = data.rainIntensity;
            const rainStatus = data.rainStatus;

            console.log(`datetime = ${datetime}`);
            console.log(`Humidity Sensor 280 = ${humidity_280}`);
            console.log(`Pressure Sensor 280 = ${pressure_280}`);
            console.log(`Temperature Sensor 280 = ${temperature_280}`);
            console.log(`Temperature Sensor 380 = ${temperature_388}`);
            console.log(`Pressure Sensor 388 = ${pressure_388}`);
            console.log(`PH Sensor = ${phsensor}`);
            console.log(`TDS Sensor = ${tdsSensor}`);
            console.log(`Soil Moisture Sensor = ${moistureSensor}`);
            console.log(`Anemometer Sensor = ${anemoMeter}`);
            console.log(`Wind Direction = ${windVane}`);
            console.log(`Current Sensor  = ${currentSensor}`);
            console.log(`Rain Intensity = ${rainIntensity}`);
            console.log(`Main Status = ${rainStatus}`);

            const dataArray = [datetime, humidity_280, pressure_280, temperature_280, temperature_388, pressure_388, phsensor, tdsSensor, moistureSensor, anemoMeter, windVane, currentSensor, rainIntensity, rainStatus];
            const insertQuery = `INSERT INTO sensor_data (datetime, humidity_280, pressure_280, temperature_280, temperature_388, pressure_388, phsensor, tdsSensor, moistureSensor, anemoMeter, windVane, currentSensor, rainIntensity, rainStatus) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`;

            pool.query(insertQuery, dataArray, (err, res) => {
                if (err) {
                    console.error('Error inserting data into the database:', err);
                } else {
                    console.log(`DATA INSERTED TO DATABASE: Time - ${datetime}, HMDTY 280 - ${humidity_280}, PRSS 280 - ${pressure_280}, TEMP 280 - ${temperature_280}, TEMP 388 - ${temperature_388}, PRSS 388 - ${pressure_388}, PH - ${phsensor}, TDS - ${tdsSensor}, MOIS - ${moistureSensor}, AMeter - ${anemoMeter}, WVane - ${windVane}, CRNT - ${currentSensor}, RIntensity - ${rainIntensity}, RStatus - ${rainStatus}`);
                }
            });
        } catch (e) {
            console.error('Error parsing JSON:', e);
        }
    });
});
