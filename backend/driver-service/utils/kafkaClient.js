// driver-service/utils/kafkaClient.js
import { Kafka, logLevel, Partitioners } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'driver-service',
  brokers: [ process.env.KAFKA_BROKER || 'localhost:29092' ],
  logLevel: logLevel.INFO
});

const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner
});

let isConnected = false;

// Call this once at startup
export const connectProducer = async () => {
  try {
    if (!isConnected) {
      await producer.connect();
      isConnected = true;
      console.log('✅ Kafka producer connected');
    }
  } catch (err) {
    console.error('❌ Kafka producer connection error:', err);
    throw err;
  }
};

// Use this to emit an event
export const publish = async (topic, payload) => {
  try {
    if (!isConnected) {
      await connectProducer();
    }

    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(payload) }]
    });
    console.log(`📨 Event published to ${topic}`);
  } catch (err) {
    console.error('❌ Kafka publish error:', err);
    throw err;
  }
};

// Graceful shutdown
export const disconnectProducer = async () => {
  try {
    if (isConnected) {
      await producer.disconnect();
      isConnected = false;
      console.log('✅ Kafka producer disconnected');
    }
  } catch (err) {
    console.error('❌ Kafka producer disconnection error:', err);
    throw err;
  }
};
