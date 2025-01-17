#!/bin/bash

header=$(git log -1 --format=%s)
comment=$(git log -1 --format=%b)

post="[size=3]Скрипт обновлен до версии ${header}[/size]"$'\nЧто нового?\n[list]\n'
while IFS= read -r line; do
  modified_line="${line/-/[*]}"
  post+="$modified_line"$'\n'
done <<< "$comment"
post+="[/list]"

curl 'https://4pda.to/forum/index.php' \
--header 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.9,application/signed-exchange;v=b3;q=0.7' \
--header 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.00 Safari/537.36' \
--header "Cookie: $COOKIE" \
--form 'act=post' \
--form 'CODE=03' \
--form "f=$FORUM" \
--form "t=$TOPIC" \
--form "auth_key=$AUTH_KEY" \
--form "post=$post" \
--form "topic_id=$TOPIC" \
--form 'enable-emo-sig-flag=1' \
--form 'enableemo=yes' \
--form 'enablesig=yes' \
--form 'mod_options=nowt' \
--form 'submit='
