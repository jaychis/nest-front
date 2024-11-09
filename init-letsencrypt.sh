#!/bin/bash

domains=(jaychis.com www.jaychis.com conf.d.jaychis.com)
email="akdl911215@naver.com" # 이메일 주소를 입력하세요.
staging=0 # 테스트 중에는 1로 설정하세요. 발급 중에는 0으로 설정합니다.

if [ -d "./nginx/certificates/live/${domains[0]}" ]; then
  echo "이미 인증서가 존재합니다."
else
  echo "인증서를 발급합니다."
  docker-compose run --rm certbot certonly --webroot -w /etc/letsencrypt/www \
    -d "${domains[@]}" \
    --email "$email" \
    --agree-tos \
    --no-eff-email
fi
