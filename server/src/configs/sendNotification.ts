import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "main-app",
  brokers: ["localhost:9092"],
});

const producer = kafka.producer();

interface PostCreatedEvent {
  userId: string;
  postId: string;
  content: string;
}

export const sendPostCreatedEvent = async (event: PostCreatedEvent) => {
  await producer.connect();
  await producer.send({
    topic: "postCreated",
    messages: [{ value: JSON.stringify(event) }],
  });
  await producer.disconnect();
};
