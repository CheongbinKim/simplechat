rm -rf simplechat
git clone https://github.com/cheongbinkim/simplechat
docker stop simplechat
docker rm simplechat
docker build --tag simplechat:latest -f Dockerfile .
docker run -d -p 3000:3000 --name simplechat simplechat:latest

