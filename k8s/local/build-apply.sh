export UID=$(id -u)
export GID=$(id -g)
docker-compose -f ./k8s/local/docker-compose.config-yml build
docker save endykaufman/free-websockets:local > ./tmp/endykaufman-free-websockets-local.tar
microk8s ctr image import ./tmp/endykaufman-free-websockets-local.tar
./k8s/local/apply.sh