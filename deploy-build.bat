call npm run build
call ssh root@10.100.102.133 "rm -r /root/moonitor/app/build"
call scp -r build root@10.100.102.133:/root/moonitor/app/build

