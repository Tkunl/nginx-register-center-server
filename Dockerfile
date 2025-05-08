# 构建阶段：安装依赖并编译
FROM docker.1ms.run/node:22.14-alpine3.20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm config set registry https://registry.npmmirror.com/
RUN npm install
COPY . .
RUN npm run build

# 生产阶段：仅保留构建产物和必要依赖
FROM docker.1ms.run/node:22.14-alpine3.20
WORKDIR /usr/src/app

# 设置环境变量
ENV NODE_ENV=win10

COPY --from=builder /app/dist /app
COPY --from=builder /app/package.json /app/package.json
WORKDIR /app
RUN npm config set registry https://registry.npmmirror.com/
RUN npm install --production

EXPOSE 3000
CMD ["node", "app/main.js"]  # 指定启动命令