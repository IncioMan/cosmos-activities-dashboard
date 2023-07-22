pipenv requirements > requirements.txt
rm -r deps/
pip install -r requirements.txt --target deps/
cd deps
zip -r ../lambda.zip .
cd ..
zip lambda.zip lambda_function.py