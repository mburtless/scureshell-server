# ---- Base Node ----
FROM alpine:latest AS base
RUN apk update && apk upgrade && \
    apk add --no-cache nodejs nodejs-npm git
# Working directory for node app
WORKDIR /usr/src/scureshell-server
COPY package*.json ./

# ---- Dependencies ----
FROM base AS dependencies
# Install production modules
RUN npm set progress=false && npm config set depth 0
RUN npm install --only=production
# Copy production modules for later
RUN cp -R node_modules prod_node_modules
# Install modules needed for testing
RUN npm install

# ---- Test ----
FROM dependencies AS test
# Copy the rest of the app
COPY . .
ENV SS_DBHOST=mongodb://10.0.19.114:27017/scureshelldb-test
RUN npm run docker-test

# ---- Release ----
FROM base AS release
# Copy prod node modules
COPY --from=dependencies /usr/src/scureshell-server/prod_node_modules ./node_modules
# Copy rest of app
COPY . .
ENV SS_DBHOST=mongodb://10.0.19.114:27017/scureshelldb
EXPOSE 3000
CMD ["npm", "run", "docker-start"]
