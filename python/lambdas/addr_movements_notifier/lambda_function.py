import json
import telebot
import os
import time
import pandas as pd
import urllib
import requests
from datetime import datetime, timedelta
import boto3

s3 = boto3.client('s3')

bucket_name='incioman-data-analysis'
file_path_in_bucket = 'data/addr_movements_notifier/notifier_logging.csv'

def load_log():
    # Load the CSV file from S3
    obj = s3.get_object(Bucket=bucket_name, Key=file_path_in_bucket)
    df = pd.read_csv(obj['Body'])
    return df

def update_log(log, notifier_id, last_tx_date):
    log.loc[log.notifier_id == notifier_id, 'last_tx_date'] = last_tx_date
    csv_buffer = log.to_csv(index=False)
    s3 = boto3.client('s3')
    s3.put_object(Bucket=bucket_name, Key=file_path_in_bucket, Body=csv_buffer)
    return load_log()

def get_txs_after_date(address, start_date, api_endpoint):
    #todo
    pass


    current_date = datetime.now()
    _log = pd.DataFrame([(notifier_id, (current_date - timedelta(hours=1)).strftime('%Y-%m-%d %H:%M:%S.%f'))], columns=['notifier_id','last_parsing_date'])
    if log is None:
        log = _log
    if not notifier_id in log['notifier_id'].tolist():
        log = pd.concat([log,_log])

    last_parsing_date = log[log.notifier_id == notifier_id].last_parsing_date.tolist()[0]
    last_parsing_date = datetime.strptime(last_parsing_date, '%Y-%m-%d %H:%M:%S.%f')
    return current_date, last_parsing_date, log

def shortAddress(address):
    return address[:7] + "..." + address[-6:]

def get_messages(txs):
    #pass
    pass

def send_messages(tb, chat_id, messages):
    for message in messages:
        tb.send_message(chat_id, message, parse_mode='MarkdownV2')

def lambda_handler(event, context):
    # Process the event data
    print(json.dumps(event, indent=2))

    assert 'address' in event
    assert 'address_desc' in event
    assert 'start_date' in event

    address = event['address']
    address_desc = event['address_desc']
    start_date = event['start_date']
    limit = 5
    from_ = 0
    api_endpoint = 'https://api.mintscan.io/v1/cosmos/account/{}/txs?limit={}&from={}'
    

    log = load_log()
    print(f"Checking movements for address {address} from date {start_date}")
    txs = get_txs_after_date(address, start_date, api_endpoint)

    messages = get_messages(txs)

    print(messages)
    TOKEN = os.getenv('BOT_TOKEN','')
    chat_id = os.getenv('CHAT_ID','')
    tb = telebot.TeleBot(TOKEN)
    send_messages(tb, chat_id, messages)

    last_tx_date = txs.timestamp.max().to_pydatetime().replace(tzinfo=None)
    update_log(log, address, last_tx_date) 

    return {
        'statusCode': 200
    }


if __name__ == "__main__":
    with open('messages/addr_movements_notifier/cosmos1.json', 'r') as file:
        event_data = json.load(file)

    # Invoke the Lambda function
    result = lambda_handler(event_data, None)