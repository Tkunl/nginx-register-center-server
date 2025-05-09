# 构建镜像
docker build -t nginx-register-center .

# 创建 docker 网络
docker network create cfg-network

# 跑 MongoDB with network
docker run --network cfg-network --name mongodb-cfg-network -d -p 27017:27017 -v /home/tkunl/Docker/mongodb:/data/db mongo:latest --bind_ip_all

# 运行 nginx-register-center with network 容器
docker run --network cfg-network --name nginx-register-center -d -p 3000:3000 -v /var/run/docker.sock:/var/run/docker.sock nginx-register-center
# 挂载 nginx 配置卷 (Ubuntu 下)
docker run --network cfg-network --name nginx-register-center -d -p 3000:3000 -v /home/tkunl/Docker/nginx/conf.d:/etc/nginx/conf.d -v /var/run/docker.sock:/var/run/docker.sock nginx-register-center
# 挂载 nginx 配置卷 (Macos 下)
docker run --network cfg-network --name nginx-register-center -d -p 3000:3000 -v /Users/tkunl/Workspace/DockerContainers/nginx/conf.d:/etc/nginx/conf.d -v /var/run/docker.sock:/var/run/docker.sock nginx-register-center

# 挂载 docker.sock
-v /var/run/docker.sock:/var/run/docker.sock

# 调试容器
docker run -it --entrypoint /bin/sh nginx-register-center

# 启动容器
docker start nginx-register-center