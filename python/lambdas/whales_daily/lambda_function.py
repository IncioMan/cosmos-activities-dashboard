import pandas as pd
import boto3
from datetime import datetime

s3 = boto3.client('s3')

def write_to_s3(df, file_path, bucket_name='incioman-data-analysis'):
    print(f"Uploading {file_path} to {datetime.today().date().strftime('%Y%m%d')} on s3")
    json_string = df.to_json(orient='records')
    s3.put_object(Body=json_string, Bucket=bucket_name, Key=file_path)

def load_from_s3(file_path_in_bucket, bucket_name='incioman-data-analysis'):
    print(f"Trying to load swaps from {bucket_name} {file_path_in_bucket}")
    # Load the CSV file from S3
    obj = s3.get_object(Bucket=bucket_name, Key=file_path_in_bucket)
    df = pd.read_csv(obj['Body'])
    print(f"Loaded swaps from {bucket_name} {file_path_in_bucket}")
    return df

def lambda_handler(event, context):

    file_path_in_bucket = 'astro_trades/data/raw_swaps/swaps.csv'
    try:
        swaps_df = load_from_s3(file_path_in_bucket)
        swaps_df.timestamp = pd.to_datetime(swaps_df.timestamp, format='mixed')
    except Exception as e:
        print(f"No file yet {e}")
        swaps_df = None

    file_path_in_bucket = 'astro_trades/data/balances/20230720.csv'
    try:
        balances_df = load_from_s3(file_path_in_bucket)
        balances_df['traderAddress'] = balances_df['address']
    except Exception as e:
        print(f"No file yet {e}")
        balances_df = None

    _sell = swaps_df[swaps_df.offerAsset=='ASTRO']
    _buy = swaps_df[swaps_df.returnAsset=='ASTRO']
    _sell['astro_amount'] =  - _sell.offerAmount
    _buy['astro_amount'] =  _buy.returnAmount
    swaps_df = pd.concat([_sell, _buy])


    percentile = 0.99
    print(f"Amount of ASTRO that defines a whale ({percentile} percentile): {balances_df.total_astro.quantile(percentile)}")
    whales = balances_df[balances_df.total_astro > balances_df.total_astro.quantile(percentile)]
    print(f"How many whales: {len(whales)}")

    daily_delta = swaps_df[['traderAddress','date','astro_amount']].groupby(['traderAddress','date']).sum().reset_index()
    daily_delta[["traderAddress","astro_amount"]]\
        .groupby(['traderAddress']).sum().reset_index()\
        .sort_values(by='astro_amount').head()
    
    whales_daily = whales.merge(daily_delta[daily_delta.date>='2023-07-01'],on='traderAddress', how='left').fillna(0)
    tt = whales_daily[whales_daily.date != 0][['date','astro_amount']].groupby('date').sum().reset_index().sort_values(by='date')
    write_to_s3(tt, file_path = f"astro_trades/data/whales_daily_delta/{datetime.today().date().strftime('%Y%m%d')}.json")
    tt = whales_daily[whales_daily.date!=0][['address','date','astro_amount']]\
                        .groupby(['address','date'])\
                        .sum().reset_index().sort_values(by='date')
    write_to_s3(tt, file_path = f"astro_trades/data/whales_daily_delta_by_address/{datetime.today().date().strftime('%Y%m%d')}.json")

if __name__ == "__main__":
    
    # Invoke the Lambda function
    result = lambda_handler(None, None)