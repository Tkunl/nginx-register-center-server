# 构建镜像
docker build -t nginx-register-center .

# 运行 nginx-register-center 容器
docker run --name nginx-register-center -p 3000:3000 nginx-register-center

# 调试容器
docker run -it --entrypoint /bin/sh nginx-register-center

# 启动容器
docker start nginx-register-center

# 创建 docker 网络
docker network create cfg-network

# 跑 MongoDB with network
docker run --network cfg-network --name mongodb-cfg-network -d -p 27017:27017 -v /Users/tkunl/Workspace/DockerContainers/mongodb:/data/db mongo:latest --bind_ip_all

# 运行 nginx-register-center with network 容器
docker run -d --name nginx-register-center -p 3000:3000 --network cfg-network nginx-register-center

# 挂载 docker.sock
-v /var/run/docker.sock:/var/run/docker.sock