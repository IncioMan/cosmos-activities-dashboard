import boto3
import json
import telebot
import os

def lambda_handler(event, context):
    # Process the event data
    print(json.dumps(event, indent=2))

    assert 'Records' in event

    # Replace 'YOUR_BOT_TOKEN' with your actual bot token
    TOKEN = os.getenv('BOT_TOKEN','')
    chat_id = os.getenv('CHAT_ID','')
    
    # Initialize the bot
    tb = telebot.TeleBot(TOKEN)

    for outer_record in event['Records']:
        message = json.loads(outer_record['body'])

        assert message['Type'] == 'Notification'
        assert message['Subject'] == 'Amazon S3 Notification'

        data = json.loads(message['Message'])
    
        message = ''
        for record in data['Records']:
            message = f"{record['eventName']}, {record['s3']['bucket']['name']}, {record['s3']['object']['key']}"
            tb.send_message(chat_id, message)

    
    return {
        'statusCode': 200,
        'body': message
    }

if __name__ == "__main__":
    with open('messages/message1.json', 'r') as file:
        event_data = json.load(file)

    # Invoke the Lambda function
    result = lambda_handler(event_data, None)