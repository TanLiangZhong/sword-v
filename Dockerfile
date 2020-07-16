
FROM nginx:alpine
# 维护者
MAINTAINER LiangZhong.Tan<liangzhong.tan@outlook.com>

WORKDIR /usr/share/nginx/html/

# Bundle app source
COPY ./doc/nginx.conf /etc/nginx/conf.d/default.conf
COPY ./dist /usr/share/nginx/html

EXPOSE 1218
CMD ["nginx", "-g", "daemon off;"]
