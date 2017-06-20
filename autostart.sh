firefox -url http://localhost:3000/ &
sleep 5
xdotool search --sync --onlyvisible --class "Firefox" windowactivate key F11
