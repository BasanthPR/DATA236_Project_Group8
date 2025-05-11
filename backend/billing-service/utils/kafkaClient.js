import { Kafka, Partitioners } from 'kafkajs';
import dotenv from 'dotenv';
dotenv.config();

const brokers = (process.env.KAFKA_BROKERS || 'localhost:29092').split(',');
const kafka = new Kafka({
  clientId:    process.env.KAFKA_CLIENT_ID  || 'billing-service',
  brokers,
});

export const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner
});

let isConnected = false;

export async function connectKafka() {
  try {
    if (!isConnected) {
      await producer.connect();
      isConnected = true;
      console.log('✅ Billing-service connected to Kafka brokers:', brokers);
    }
  } catch (err) {
    console.error('❌ Failed to connect to Kafka:', err);
    throw err;
  }
}

export async function publish(topic, message) {
  try {
    if (!isConnected) {
      await connectKafka();
    }

    console.log(`🔔 [Kafka] publish() called → topic="${topic}", message=`, message);
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
    console.log(`✅ [Kafka] Successfully published to "${topic}"`);
  } catch (err) {
    console.error(`❌ [Kafka] Failed to publish to "${topic}":`, err);
    throw err;
  }
}

export async function disconnectKafka() {
  try {
    if (isConnected) {
      await producer.disconnect();
      isConnected = false;
      console.log('✅ Billing-service disconnected from Kafka');
    }
  } catch (err) {
    console.error('❌ Failed to disconnect from Kafka:', err);
    throw err;
  }
}