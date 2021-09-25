FROM node:latest
MAINTAINER ayatough
ARG USER=node
# ARG UID
# ARG GID
ENV SHELL /bin/bash
ENV DEBIAN_FRONTEND noninteractive
RUN sed -i'' 's/archive.ubuntu.com/jp.archive.ubuntu.com/' /etc/apt/sources.list
RUN apt-get update -y && apt-get install -y \
  wget sudo git libgl1-mesa-dev libgl1-mesa-dev libglib2.0-0 libsm6 libxrender1 libxext6 \
  && apt-get purge avahi-daemon \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*
# RUN groupadd -g ${GID} ${USER} | true
# RUN useradd -u ${UID} -m ${USER} -g ${GID}
# RUN useradd -m ${USER}
RUN npm i typescript vsce @vue/cli -g
RUN gpasswd -a ${USER} sudo
RUN echo "${USER}:test" | chpasswd
USER ${USER}
ENV HOME /home/${USER}
RUN echo source /usr/share/bash-completion/completions/git >> /home/${USER}/.bashrc
WORKDIR ${HOME}
