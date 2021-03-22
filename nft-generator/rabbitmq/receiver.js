const amqp = require('amqplib/callback_api');
const camelcase = require("camelcase");

const eventHandlers = require("./eventHandlers")


amqp.connect('amqp://rabbitmq', function (error0, connection) {
  if (error0) throw error0
  connection.createChannel(function (error1, channel) {
    if (error1) throw error1

    const queue = 'hello';
    channel.assertQueue(queue, {durable: false});

    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

    channel.consume(queue, function (msg) {
      const messageContent = JSON.parse(msg.content)
      const eventName = messageContent.event
      const handler = eventHandlers[camelcase(eventName)]
      if (handler) handler()
      else console.log("Couldn't find a handler for this event")
    }, {noAck: true});
  });
});


