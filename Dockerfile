FROM node:20 as build
WORKDIR /app
COPY . /app/

RUN --mount=type=cache,source=/usr/local/share/.yarn_docker,target=/usr/local/share/.yarn_docker YARN_CACHE_FOLDER=/usr/local/share/.yarn_docker yarn --frozen-lockfile

RUN yarn bundle

FROM node:20-alpine3.19 as runtime
WORKDIR /app
COPY --from=build /app/bundle.js /app/bundle.js
CMD ["node", "bundle.js"]
