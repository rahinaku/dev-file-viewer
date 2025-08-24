#!/bin/bash

ESC=$(printf '\033')
CSI="${ESC}["
RESET="${CSI}0m"
GREEN="${CSI}32m"
ERASE_LINE="${CSI}2K"
HIDE_CURSOR="${CSI}?25l"

function spinner() {
        local i=0
        local spin='⠧⠏⠛⠹⠼⠶'
        local n=${#spin}
        while true; do
                sleep 0.1
                printf "%s%s" "${ERASE_LINE}"
                printf "%s %s" "${GREEN}${spin:i++%n:1}${RESET}" "$*"
                printf "%s\r" "${HIDE_CURSOR}"
        done
}

if [ -e Dockerfile ]; then
    echo "Dockerfile exists"
else
    echo "Dockerfile does not exist"
    exit 1
fi

echo "build container"
sudo docker build -t file-viewer .

# スピナーを表示
spinner "Saving container image..." & pid=$!
sudo docker save file-viewer:latest > file-viewer.tar
kill $pid
wait $pid 2>/dev/null


spinner "Importing container image to k3s..." & pid=$!
sudo k3s ctr images import file-viewer.tar
kill $pid
wait $pid 2>/dev/null

echo "build completed"

# もし引数に--runを受け取ったら
if [ "$1" == "--run" ]; then
    # コンテナを起動する
  sudo kubectl delete -f ./k8s/file-viewer.local.yaml || true
  sudo kubectl apply -f ./k8s/file-viewer.local.yaml
else
    echo "Run the container with --run argument to start it."
fi
