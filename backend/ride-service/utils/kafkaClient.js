import dotenv from 'dotenv';
dotenv.config(); // ✅ Load environment variables early

import { Kafka } from 'kafkajs';

class KafkaClient {
  constructor() {
    console.log('🌐 Kafka broker from .env:', process.env.KAFKA_BROKERS);
    
    const brokers = (process.env.KAFKA_BROKERS || 'localhost:9092').split(',');
    console.log('Initializing Kafka with brokers:', brokers);

    this.kafka = new Kafka({
      clientId: process.env.KAFKA_CLIENT_ID || 'uber-simulation',
      brokers
    });

    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({
      groupId: process.env.KAFKA_GROUP_ID || 'uber-simulation-group'
    });
  }

  async connect() {
    try {
      await this.producer.connect();
      await this.consumer.connect();
      console.log('✅ Connected to Kafka');
    } catch (error) {
      console.error('❌ Failed to connect to Kafka:', error);
      throw error;
    }
  }

  async disconnect() {
    try {
      await this.producer.disconnect();
      await this.consumer.disconnect();
      console.log('✅ Disconnected from Kafka');
    } catch (error) {
      console.error('❌ Failed to disconnect from Kafka:', error);
      throw error;
    }
  }

  async publish(topic, message) {
    try {
      await this.producer.send({
        topic,
        messages: [{ value: JSON.stringify(message) }]
      });
      console.log(`📤 Message published to topic: ${topic}`);
    } catch (error) {
      console.error(`❌ Failed to publish message to ${topic}:`, error);
      throw error;
    }
  }

  async subscribe(topic, callback) {
    try {
      await this.consumer.subscribe({ topic });
      console.log(`🔁 Subscribed to topic: ${topic}`);

      await this.consumer.run({
        eachMessage: async ({ message }) => {
          try {
            const value = JSON.parse(message.value.toString());
            await callback(value);
          } catch (error) {
            console.error(`❌ Failed to process message from ${topic}:`, error);
          }
        }
      });
    } catch (error) {
      console.error(`❌ Error subscribing to topic ${topic}:`, error);
      throw error;
    }
  }
}

const kafkaClient = new KafkaClient();
export default kafkaClient;
