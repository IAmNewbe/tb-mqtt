const mqtt = require('mqtt');
require('dotenv').config();

// Replace these with your MQTT broker details
const brokerUrl = process.env.broker_URL;
// Device Access Token
const deviceToken = process.env.mqtt_username;

// Create an MQTT client instance
const client = mqtt.connect(brokerUrl, {
  username: deviceToken,
  password: ''
});

const topic = process.env.topic_subscribe;

// Handle connection events
client.on('connect', () => {
  console.log('Connected to MQTT broker');

  // Subscribe to a topic
  client.subscribe(topic, (err) => {
    if (!err) {
      console.log(`Subscribed to ${topic}`);
    } else {
      console.error(`Error subscribing to ${topic}: ${err}`);
    }
  });

});

client.on('message', (topic, message) => {
  console.log(`Received message on topic ${topic}: ${message.toString()}`);
  // Disconnect after receiving a message
  // client.end();
});

// Handle disconnection events
client.on('close', () => {
  console.log('Disconnected from MQTT broker');
});

// Handle errors
client.on('error', (err) => {
  console.error(`MQTT error: ${err}`);
});
