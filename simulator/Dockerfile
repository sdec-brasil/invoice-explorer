FROM node:10

# RUN cd /root \
#     && git clone https://github.com/sdec-brasil/invoice-explorer/
WORKDIR /root

ADD . simulator/

WORKDIR /root/simulator/

CMD ["node", "src/main.js"]

# Use baseimage-docker's init system.
