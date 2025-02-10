#!/bin/bash
git stash --include-untracked

# Check for merge conflicts before proceeding
if git pull | grep -q "CONFLICT"; then
    echo "Merge conflict detected! Please resolve conflicts manually."
    git stash pop
    exit 1
fi

git stash pop
docker stop blog-api web || true
docker rm blog-api web || true

docker rmi blog web || true

cd backend
if ! docker build -t blog .; then
    echo "Failed to build backend image"
    exit 1
fi

if ! docker run -d --restart unless-stopped --name blog-api -p 5001:5001 -v /home/karun/git/blog/backend/BlogApi.API/BlogApiFiles:/app/BlogApiFiles blog; then
    echo "Failed to start backend container"
    exit 1
fi

cd ../web
if ! docker build -t web .; then
    echo "Failed to build frontend image" 
    exit 1
fi

if ! docker run -d --restart unless-stopped --name web -p 3000:3000 web; then
    echo "Failed to start frontend container"
    exit 1
fi