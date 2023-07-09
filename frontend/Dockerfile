FROM node

WORKDIR /app
COPY app/package* ./

# Install dependencies using pipenv
RUN npm install

CMD tail -f /dev/null