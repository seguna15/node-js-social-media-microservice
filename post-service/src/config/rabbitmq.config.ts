import amqp from "amqplib";
import { logger } from "@/utils";


let connection = null;
let channel: amqp.Channel | null | undefined = null;

const EXCHANGE_NAME = "social_media_events";

export async function connectToRabbitMQ() {
    try {
        connection = await amqp.connect(process.env.RABBITMQ_URL!);
        channel = await connection.createChannel();
        await channel.assertExchange(EXCHANGE_NAME, "topic", { durable: false });
        logger.info("Connected to RabbitMQ");
        return channel;
    } catch (error) {
        logger.error(`Error connecting to RabbitMQ: ${error}`);
    }    
}


export async function publishEvent(routingKey: string, message: any){
    if (!channel) {
        const newChannel = await connectToRabbitMQ();
        if (!newChannel) {
            throw new Error("Failed to connect to RabbitMQ");
        }
        channel = newChannel;
    }
    channel!.publish(EXCHANGE_NAME, routingKey, Buffer.from(JSON.stringify(message)));
    logger.info(`Event published successfully to ${routingKey}`)
}