import pika
import json


def send_new_project():
    connection = pika.BlockingConnection(pika.ConnectionParameters('rabbitmq'))
    channel = connection.channel()
    channel.queue_declare(queue='hello')
    channel.basic_publish(exchange='',
                          routing_key='hello',
                          body=json.dumps({'event': 'new-project'}).encode())
    connection.close()
