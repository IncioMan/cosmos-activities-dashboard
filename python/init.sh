docker build -t python-my .
docker run --rm -it -p 8080:8080 -v $(pwd):/app python-my /bin/bash