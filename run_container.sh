#!/bin/sh

if [ $# -ne 3 ] ; then
    echo invalid \# of args. exiting...
    exit
fi

root_dir=$1
image_name=$2
container_name=$3
ssh_dir=`echo ~/.ssh`
git_config=`echo ~/.gitconfig`

# --shm-size 8G

docker run -it --gpus all -v $root_dir:/home/node/image-tile-viewer -v $ssh_dir:/home/node/.ssh -v $git_config:/etc/gitconfig -p 8080:8080 --name $container_name $image_name /bin/bash
