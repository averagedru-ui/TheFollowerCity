#!/bin/sh
# usage: shotmap.sh name "query" -> screenshot of map.html in scratchpad
OUT="C:/Users/Dru/AppData/Local/Temp/claude/D--Git-Projects-TheFollowSprings/ee6a5bc7-0f4c-468e-a020-5737e0926d3a/scratchpad/map-$1.png"
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu --hide-scrollbars --window-size=1500,900 --virtual-time-budget=12000 --screenshot="$OUT" "http://localhost:5173/map.html?$2" >/dev/null 2>&1
echo "$OUT"
