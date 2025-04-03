FROM node:20-slim AS build

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

FROM node:20-slim AS runtime

WORKDIR /app

# Install curl and download wait-for-it.sh
RUN apt-get update && apt-get install -y curl
ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh /app/wait-for-it.sh
RUN chmod +x /app/wait-for-it.sh

COPY --from=build /app/package.json /app/yarn.lock ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

# Copy the database configuration and migration files
COPY --from=build /app/dist/database/migrations ./dist/database/migrations
COPY --from=build /app/dist/database/dataSource.js ./dist/database/dataSource.js

ENV NODE_ENV=production

EXPOSE 3000

CMD ["yarn", "start"]
