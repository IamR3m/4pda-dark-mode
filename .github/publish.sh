#!/bin/bash

header=$(git log -1 --format=%s)
comment=$(git log -1 --format=%b)

post="[size=3]Скрипт обновлен до версии ${header//v./}[/size]"$'\n\nЧто нового?\n[list]\n'
while IFS= read -r line; do
  modified_line="${line/-/[*]}"
  post+="$modified_line"$'\n'
done <<< "$comment"
post+="[/list]"

json=$(jq -nc \
  --arg forum "$FORUM" \
  --arg topic "$TOPIC" \
  --arg post "$post" \
  '{forum:$forum, topic:$topic, post:$post}')

curl 'https://iamr3m.icu:3008/signal' \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${SIGNAL_SECRET}" \
  --data "$json"
