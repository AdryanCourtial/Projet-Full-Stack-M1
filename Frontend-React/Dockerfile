FROM node:alpine3.23 AS build
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
EXPOSE 5173
CMD [ "npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173" ]

FROM nginx:stable-alpine AS production
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD [ "nginx", "-g", "deamon off;" ]