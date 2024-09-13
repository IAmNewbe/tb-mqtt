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

const topic_res = process.env.topic_res;
const topic_req = process.env.topic_req;

// Request data of "temperature" in client Atributes
const data_req = '{"clientKeys":"temp"}';

// Handle connection events
client.on('connect', () => {

  console.log('Connected to MQTT broker');
  client.subscribe(topic_res);
  client.publish(topic_req, data_req );

});

client.on('message', (topic, message) => {
  console.log(`Received message on topic ${topic}: ${message}`);
  let data = JSON.parse(message);
  data = data.client;
  console.log(data);
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
