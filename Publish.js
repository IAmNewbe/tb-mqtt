const mqtt = require('mqtt');
require('dotenv').config();

// MQTT Broker URL
const brokerUrl = process.env.broker_URL;
const topic_publish = process.env.topic_publish;

// Device Access Token
const deviceToken = process.env.mqtt_username;

let pengali = 1;
// Connect to MQTT Broker
const client = mqtt.connect(brokerUrl, {
  username: deviceToken,
  password: '' // Leave empty for ThingsBoard
});

client.on('connect', function () {
  console.log('connected')
  client.subscribe(topic_publish)
  
  function publishMessage() {
    const min = 26;
    const max = 27;
    let temp = Math.random() * (max - min) + min;
    let DO = Math.random() * (9000 - 8000) + 8000;
    let Sal = Math.random() * (900 - 700) + 700;
    let ph = Math.random() * (8 - 7) + 7;
    let data = {
      "temperature": temp,
      "DO": DO,
      "sal": Sal,
      "pH": ph
    }
    const jsonData = JSON.stringify(data);
    // Publish the message to the specified topic
    client.publish(topic_publish, jsonData);
    console.log(`sent message: ${jsonData},`)
  }
  // Publish a message every 1 seconds
  const intervalId = setInterval(publishMessage, 1000);
  pengali = pengali+1;
  // Optionally, stop the interval after a certain period (e.g., 10 seconds)
  setTimeout(() => {
    clearInterval(intervalId);
    client.end(); // Close the MQTT connection
  }, 10000000);
})

client.on('message', function (topic, message) {
  console.log('response.topic: ' + topic)
  console.log('response.body: ' + message.toString())
  client.end()
})