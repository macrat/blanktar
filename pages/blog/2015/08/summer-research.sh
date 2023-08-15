PARALLEL=1
if [ $PARALLEL -eq 1 ]; then
	OUTDIR="../result"
else
	OUTDIR="../result${PARALLEL}"
fi

function logger(){
	echo "`date +%FT%T`: $1: $2" >> ../log
}

function clean(){
	make clean distclean mrproper
	git clean -df
	git reset --hard
	rm .config 2>/dev/null
}

cd linux

tags=`git tag --list | grep -v - | sort -V | tail -n +2`

if [ ! -d $OUTDIR ]; then
	mkdir $OUTDIR
fi
for tag in $tags; do
	if [ ! -f $OUTDIR/$tag ]; then
		echo 'real user system' > $OUTDIR/$tag
	fi
done

clean

if [ ! -f ../source_sizes ]; then
	echo "version c_lines c_bytes h_lines h_bytes" > ../source_sizes
	for tag in $tags; do
		git checkout $tag
		echo "$tag" `wc -cl **/*.c | tail -n 1 | awk '{print $1 " " $2}'` `wc -cl **/*.h | tail -n 1 | awk '{print $1 " " $2}'` >> ../source_sizes
	done
fi

if [ ! -f ../functions_count ]; then
	targets="malloc calloc realloc free kmalloc krealloc kfree vmalloc vfree printf sprintf fprintf open fopen"
	echo version $targets struct > ../functions_count
	for tag in $tags; do
		git checkout $tag
		result=''
		for target in $targets; do
			result=`echo $result $(grep -r "[^a-zA-Z0-9]${target}[ \t\n]*(" * | grep -c .)`
		done
		result=`echo $result $(grep -r '[^a-zA-Z0-9]struct[ \t]\+.*{' * | grep -c .)`
		echo $tag $result >> ../functions_count
	done
fi

compiled_size_out=0
if [ ! -f ../binary_sizes ]; then
	echo "version kernel .o .so .ko" > ../binary_sizes
	compiled_size_out=1
fi

for tag in $tags; do
	logger "$tag" "start"

	logger "$tag" "checkout"
	git checkout $tag
	if [ $? -ne 0 ]; then
		logger "$tag" "checkout failed"
		clean
		continue
	fi

	logger "$tag" "config"
	yes "" | make config
	if [ $? -ne 0 ]; then
		logger "$tag" "config failed"
		clean
		continue
	fi

	logger "$tag" "compile"
	/usr/bin/time -a -o "$OUTDIR/$tag" -f '%E %U %S' make -j$PARALLEL
	if [ $? -ne 0 ]; then
		logger "$tag" "compile failed"
		echo -e '+\nd\nd\nwq\n' | ex -s "$OUTDIR/$tag"
		clean
		continue
	fi

	if [ $compiled_size_out -ne 0 ]; then
		logger "$tag" "calculate binary sizes"
		echo "$tag `du -b */bzImage | sort -n | tail -n1 | cut -f1` `du -bc **/*.o | tail -n1 | cut -f1` `du -bc **/*.so | tail -n1 | cut -f1` `du -bc **/*.ko | tail -n1 | cut -f1`" >> ../binary_sizes
	fi

	logger "$tag" "clean"
	clean

	logger "$tag" "done"
done
