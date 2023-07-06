FROM python:3.9

RUN pip install pipenv

WORKDIR /app
COPY Pipfile* ./

# Install dependencies using pipenv
RUN pipenv install

EXPOSE 8888

# Start JupyterLab
CMD ["pipenv", "run", "jupyter", "lab", "--ip=0.0.0.0", "--port=8888", "--no-browser", "--allow-root"]
