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
    try:
        # Load the CSV file from S3
        obj = s3.get_object(Bucket=bucket_name, Key=file_path_in_bucket)
        df = pd.read_csv(obj['Body'])
        print("Loaded logs", df)
    except Exception as e:
        print("Error loading logs: ", e)
        return pd.DataFrame([['', '']], columns=['address','last_tx_date'])
    return df

def update_log(log, address, last_tx_date):
    print(f"Updating logs for address {address} with date {last_tx_date}")
    if log.loc[log['address'] == address].empty:
        # If the condition is not satisfied, append a new row to the DataFrame
        new_row = pd.DataFrame([[address,last_tx_date]], columns=['address','last_tx_date'])
        log = pd.concat([log, new_row])
    else:
        log.loc[log.address == address, 'last_tx_date'] = last_tx_date
    print(log)
    csv_buffer = log.to_csv(index=False)
    s3 = boto3.client('s3')
    s3.put_object(Bucket=bucket_name, Key=file_path_in_bucket, Body=csv_buffer)
    return load_log()

def get_txs_after_date(address, last_date, api_endpoint):
    url = api_endpoint.format(address, 25, 0)

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
    }

    response = requests.get(url, headers=headers)
    tt = pd.json_normalize(response.json(), record_path=['data', 'tx','body','messages'], meta=['data'])
    tt['txhash'] = tt.data.apply(lambda x: x['txhash'])
    tt['timestamp'] = pd.to_datetime(tt.data.apply(lambda x: x['timestamp']))
    tt = tt.drop(columns=['data'])
    tt['timestamp_str'] = tt.timestamp.dt.strftime("%Y-%m-%d %H:%M:%S")
    txs_to_notify = tt[tt['timestamp_str'] > last_date]
    return txs_to_notify

def shortAddress(address):
    return address[:7] + "..." + address[-6:]

def get_messages(txs, address, address_desc, finder_address, finder_tx):
    messages = []
    txs_ = txs.sort_values(by='timestamp', ascending=False).head(1)
    for i, row in txs_.iterrows():
        messages.append(f"""
*{address_desc}*

Message type: {row['@type']}
Trader: [{shortAddress(address)}]({finder_address}{address})
Tx: [{shortAddress(row.txhash)}]({finder_tx}{row.txhash})
    """.replace(".","\."))
    return messages

def send_messages(tb, chat_id, messages):
    for message in messages:
        tb.send_message(chat_id, message, parse_mode='MarkdownV2')

def lambda_handler(event, context):
    # Process the event data
    print(json.dumps(event, indent=2))

    assert 'address' in event
    assert 'address_desc' in event
    assert 'start_date' in event
    assert 'finder_address' in event
    assert 'finder_tx' in event

    address = event['address']
    address_desc = event['address_desc']
    start_date = event['start_date']
    finder_address = event['finder_address']
    finder_tx = event['finder_tx']
    api_endpoint = 'https://api.mintscan.io/v1/cosmos/account/{}/txs?limit={}&from={}'
    

    log = load_log()
    try:
        last_date = min(start_date, log[log.address==address].last_tx_date[0])
    except Exception as e:
        print("Using start_date because error ", e)
        last_date = start_date
    print(f"Checking movements for address {address} from date {last_date}")
    txs = get_txs_after_date(address, last_date, api_endpoint)

    if((not txs is None) and len(txs)>0):
        messages = get_messages(txs, address, address_desc, finder_address, finder_tx)
    
        print(messages)
        TOKEN = os.getenv('BOT_TOKEN','')
        chat_id = os.getenv('CHAT_ID','')
        tb = telebot.TeleBot(TOKEN)
        send_messages(tb, chat_id, messages)

        last_tx_date = txs.timestamp.max().to_pydatetime().replace(tzinfo=None)
        update_log(log, address, last_tx_date) 
    else:
        print("No txs to notify")
        update_log(log, address, last_date) 
        return {
        'statusCode': 200
    }

    return {
        'statusCode': 200
    }


if __name__ == "__main__":
    with open('messages/addr_movements_notifier/cosmos1.json', 'r') as file:
        event_data = json.load(file)

    # Invoke the Lambda function
    result = lambda_handler(event_data, None)