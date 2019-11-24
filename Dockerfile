FROM nginx:mainline-alpine
RUN rm /etc/nginx/conf.d/*

ADD nginx.conf /etc/nginx/conf.d/
RUN mkdir -p /etc/nginx/html/static/app1
RUN mkdir -p /etc/nginx/html/static/app2
RUN mkdir -p /etc/nginx/html/static/portal

COPY dist/app1 /etc/nginx/html/static/app1/
COPY dist/app2 /etc/nginx/html/static/app2/
COPY dist/portal /etc/nginx/html/static/portal/
