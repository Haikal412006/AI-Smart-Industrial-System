const mqtt = require('mqtt');

const client = mqtt.connect('mqtt://broker.hivemq.com');

setInterval(() => {

  const data = {
    temperature: Math.floor(Math.random() * 100),
    humidity: Math.floor(Math.random() * 100),
    gas: Math.floor(Math.random() * 100),
    status: Math.random() > 0.8 ? 'DANGER' : 'NORMAL'
  };

  client.publish(
    'smart/industry/sensor',
    JSON.stringify(data)
  );

  console.log('Sent:', data);

}, 3000);