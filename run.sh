#!/bin/bash

# Check if environment argument is provided
if [ "$1" != "development" ] && [ "$1" != "production" ]; then
    echo "Please specify environment: development or production"
    exit 1
fi

ENV=$1
IMAGE_SUFFIX="-$ENV"
CONTAINER_SUFFIX="-$ENV"

git fetch origin

if ! git diff-index --quiet HEAD --; then
    echo "Stashing local changes..."
    git stash --include-untracked
    STASHED=true
fi

if [ "$(git rev-list HEAD..origin/main --count)" != "0" ]; then
    if git pull | grep -q "CONFLICT"; then
        echo "Merge conflict detected! Please resolve conflicts manually."
        if [ "$STASHED" = true ]; then
            git stash pop
        fi
        exit 1
    fi
fi

if [ "$STASHED" = true ]; then
    git stash pop
fi

docker stop "blog-api$CONTAINER_SUFFIX" "web$CONTAINER_SUFFIX" || true
docker rm "blog-api$CONTAINER_SUFFIX" "web$CONTAINER_SUFFIX" || true

docker rmi "blog$IMAGE_SUFFIX" "web$IMAGE_SUFFIX" || true

cd backend
if ! docker build -t "blog$IMAGE_SUFFIX" --build-arg ENV=$ENV .; then
    echo "Failed to build backend image"
    exit 1
fi

if ! docker run -d --restart unless-stopped --name "blog-api$CONTAINER_SUFFIX" -p 5001:5001 -v /home/karun/git/blog/backend/BlogApi.API/BlogApiFiles:/app/BlogApiFiles "blog$IMAGE_SUFFIX"; then
    echo "Failed to start backend container"
    exit 1
fi

cd ../web
if ! docker build -t "web$IMAGE_SUFFIX" --build-arg ENV=$ENV .; then
    echo "Failed to build frontend image" 
    exit 1
fi

if ! docker run -d --restart unless-stopped --name "web$CONTAINER_SUFFIX" -p 3000:3000 "web$IMAGE_SUFFIX"; then
    echo "Failed to start frontend container"
    exit 1
fi