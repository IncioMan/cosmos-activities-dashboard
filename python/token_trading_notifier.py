#!/usr/bin/env python
# coding: utf-8

# In[39]:


import requests
import json
import pandas as pd
import time
import re
import urllib
import numpy as np
pd.set_option('display.max_colwidth', None)


# In[40]:


try:
    log = pd.read_csv("./notifier_logging.csv")
except Exception as e:
    print(f"No file yet {e}")
    log = None


# ### Configuration

# In[41]:


"""
pipenv run jupyter nbconvert --to python token_trading_notifier.ipynb
"""
"""
pipenv run python token_trading_notifier.py \
--address "terra1w579ysjvpx7xxhckxewk8sykxz70gm48wpcuruenl29rhe6p6raslhj0m6" \
--token_name "ASTRO" \
--varReturnAsset 'axlUSDC' \
--thresholdAmount 1000 \
--notifier_id 1 \
--finder_tx "https://chainsco.pe/terra2/tx/" \
--finder_address "https://chainsco.pe/terra2/address/" \
--rule_name 'Sell ASTRO'
"""
"""
pipenv run python token_trading_notifier.py \
--address "terra1w579ysjvpx7xxhckxewk8sykxz70gm48wpcuruenl29rhe6p6raslhj0m6" \
--token_name "ASTRO" \
--buying \
--varOfferAsset 'axlUSDC' \
--thresholdAmount 1000 \
--notifier_id 1 \
--finder_tx "https://chainsco.pe/terra2/tx/" \
--finder_address "https://chainsco.pe/terra2/address/" \
--rule_name 'Buy ASTRO'
"""
"""
pipenv run python token_trading_notifier.py \
--address "kujira14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9sl4e867" \
--token_name "KUJI" \
--varReturnAsset 'axlUSDC' \
--thresholdAmount 1000 \
--notifier_id 3 \
--rule_name 'Sell KUJI' \
--finder_tx 'https://finder.kujira.network/kaiyo-1/tx/' \
--finder_address 'https://finder.kujira.network/kaiyo-1/address/'
"""
"""
pipenv run python token_trading_notifier.py \
--address "kujira14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9sl4e867" \
--token_name "KUJI" \
--buying \
--varOfferAsset 'axlUSDC' \
--thresholdAmount 1000 \
--rule_name 'Buy KUJI' \
--finder_tx 'https://finder.kujira.network/kaiyo-1/tx/' \
--finder_address 'https://finder.kujira.network/kaiyo-1/address/' \
--notifier_id 4 
"""


# In[42]:


"""
address = "kujira14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9sl4e867"
token_name = "KUJI"
buying = False
calculateUsdcValue = False
varReturnAsset = 'axlUSDC'
thresholdAmount = 100
notifier_id = 3
rule_name = 'Sell KUJI'
finder_tx = 'https://finder.kujira.network/kaiyo-1/tx/'
finder_address = 'https://finder.kujira.network/kaiyo-1/address/'
"""


# In[43]:


"""
address = "terra1w579ysjvpx7xxhckxewk8sykxz70gm48wpcuruenl29rhe6p6raslhj0m6"
token_name = "ASTRO"
buying = False
calculateUsdcValue = False
varReturnAsset = 'axlUSDC'
thresholdAmount = 1
notifier_id = 1
finder_tx = "https://chainsco.pe/terra2/tx/"
finder_address = "https://chainsco.pe/terra2/address/"
rule_name = 'Sell ASTRO'
"""


# In[44]:


"""
address = "terra1w579ysjvpx7xxhckxewk8sykxz70gm48wpcuruenl29rhe6p6raslhj0m6"
token_name = "ASTRO"
buying = True
varOfferAsset = 'axlUSDC'
calculateUsdcValue = False
thresholdAmount = 1
notifier_id = 2
finder_tx = "https://chainsco.pe/terra2/tx/"
finder_address = "https://chainsco.pe/terra2/address/"
rule_name = 'Buy ASTRO'
"""


# In[45]:


"""
address = "osmo1752ysawy2adr7td9an30a8pkk8ngrvcq3tan08lvnar3s7f82y5s4dt8fs"
token_name = "MARS"
buying = True
varOfferAsset = 'uosmo'
calculateUsdcValue = True
thresholdAmount = 1
notifier_id = 5
finder_tx = "https://chainsco.pe/osmosis/tx/"
finder_address = "https://chainsco.pe/osmosis/address/"
rule_name='Buy MARS'
"""


# ### Code

# In[46]:


import argparse

# Create an argument parser
parser = argparse.ArgumentParser()

# Add named arguments
parser.add_argument('--address', type=str, help='The address value')
parser.add_argument('--token_name', type=str, help='The token name')
parser.add_argument('--buying', action='store_true', help='Buying the token')
parser.add_argument('--varReturnAsset', type=str, help='The name for return asset')
parser.add_argument('--varOfferAsset', type=str, help='The name for offer asset')
parser.add_argument('--finder_tx', type=str, help='The finder url for txs')
parser.add_argument('--finder_address', type=str, help='The finder url for addresses')
parser.add_argument('--rule_name', type=str, help='The rule name')
parser.add_argument('--notifier_id', type=int, help='The notifier ID')
parser.add_argument('--thresholdAmount', type=int, help='The threshold amount')
parser.add_argument('--calculateUsdcValue', action='store_true', help='Calculate USDC value')

