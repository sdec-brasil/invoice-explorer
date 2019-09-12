FROM node:10

# RUN cd /root \
#     && git clone https://github.com/sdec-brasil/invoice-explorer/
WORKDIR /root

ADD api/ api/
ADD simulator/ simulator/

WORKDIR /root/api/
RUN npm install nodemon -g

CMD ["npm", "start"]

EXPOSE 8000

# Use baseimage-docker's init system.
