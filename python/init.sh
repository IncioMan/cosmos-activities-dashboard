docker build -t python-my .
docker run --rm -it -p 8888:8888 -v $(pwd):/app python-my