FROM node

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 8080

ENV CHOKIDAR_USEPOLLING=true

CMD npm run dev