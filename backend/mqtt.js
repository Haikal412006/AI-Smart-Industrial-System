const mqtt = require('mqtt');
const sendAlert = require('./telegram');

const client = mqtt.connect('mqtt://broker.hivemq.com');

client.on('connect', () => {
  console.log('MQTT Connected');
  client.subscribe('smart/industry/sensor');
});

client.on('message', (topic, message) => {

  const data = JSON.parse(message.toString());

  console.log('MQTT DATA:', data);

  // 🔥 INI BAGIAN PENTING
  if (data.status === "DANGER") {
    sendAlert(
      `🚨 DANGER ALERT!
Object: gas/sensor
Status: ${data.status}
Temp: ${data.temperature}`
    );
  }

});