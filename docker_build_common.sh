#!/bin/bash

if [[ -z "${DB_BRAND}" ]]; then
  echo "### DB_BRAND invalid"
  exit 1
fi

if [[ -z "${DB_PASSWORD}" ]]; then
  echo "### DB_BRAND invalid"
  exit 1
fi

if [[ -z "${DB_HOST}" ]]; then
  echo "### DB_BRAND invalid"
  exit 1
fi

docker build -t wastpl:0.1 \
  --build-arg DB_BRAND="${DB_BRAND}" \
  --build-arg DB_HOST="${DB_HOST}" \
  --build-arg DB_NAME="${DB_NAME}" \
  --build-arg DB_USER="${DB_USER}" \
  --build-arg DB_PASSWORD="${DB_PASSWORD}" \
  --build-arg TZ="${TZ}" \
  --build-arg REDIS_HOST="${REDIS_HOST}" .