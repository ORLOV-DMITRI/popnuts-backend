pm2 stop orlovserver && \
git merge master --ff-only && \
pm2 start orlovserver 
