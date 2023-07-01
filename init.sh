docker build -t node-my .
docker run --rm -it -p 3000:3000 -v $(pwd):/app node-my /bin/bash