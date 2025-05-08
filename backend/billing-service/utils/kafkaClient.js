import { Kafka } from 'kafkajs';
import dotenv from 'dotenv';
dotenv.config();

const brokers = (process.env.KAFKA_BROKERS || 'localhost:29092').split(',');
const kafka = new Kafka({
  clientId:    process.env.KAFKA_CLIENT_ID  || 'billing-service',
  brokers,
});

export const producer = kafka.producer();

export async function connectKafka() {
  await producer.connect();
  console.log('✅ Billing-service connected to Kafka brokers:', brokers);
}

export async function publish(topic, message) {
    console.log(`🔔 [Kafka] publish() called → topic="${topic}", message=`, message);
    try {
      const result = await producer.send({
        topic,
        messages: [{ value: JSON.stringify(message) }],
      });
    } catch (err) {
      console.error(`❌ [Kafka] Failed to publish to "${topic}":`, err);
      throw err;
    }
  }