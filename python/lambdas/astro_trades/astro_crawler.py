#!/usr/bin/env python
# coding: utf-8

# In[313]:


import requests
import json
import pandas as pd
import time
import re
import urllib
import matplotlib
import numpy as np
pd.set_option('display.max_colwidth', None)


# In[314]:


import boto3
from io import StringIO


# In[315]:


s3 = boto3.client('s3')


# In[316]:


address = "terra1w579ysjvpx7xxhckxewk8sykxz70gm48wpcuruenl29rhe6p6raslhj0m6"


# In[317]:


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

        if(min_ts.to_pydatetime().replace(tzinfo=None).strftime("%Y-%m-%d") < _to.strftime("%Y-%m-%d")):
            break
    return _df


# In[318]:


from datetime import datetime, timedelta

current_date = datetime.now()
threshold_day = current_date - timedelta(days=40)


# In[320]:


bucket_name='incioman-data-analysis'
file_path_in_bucket = 'astro_trading/data/raw_swaps/swaps.csv'
try:
    print(f"Trying to load swaps from {bucket_name} {file_path_in_bucket}")
    # Load the CSV file from S3
    obj = s3.get_object(Bucket=bucket_name, Key=file_path_in_bucket)
    df = pd.read_csv(obj['Body'])
    df.timestamp = pd.to_datetime(df.timestamp, format='mixed')
    print(f"Loaded swaps from {bucket_name} {file_path_in_bucket}")
except Exception as e:
    print(f"No file yet {e}")
    df = None


# In[321]:


if df is None:
    print("No data yet. Downloading it all...")
    df = get_txs_time_period(current_date, threshold_day)
else:
    if df.timestamp.max().to_pydatetime().replace(tzinfo=None) < current_date:
        print(f"Filling the upper gap from {current_date.strftime('%Y-%m-%d')} to {df.timestamp.max().to_pydatetime().replace(tzinfo=None).strftime('%Y-%m-%d')}")
        tt_df = get_txs_time_period(current_date, df.timestamp.max().to_pydatetime().replace(tzinfo=None))
        df = pd.concat([df, tt_df])
    if df.timestamp.min().to_pydatetime().replace(tzinfo=None) > threshold_day:
        print(f"Filling the lower gap from {threshold_day.strftime('%Y-%m-%d')} to {df.timestamp.min().to_pydatetime().replace(tzinfo=None).strftime('%Y-%m-%d')}")
        tt_df = get_txs_time_period(df.timestamp.min().to_pydatetime().replace(tzinfo=None), threshold_day)
        df = pd.concat([df, tt_df])
df = df.drop_duplicates(ignore_index=True)


# In[322]:


assets = {
    'ibc/B3504E092456BA618CC28AC671A71FB08C6CA0FD0BE7C8A5B5A3E2DD933CC9E4':'axlUSDC',
    'terra1nsuqsk6kh58ulczatwev87ttq2z6r3pusulg9r24mfj2fvtzd4uq3exn26':'ASTRO'
}


# In[323]:


df = df.drop_duplicates(ignore_index=True)
df.returnAsset = df.returnAsset.replace(assets)
df.offerAsset = df.offerAsset.replace(assets)


# In[324]:


df['date'] = df.timestamp.apply(lambda x: x.strftime("%Y-%m-%d"))


# In[327]:


try:
    print(f"Trying to upload swaps to {bucket_name} {file_path_in_bucket}")
    csv_buffer = df.to_csv(index=False)
    s3 = boto3.client('s3')
    s3.put_object(Bucket=bucket_name, Key=file_path_in_bucket, Body=csv_buffer)
    print(f"Uploaded swaps to {bucket_name} {file_path_in_bucket}")
except Exception as e:
    print(f"No file yet {e}")
    df = None


# In[328]:


_sell = df[df.offerAsset=='ASTRO']
_buy = df[df.returnAsset=='ASTRO']
_sell['astro_amount'] =  - _sell.offerAmount
_buy['astro_amount'] =  _buy.returnAmount
_sell['usdc_amount'] =  - _sell.returnAmount
_buy['usdc_amount'] =  _buy.offerAmount
df = pd.concat([_sell, _buy])


# In[329]:


from datetime import datetime, timedelta

today = datetime.today()
one_month_earlier = today - timedelta(days=30)
one_month_earlier_date = one_month_earlier.strftime("%Y-%m-%d")
one_week_earlier = today - timedelta(days=7)
one_week_earlier_date = one_week_earlier.strftime("%Y-%m-%d")
today_date = today.strftime("%Y-%m-%d")

print(one_month_earlier_date)
print(one_week_earlier_date)
print(today_date)


# In[330]:


def get_df_before_date(df, date, sell=True):  
    if(sell):
        _tt =  df[(df.date >= date)]\
            [['traderAddress','usdc_amount']]\
            .groupby('traderAddress')\
            .sum()
        _tt = _tt[_tt.usdc_amount < 0]
    else:
        _tt =  df[(df.date >= date)]\
            [['traderAddress','usdc_amount']]\
            .groupby('traderAddress')\
            .sum()
        _tt = _tt[_tt.usdc_amount > 0]
    return _tt.sort_values(by='usdc_amount', ascending=sell).reset_index().head(50)


# In[331]:


