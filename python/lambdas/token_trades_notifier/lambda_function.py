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
file_path_in_bucket = 'data/token_trades_notifier/notifier_logging.csv'

def load_log():
    try:
        # Load the CSV file from S3
        obj = s3.get_object(Bucket=bucket_name, Key=file_path_in_bucket)
        df = pd.read_csv(obj['Body'])
        return df
    except Exception as e:
        print("Error loading logs: ", e)
        return pd.DataFrame([[-1, '']], columns=['notifier_id','last_parsing_date'])

def update_log(log, notifier_id, last_parsing_date):
    if log.loc[log.notifier_id == notifier_id].empty:
        # If the condition is not satisfied, append a new row to the DataFrame
        new_row = pd.DataFrame([[notifier_id,last_parsing_date]], columns=['notifier_id','last_parsing_date'])
        log = pd.concat([log, new_row])
    else:
        log.loc[log.notifier_id == notifier_id, 'last_parsing_date'] = last_parsing_date
    csv_buffer = log.to_csv(index=False)
    s3 = boto3.client('s3')
    s3.put_object(Bucket=bucket_name, Key=file_path_in_bucket, Body=csv_buffer)
    return load_log()

def get_txs_time_period(address, _from, _to):
    _df = None
    timestamp = urllib.parse.quote(_from.strftime("%Y-%m-%d+%H:%M:%S"),safe='+')
    while True:
        url = f"""
        https://api.seer.coinhall.org/api/coinhall/swaps/{address}?offset={timestamp}.010646870&limit=15
        """
        print(url)
        # Send a GET request to the API
        response = requests.get(url)
    
        time.sleep(1)
        print(f"Number of txs received: {len(response.json()['txs'])}")
        
        new_df = pd.DataFrame(response.json()['txs'])
        if _df is None:
            _df = new_df
        else:
            _df = pd.concat([_df, new_df])
        _df.timestamp = pd.to_datetime(_df.timestamp)
        min_ts = _df.timestamp.min()
        timestamp = urllib.parse.quote(min_ts.strftime("%Y-%m-%d+%H:%M:%S"),safe='+')

        if(min_ts.to_pydatetime().replace(tzinfo=None).strftime("%Y-%m-%d %H:%M:%S") < _to.strftime("%Y-%m-%d %H:%M:%S")):
            break
    return _df

def process_df(df, last_parsing_date):
    from pytz import UTC
    df = df[df.timestamp > pd.Timestamp(last_parsing_date, tz=UTC)]
    assets = {
        'ibc/B3504E092456BA618CC28AC671A71FB08C6CA0FD0BE7C8A5B5A3E2DD933CC9E4':'axlUSDC',
        'ibc/295548A78785A1007F232DE286149A6FF512F180AF5657780FC89C009E2C348F':'axlUSDC',
        'terra1nsuqsk6kh58ulczatwev87ttq2z6r3pusulg9r24mfj2fvtzd4uq3exn26':'ASTRO',
        'ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2': 'ATOM',
        'ibc/573FCD90FACEE750F55A8864EF7D38265F07E5A9273FA0E8DAFD39951332B580':'MARS'
    }
    df = df.drop_duplicates(ignore_index=True)
    df.returnAsset = df.returnAsset.replace(assets)
    df.offerAsset = df.offerAsset.replace(assets)
    df['date'] = df.timestamp.apply(lambda x: x.strftime("%Y-%m-%d"))

    return df 

def send_messages(tb, chat_id, messages):
    for message in messages:
        tb.send_message(chat_id, message, parse_mode='MarkdownV2')

def get_dates(log, notifier_id):
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

