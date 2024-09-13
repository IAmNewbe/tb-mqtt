const mqtt = require('mqtt');
require('dotenv').config();

// Replace with your ThingsBoard broker URL
const brokerUrl = process.env.broker_URL;
const topic_publish = process.env.topic_publish;

// Device Access Token
const deviceToken = process.env.mqtt_username; // Replace with your device access token

// Connect to ThingsBoard MQTT broker
const client = mqtt.connect(brokerUrl, {
  username: deviceToken
});

client.on('connect', () => {
  console.log('Connected to ThingsBoard MQTT broker');

  // Subscribe to RPC (Remote Procedure Call) requests
  client.subscribe('v1/devices/me/rpc/request/+', (err) => {
    if (!err) {
      console.log('Subscribed to RPC requests');
    }
  });

});

client.on('message', (topic, message) => {
  console.log(`Received message from topic ${topic}: ${message.toString()}`);
  
  // If it's an RPC request, handle it
  if (topic.startsWith('v1/devices/me/rpc/request/')) {
    const requestId = topic.split('/').pop();
    const rpcRequest = JSON.parse(message.toString());
    
    console.log('Received RPC request:', rpcRequest);
    
    // Example: Respond to RPC with the requestId
    const responseTopic = `v1/devices/me/rpc/response/${requestId}`;
    const response = {
      status: "success",
      data: "RPC handled"
    };
    client.publish(responseTopic, JSON.stringify(response));
  }
});

// Error handling
client.on('error', (err) => {
  console.error('Connection error:', err);
});
