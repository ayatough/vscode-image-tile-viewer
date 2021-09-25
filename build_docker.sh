#!/bin/sh

if [ $# -ne 1 ] ; then
    echo invalid \# of args. exiting...
    exit
fi

image_name=$1

# --shm-size 8G

docker build --build-arg UID=$(id -u) --build-arg GID=$(id -g) -t $image_name .