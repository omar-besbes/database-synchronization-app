#!/bin/bash

# Changing owner of `server.key` is required by postgres,
# see https://www.postgresql.org/docs/current/ssl-tcp.html#SSL-SETUP
chown postgres:postgres /ssl/server.key \
  && /usr/local/bin/docker-entrypoint.sh \
  postgres \
    -c 'ssl=on' \
    -c 'ssl_cert_file=/ssl/server.crt' \
    -c 'ssl_key_file=/ssl/server.key' \
    -c 'ssl_ciphers=HIGH:MEDIUM:+3DES:!aNULL' \
    -c 'ssl_prefer_server_ciphers=on'
