#!/bin/sh
cachedir=${XDG_CACHE_HOME:-"$HOME/.cache"}
if [ -d "$cachedir" ]; then
	cache=$cachedir/dmenu_run
else
	cache=$HOME/.dmenu_cache # if no xdg dir, fall back to dotfile in ~
fi

IFS=:
if stest -dqr -n "$cache" $PATH; then
	lst=`stest -flx $PATH | sort -r | tee "$cache"`
else
	lst=`cat "$cache"`
fi

choice=`printf "$lst\n" | tac | dmenu "$@"`
if [ "$choice" != "" ];then
	lst=`printf "$lst" | grep -v "^$choice\$"`
	printf "$lst\n" > "$cache"
	echo $choice | tee -a "$cache" | tac | ${SHELL:-"/bin/sh"} &
fi
