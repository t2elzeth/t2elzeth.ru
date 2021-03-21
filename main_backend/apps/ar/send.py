import pika
import json

connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
channel = connection.channel()
channel.queue_declare(queue='hello')


def send_new_project():
    channel.basic_publish(exchange='',
                          routing_key='hello',
                          body=json.dumps({'event': 'new-project'}).encode())
