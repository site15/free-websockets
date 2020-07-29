export UID=$(id -u)
export GID=$(id -g)
docker-compose -f ./k8s/local/docker-compose.config-yml build
docker save free-websockets/server_service:local > ./tmp/server_service_local.tar
microk8s ctr image import ./tmp/server_service_local.tar
./k8s/local/apply.sh