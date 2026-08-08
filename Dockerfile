FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./

# The local network uses TLS inspection that is trusted by Windows but not by
# Linux containers. Package integrity is still verified by package-lock.json.
ARG NPM_STRICT_SSL=true
RUN npm config set strict-ssl ${NPM_STRICT_SSL} \
    && npm ci --no-audit --no-fund \
    && test -x node_modules/.bin/react-scripts

COPY public ./public
COPY src ./src
RUN npm run build

FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost/ >/dev/null || exit 1

CMD ["nginx", "-g", "daemon off;"]

