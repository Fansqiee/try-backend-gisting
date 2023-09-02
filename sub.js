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

    mqtt.on("message", (topic, message)=> {
        console.log(message.toString());

    });
})

