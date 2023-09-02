const Mqtt = require("mqtt");

const mqtt = Mqtt.connect("https://vps.isi-net.org", {
    port : 1883,
    username: "unila",
    password: "pwdMQTT@123",
    clientId: 'mqttjs_' + Math.random(),
    keepalive: 60,
    reconnectPeriod: 1000,
    clean: true,
});

mqtt.on("connect", () => {
    console.log(`MQTT Connected on host : "https://vps.isi-net.org"`); 
``
    topic = "dummyICS";
    mqtt.subscribe(topic, () => {
        console.log("subscribed to topic"+topic);
    })

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
            
        } catch (e) {
            console.error('Error parsing JSON:', e);
            
        }

        const dataArray = [datetime,humidity_280,pressure_280,temperature_280,temperature_388,pressure_388,phsensor,tdsSensor,moistureSensor,anemoMeter,windVane,currentSensor,rainIntensity,rainStatus];
        const insertQuery = `INSERT INTO parse(datetime, humidity_280, pressure_280, temperature_280, temperature_388, pressure_388, phsensor, tdsSensor, moistureSensor, anemoMeter, windVane, currentSensor, rainIntensity, rainStatus) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`;
        

    });
})