tt_sell_month = get_df_before_date(df, one_month_earlier_date)
tt_sell_week = get_df_before_date(df, one_week_earlier_date)
tt_sell_today = get_df_before_date(df, today_date)

tt_buy_month = get_df_before_date(df, one_month_earlier_date, sell=False)
tt_buy_week = get_df_before_date(df, one_week_earlier_date, sell=False)
tt_buy_today = get_df_before_date(df, today_date, sell=False)


# In[332]:


tt_sell_today


# In[333]:


import requests
import json

def get_balances(address):
    url = "https://starscream-terra-mainnet.chainscope.dev/"
    headers = {
        "Content-Type": "application/json"
    }
    
    body = {
        "query": """
        query Query($address: String!, $tokenContracts: [String!]!) {
            tokenBalances(address: $address, tokenContracts: $tokenContracts)
        }
        """,
        "variables": {
            "address": f"{address}",
            "tokenContracts": [
                "terra1x62mjnme4y0rdnag3r8rfgjuutsqlkkyuh4ndgex0wl3wue25uksau39q8",
                "terra1xp9hrhthzddnl7j5du83gqqr4wmdjm5t0guzg9jp6jwrtpukwfjsjgy4f3",
                "terra19p20mfnvwh9yvyr7aus3a6z6g6uk28fv4jhx9kmnc2m7krg27q2qkfenjw",
                "terra1nsuqsk6kh58ulczatwev87ttq2z6r3pusulg9r24mfj2fvtzd4uq3exn26",
                "terra1ecgazyd0waaj3g7l9cmy5gulhxkps2gmxu9ghducvuypjq68mq2s5lvsct",
                "terra1lxx40s29qvkrcj8fsa3yzyehy7w50umdvvnls2r830rys6lu2zns63eelv",
                "terra17aj4ty4sz4yhgm08na8drc0v03v2jwr3waxcqrwhajj729zhl7zqnpc0ml"
            ]
        },
        "operationName": "Query"
    }
    
    response = requests.post(url, headers=headers, data=json.dumps(body))
    
    if response.status_code == 200:
        result = response.json()
        return result
    else:
        print("Request failed with status code:", response.status_code)


# In[334]:


tokens = [
"xASTRO",
"SAYVE",
"ORNE",
"ASTRO",
"ampLUNA",
"ROAR",
"boneLuna"
]


# In[335]:


addresses = set(tt_sell_month.traderAddress.tolist())\
    .union(set(tt_sell_week.traderAddress.tolist()))\
    .union(set(tt_sell_today.traderAddress.tolist()))\
    .union(set(tt_buy_month.traderAddress.tolist()))\
    .union(set(tt_buy_week.traderAddress.tolist()))\
    .union(set(tt_buy_today.traderAddress.tolist()))


# In[336]:


balances = []
for address in addresses:
    balance_dict = {k: int(v)/1000000 for k, v in zip(tokens, get_balances(address)['data']['tokenBalances'])}
    balance_dict['traderAddress']= address
    balances.append(balance_dict)


# In[337]:


def add_balances(df, balances, sell=True):
    _tt = df
    if(not sell):
        _tt['dollar_amount'] = _tt.usdc_amount
    if(sell):
        _tt['dollar_amount'] = _tt.usdc_amount
    _tt = pd.DataFrame(balances).merge(df, on='traderAddress')
    _tt['total_astro_holdings'] = _tt['ASTRO'] + _tt['xASTRO']
    _tt.dollar_amount = _tt.dollar_amount.apply(abs)
    _tt.total_return_dollar_amount = _tt.dollar_amount.apply(int)
    _tt["total_return_dollar_amount_label"] = _tt.total_return_dollar_amount.apply(lambda x: f"${int(x/1000)}k" if x > 1000 else f"${x}")
    return _tt


# In[338]:


tt_sell_month_balances = add_balances(tt_sell_month, balances)
tt_sell_week_balances = add_balances(tt_sell_week, balances)
tt_sell_today_balances = add_balances(tt_sell_today, balances)


# In[339]:


tt_buy_month_balances = add_balances(tt_buy_month, balances, sell=False)
tt_buy_week_balances = add_balances(tt_buy_week, balances, sell=False)
tt_buy_today_balances = add_balances(tt_buy_today, balances, sell=False)


# In[345]:


def write_to_s3(df, filename, bucket_name='incioman-data-analysis'):
    print(f"Uploading {filename} to {datetime.today().date().strftime('%Y%m%d')} on s3")
    json_string = df.to_json(orient='records')
    file_path = f"astro_trading/data/summary_for_webapp/{datetime.today().date().strftime('%Y%m%d')}/{filename}"
    s3.put_object(Body=json_string, Bucket=bucket_name, Key=file_path)


# In[346]:


write_to_s3(tt_sell_month_balances, "top_monthly_sellers.json")
write_to_s3(tt_sell_week_balances, "top_weekly_sellers.json")
write_to_s3(tt_sell_today_balances, "top_today_sellers.json")

write_to_s3(tt_buy_month_balances, "top_monthly_buyers.json")
write_to_s3(tt_buy_week_balances, "top_weekly_buyers.json")
write_to_s3(tt_buy_today_balances, "top_today_buyers.json")


# In[ ]:




