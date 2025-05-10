// driver-service/utils/kafkaClient.js
import { Kafka, logLevel } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'driver-service',
  brokers: [ process.env.KAFKA_BROKER || 'localhost:29092' ],
  logLevel: logLevel.INFO
});

const producer = kafka.producer();

// Call this once at startup
export const connectProducer = async () => {
  await producer.connect();
  console.log('✅ Kafka producer connected');
};

// Use this to emit an event
export const publish = async (topic, payload) => {
  try {
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(payload) }]
    });
    console.log(`📨 Event published to ${topic}`);
  } catch (err) {
    console.error('❌ Kafka publish error:', err);
  }
};
