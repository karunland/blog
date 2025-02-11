# Build stage
FROM node:18.19.1-alpine3.19 AS builder

# Add npm registry configurations
RUN npm config set registry https://registry.npmjs.org/
RUN npm config set fetch-retry-maxtimeout 600000

WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps --no-audit
COPY . .

ARG REACT_APP_API_URL
ARG REACT_APP_GOOGLE_CLIENT_ID
ARG REACT_APP_TINYMCE_API_KEY

ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_GOOGLE_CLIENT_ID=$REACT_APP_GOOGLE_CLIENT_ID
ENV REACT_APP_TINYMCE_API_KEY=$REACT_APP_TINYMCE_API_KEY

RUN npm run build

# Production stage
FROM node:18.19.1-alpine3.19

WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/build ./build

EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000", "--no-clipboard"] 