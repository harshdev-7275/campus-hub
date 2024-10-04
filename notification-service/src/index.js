import express from "express";
import { Kafka } from "kafkajs";
import redis from "redis";
import cors from "cors";
import { WebSocketServer } from "ws"; // Import WebSocket server

const app = express();
const port = 5002;

app.use(cors());

const redisClient = redis.createClient({
  url: "redis://localhost:6379",
});

const kafka = new Kafka({
  clientId: "notificationService",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "notification_group" });

// Create a WebSocket server
const wss = new WebSocketServer({ noServer: true });

// Array to store connected WebSocket clients, with their college ID
let clients = [];

const runConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "notifications_topic", fromBeginning: true });

 // Kafka consumer eachMessage function
await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const notification = JSON.parse(message.value.toString());
      console.log(`Received notification: ${notification.message}`);
  
      // Push the notification to Redis for persistence
      await redisClient.rPush("notifications", JSON.stringify(notification));
  
      // Send the notification only to clients from the same college
      clients.forEach(({ ws, college }) => {
        console.log("notification",ws.OPEN, college, notification);
        
        // Check if the college of the notification matches the college of the connected client
        if (ws.readyState === ws.OPEN && college === notification.college) {
          ws.send(JSON.stringify(notification)); // Send notification to the client
        }
      });
    },
  });
  
};

app.get("/notifications", async (req, res) => {
  try {
    const notifications = await redisClient.lRange("notifications", 0, -1);
    const parsedNotifications = notifications.map((notification) =>
      JSON.parse(notification)
    );

    return res.status(200).json({ success: true, notifications: parsedNotifications });
  } catch (error) {
    console.error("Error retrieving notifications from Redis", error);
    return res.status(500).json({ success: false, message: "Internal server error!" });
  }
});

redisClient.connect().catch(console.error);
runConsumer().catch(console.error);

// Handle WebSocket connections
const server = app.listen(port, () => {
  console.log(`Notification service running on port ${port}`);
});

server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    // Listen for a message from the client to register its college ID
    ws.on("message", (data) => {
        console.log("on message",JSON.parse(data), ws)
      const { college } = JSON.parse(data);

      // Add the client to the list with its college ID
      clients.push({ ws, college });

      // Handle when the client disconnects
      ws.on("close", () => {
        clients = clients.filter((client) => client.ws !== ws);
      });
    });
  });
});