# Parse the arguments
args = parser.parse_args()

# Assign the parsed argument values to variables
address = args.address
token_name = args.token_name
buying = args.buying
varReturnAsset = args.varReturnAsset
varOfferAsset = args.varOfferAsset
notifier_id = args.notifier_id
calculateUsdcValue = args.calculateUsdcValue
thresholdAmount = args.thresholdAmount
rule_name = args.rule_name
finder_address = args.finder_address
finder_tx = args.finder_tx


# In[47]:


def get_txs_time_period(_from, _to):
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


# In[48]:


from datetime import datetime, timedelta

current_date = datetime.now()
_log = pd.DataFrame([(notifier_id, (current_date - timedelta(hours=1)).strftime('%Y-%m-%d %H:%M:%S.%f'))], columns=['notifier_id','last_parsing_date'])
if log is None:
    log = _log
if not notifier_id in log['notifier_id'].tolist():
    log = pd.concat([log,_log])


# In[49]:


last_parsing_date = log[log.notifier_id == notifier_id].last_parsing_date.tolist()[0]
last_parsing_date = datetime.strptime(last_parsing_date, '%Y-%m-%d %H:%M:%S.%f')


# In[50]:


print(f"Filling the upper gap from {current_date.strftime('%Y-%m-%d %H:%M:%S')} to {last_parsing_date.strftime('%Y-%m-%d %H:%M:%S')}")
df = get_txs_time_period(current_date, last_parsing_date)


# In[51]:


from pytz import UTC
df = df[df.timestamp > pd.Timestamp(last_parsing_date, tz=UTC)]


# In[52]:


assets = {
    'ibc/B3504E092456BA618CC28AC671A71FB08C6CA0FD0BE7C8A5B5A3E2DD933CC9E4':'axlUSDC',
    'ibc/295548A78785A1007F232DE286149A6FF512F180AF5657780FC89C009E2C348F':'axlUSDC',
    'terra1nsuqsk6kh58ulczatwev87ttq2z6r3pusulg9r24mfj2fvtzd4uq3exn26':'ASTRO',
    'ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2': 'ATOM',
    'ibc/573FCD90FACEE750F55A8864EF7D38265F07E5A9273FA0E8DAFD39951332B580':'MARS'
}


# In[53]:


df = df.drop_duplicates(ignore_index=True)
df.returnAsset = df.returnAsset.replace(assets)
df.offerAsset = df.offerAsset.replace(assets)


# In[54]:


df['date'] = df.timestamp.apply(lambda x: x.strftime("%Y-%m-%d"))


# In[55]:


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


# In[56]:


if(buying):
    txs_to_notify = df[(df.targetAmount > thresholdAmount) & (df.offerAsset == varOfferAsset)]
else:
    txs_to_notify = df[(df.targetAmount > thresholdAmount) & (df.returnAsset == varReturnAsset)]


# In[57]:


def shortAddress(address):
    return address[:7] + "..." + address[-6:]


# ### Create Telegram Messages

# In[58]:


messages = []
swap_msg = ''
for i, row in txs_to_notify.iterrows():
    if(calculateUsdcValue):
        if(buying):
            swap_msg = f"""Swapped {round(row.targetAmount, 2)} $USDC for ${token_name}"""
        else:
            swap_msg = f"""Swapped ${token_name} for $USDC for {round(row.targetAmount, 2)} $USDC"""
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


# ### Send Messages

# In[59]:


import os
bot_token = os.getenv('BOT_TOKEN')


# In[60]:


import telegram
from telegram.constants import ParseMode
bot = telegram.Bot(token=bot_token)


# In[61]:


print(messages)


# In[63]:


import asyncio

async def main():
    try:
        await bot.initialize()
        for message in messages:
            await bot.send_message(92383009, message, parse_mode=ParseMode.MARKDOWN_V2)
    finally:
        await bot.shutdown()

# Create an event loop and run the main coroutine function
loop = asyncio.get_event_loop()
loop.run_until_complete(main())


# ### Update logging file

# In[64]:


_last_parsing_date = df.timestamp.max().to_pydatetime().replace(tzinfo=None)
last_parsing_date = _last_parsing_date if len(df) > 0 else current_date


# In[69]:


import boto3
s3 = boto3.client('s3')

bucket_name='incioman-data-analysis'
file_path_in_bucket = '/data/token_notifier/notifier_logging.csv'

def load_log():
    # Load the CSV file from S3
    obj = s3.get_object(Bucket=bucket_name, Key=file_path_in_bucket)
    df = pd.read_csv(obj['Body'])
    return df

def update_log(log, notifier_id, last_parsing_date):
    log.loc[log.notifier_id == notifier_id, 'last_parsing_date'] = last_parsing_date
    csv_buffer = log.to_csv(index=False)
    s3 = boto3.client('s3')
    s3.put_object(Bucket=bucket_name, Key=file_path_in_bucket, Body=csv_buffer)
    return load_log()


# In[70]:


update_log(log, notifier_id, last_parsing_date)


# In[ ]:




