const mqtt = require('mqtt');
const { Client } = require('pg');

// MQTT settings
const MQTT_BROKER = 'https://vps.isi-net.org';
const MQTT_TOPIC = 'dummyICS';

// Database settings
const DB_CONFIG = {
  user: 'postgres',
  host: 'localhost',
  database: 'Local_DB',
  password: 'user',
  port: 5432, // default PostgreSQL port
};

// Create MQTT client
const mqttClient = mqtt.connect(MQTT_BROKER);

// Setup PostgreSQL client
const pgClient = new Client(DB_CONFIG);
pgClient.connect();

// MQTT message handling
mqttClient.on('connect', () => {
  console.log('Connected to MQTT broker');
  mqttClient.subscribe(MQTT_TOPIC);
});

mqttClient.on('message', (topic, message) => {
  try {
    const sensorData = JSON.parse(message.toString());
    const { datetime, humidity_280, pressure_280, temperature_280, temperature_388, pressure_388, phsensor, tdsSensor, moistureSensor, anemoMeter, windVane, currentSensor, rainIntensity, rainStatus } = sensorData;

    const insertQuery = `INSERT INTO sensor_data (datetime, humidity_280, pressure_280, temperature_280, temperature_388, pressure_388, phsensor, tdsSensor, moistureSensor, anemoMeter, windVane, currentSensor, rainIntensity, rainStatus) 
                         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`;

    const values = [datetime, humidity_280, pressure_280, temperature_280, temperature_388, pressure_388, phsensor, tdsSensor, moistureSensor, anemoMeter, windVane, currentSensor, rainIntensity, rainStatus];

    pgClient.query(insertQuery, values, (error, results) => {
      if (error) {
        console.error('Error inserting data:', error);
      } else {
        console.log('Data inserted successfully');
      }
    });
  } catch (error) {
    console.error('Error processing MQTT message:', error);
  }
});

mqttClient.on('error', (error) => {
  console.error('MQTT error:', error);
});

// Graceful shutdown
process.on('SIGINT', () => {
  mqttClient.end();
  pgClient.end();
  process.exit();
});
