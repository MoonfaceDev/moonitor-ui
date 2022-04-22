call npm run build
call ssh elai@10.100.102.133 "rm -r /home/elai/MoonLAN/build"
call scp -r build elai@10.100.102.133:/home/elai/MoonLAN/build

