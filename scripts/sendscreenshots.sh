#!/bin/bash

if [[ -z $(find $SCREENSHOTS_DIR -name '*.png' -type f -print -quit) ]]; then
  echo "No screenshots found"
  exit 0
fi

sendSlackMessage() {
  curl -X POST -H "Authorization: Bearer $SLACK_TOKEN" \
  -H 'Content-type: application/json' \
  --data '{"channel":"CJ6NC2VTN","text":"'"$1"'"}' \
  https://slack.com/api/chat.postMessage
}

sendSlackMessage "There are e2e errors in $TRAVIS_BUILD_WEB_URL\nHere comes the screenshots of error 🤖"

find $SCREENSHOTS_DIR -name '*.png' -type f | while IFS= read -r FILE; do
  echo "Uploading $FILE..."
  curl -F file=@"$FILE" -F channels=CJ6NC2VTN -H "Authorization: Bearer $SLACK_TOKEN" https://slack.com/api/files.upload
done
