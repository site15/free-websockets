docker save endykaufman/free-websockets > ./tmp/endykaufman-free-websockets.tar
microk8s ctr image import ./tmp/endykaufman-free-websockets.tar
microk8s kubectl apply -f  ./k8s/local