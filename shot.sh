#!/bin/sh
# usage: shot.sh Category [height]  -> writes PNG in scratchpad
OUT="C:/Users/Dru/AppData/Local/Temp/claude/D--Git-Projects-TheFollowSprings/ee6a5bc7-0f4c-468e-a020-5737e0926d3a/scratchpad/$1.png"
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu --hide-scrollbars --window-size=1500,${2:-1000} --virtual-time-budget=3000 --screenshot="$OUT" "http://localhost:5173/?cat=$1" >/dev/null 2>&1
echo "$OUT"
