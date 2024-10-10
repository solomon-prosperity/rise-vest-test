// import MerchantModel from "./src/infra/database/models/mongoose/merchantModel";
// import amqp from "amqp-connection-manager";
// import { Channel, Message } from "amqplib";
// import dotenv from "dotenv";
// dotenv.config()

// import container from "./src/container";
// const {
//     logger: logging,
//   } = container.cradle;

//   const logger = {
//     info: console.info,
//     error: console.error,
//   };

// // Create a connection manager
// const amqp_url = process.env.AMQP_URL || "";
// //logger.info("Connecting to RabbitMq...");
// const connection = amqp.connect(amqp_url);

// connection.on("connect", () => logger.info("RabbitMq is connected!"));
// connection.on("disconnect", () => logger.info("RabbitMq disconnected. Retrying..."));

// // Create a channel wrapper
// const channelWrapper = connection.createChannel({
//     json: true,
//   setup(channel: Channel) {
//         //Assert Queues
//         channel.assertQueue(`order_completed`, { durable: false })

//         //consume messages

//         channel.consume(`order_completed`, async (messageBuffer: Message | null) => {
//                 const msg = messageBuffer;
//                 const message = JSON.parse(msg!.content.toString());

//                 message.order.products.map(async (item: any)=> {
//                     const merchantId = item.merchantId
//                     let merchant = await MerchantModel.findOne({_id: merchantId})
//                     let funds = Number(merchant!.accountBalance) + Number(item.price)
//                     merchant!.accountBalance = funds
//                     merchant!.save()
//                     console.log(`Merchant Account Balance updated \n ${merchant}`)

//                 })

//         }, {noAck: true})

//     }
// })

// channelWrapper.on("close", () => {
//     logger.info("RabbitMq channel has closed");
// });

// export default channelWrapper
