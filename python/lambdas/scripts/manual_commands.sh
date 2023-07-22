#from token_trades_notifier folder
zip my-deployment-package.zip lambda_function.py
#update lambda zip
aws s3 cp my-deployment-package.zip s3://incioman-data-analysis/my-deployment-package.zip --profile local-dev