def get_messages(df, calculateUsdcValue, buying, 
                thresholdAmount, varReturnAsset, varOfferAsset,
                finder_tx, finder_address, token_name, rule_name):
    if(calculateUsdcValue):
        print("Calculating USDC value...")
        if(buying):
            print("Buying amount...")
            df['targetAmount'] = df['offerAmount'] * df['offerAssetUsdPrice']
        else:
            print("Selling amount...")
            df['targetAmount'] = df['returnAmount'] * df['returnAssetUsdPrice']
    else:
        print("Not calculating USDC value...")
        if(buying):
            print("Buying amount...")
            df['targetAmount'] = df.offerAmount
        else :
            print("Selling amount...")
            df['targetAmount'] = df.returnAmount

    if(buying):
        txs_to_notify = df[(df.targetAmount > thresholdAmount) & (df.offerAsset == varOfferAsset)]
    else:
        txs_to_notify = df[(df.targetAmount > thresholdAmount) & (df.returnAsset == varReturnAsset)]


    messages = []
    swap_msg = ''
    for i, row in txs_to_notify.iterrows():
        if(calculateUsdcValue):
            if(buying):
                swap_msg = f"""Swapped {round(row.targetAmount, 2)} $USDC for ${token_name}"""
            else:
                swap_msg = f"""Swapped ${token_name} for {round(row.targetAmount, 2)} $USDC"""
        if(not calculateUsdcValue):
            if(buying):
                swap_msg = f"""Swapped {round(row.targetAmount, 2)} ${row.offerAsset} for ${token_name}"""
            else:
                swap_msg = f"""Swapped ${token_name} for {round(row.targetAmount, 2)} ${varReturnAsset}"""
        messages.append(f"""
*{rule_name}*

{swap_msg}
Trader: [{shortAddress(row.traderAddress)}]({finder_address}{row.traderAddress})
Tx: [{shortAddress(row.txHash)}]({finder_tx}{row.txHash})
    """.replace(".","\."))
        
    return messages

def lambda_handler(event, context):
    # Process the event data
    print(json.dumps(event, indent=2))

    assert 'address' in event
    assert 'token_name' in event
    assert 'buying' in event
    assert 'calculateUsdcValue' in event
    assert 'thresholdAmount' in event
    assert 'notifier_id' in event
    assert 'finder_tx' in event
    assert 'finder_address' in event
    assert 'rule_name' in event

    address = event['address']
    token_name = event['token_name']
    buying = event['buying']
    varOfferAsset = event['varOfferAsset'] if 'varOfferAsset' in event else ''
    varReturnAsset = event['varReturnAsset'] if 'varReturnAsset' in event else ''
    calculateUsdcValue = event['calculateUsdcValue']
    thresholdAmount = event['thresholdAmount']
    notifier_id = event['notifier_id']
    finder_tx = event['finder_tx']
    finder_address = event['finder_address']
    rule_name = event['rule_name']

    log = load_log()
    current_date, last_parsing_date, log = get_dates(log, notifier_id)
    print(f"Filling the upper gap from {current_date.strftime('%Y-%m-%d %H:%M:%S')} to {last_parsing_date.strftime('%Y-%m-%d %H:%M:%S')}")
    df = get_txs_time_period(address, current_date, last_parsing_date)

    df = process_df(df, last_parsing_date)
    messages = get_messages(df, calculateUsdcValue, buying, 
                 thresholdAmount, varReturnAsset, 
                 varOfferAsset, finder_tx, finder_address, 
                 token_name, rule_name)

    print(messages)
    TOKEN = os.getenv('BOT_TOKEN','')
    chat_id = os.getenv('CHAT_ID','')
    tb = telebot.TeleBot(TOKEN)
    send_messages(tb, chat_id, messages)

    _last_parsing_date = df.timestamp.max().to_pydatetime().replace(tzinfo=None)
    last_parsing_date = _last_parsing_date if len(df) > 0 else current_date
    update_log(log, notifier_id, last_parsing_date) 

    return {
        'statusCode': 200
    }


if __name__ == "__main__":
    with open('messages/token_trades_notifier/sell_kuji.json', 'r') as file:
        event_data = json.load(file)

    # Invoke the Lambda function
    result = lambda_handler(event_data, None)