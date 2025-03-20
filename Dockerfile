FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm config set cache /app/.npm-cache --global
RUN npm ci --loglevel=error
COPY . .
RUN npm run build
RUN npm prune --production

FROM node:22-alpine
ENV NODE_ENV=production
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
WORKDIR /app
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/.next /app/.next
COPY --from=build /app/package.json /app/package.json
EXPOSE 3000
CMD ["npm", "start"]