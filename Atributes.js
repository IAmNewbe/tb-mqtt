const mqtt = require('mqtt');
require('dotenv').config();

// MQTT Broker URL
const brokerUrl = process.env.broker_URL;
//send message to Client Atribute
const topicAtributes = process.env.topic_atributes
// Device Access Token
const deviceToken = process.env.mqtt_username;
// Connect to MQTT Broker
const client = mqtt.connect(brokerUrl, {
  username: deviceToken,
  password: '' // Leave empty for ThingsBoard
});

client.on('connect', function () {
  console.log('connected');
  // client.subscribe(process.env.topic_subscribe);
  function publishMessage() {
    const min = 22;
    const max = 30;
    let temp = Math.random() * (max - min) + min;
    let data = {
      "temp" : `${temp}`,
    }
    const jsonData = JSON.stringify(data);
    // Publish the message to the specified topic
    client.publish(topicAtributes, jsonData);
    console.log(`sent message: ${jsonData},`)
  }
  // Publish a message every 1 seconds
  const intervalId = setInterval(publishMessage, 2000);
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