FROM node:current as build-deps

WORKDIR /app

ENV LC_ALL C.UTF-8
ENV LANG C.UTF-8


COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json

RUN npm install

COPY ./public/ /app/public
COPY ./scripts /app/scripts
COPY ./config /app/config

COPY ./src/ /app/src
COPY ./.env.production /app

# RUN REACT_APP_DISABLE_AUTH=true npm run build
RUN npm run build

FROM nginx:1.12

COPY --from=build-deps /app/build /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
