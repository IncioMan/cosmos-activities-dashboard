pipenv requirements > requirements.txt
rm -r deps/
pip install -r requirements.txt --target deps/
cd deps
zip -r ../my-deployment-package.zip .
cd ..
zip my-deployment-package.zip lambda_function.py