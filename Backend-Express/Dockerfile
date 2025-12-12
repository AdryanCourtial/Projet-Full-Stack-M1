FROM node:alpine3.23 as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV DATABASE_URL=mysql://root:@localhost:3306/full-stack-dev
EXPOSE 3000
CMD [ "npm", "start" ]

FROM nginx:stable-alpine AS production
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD [ "nginx", "-g", "deamon off;" ]