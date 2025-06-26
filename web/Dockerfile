# Build stage
FROM node:18.19.1-alpine3.19 AS builder

# Add npm registry configurations
RUN npm config set registry https://registry.npmjs.org/
RUN npm config set fetch-retry-maxtimeout 600000

WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps --no-audit
COPY . .

# # Set environment variables directly
# ENV REACT_APP_API_URL=http://localhost:5001
# ENV REACT_APP_GOOGLE_CLIENT_ID=312877528405-qa9ko52v5jse2tpcl3ce3io4vpr8qkd0.apps.googleusercontent.com
# ENV REACT_APP_TINYMCE_API_KEY=hkjlrkjgdo2wklip7jqlleavme3j8zs511k8lgbjx6u8o51j

RUN npm run build

# Production stage
FROM node:18.19.1-alpine3.19

WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/build ./build

EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000", "--no-clipboard"] 