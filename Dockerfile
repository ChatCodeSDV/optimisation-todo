# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG NODE_VERSION=20.14.0

################################################################################
# Use node alpine image for base image for all stages.
FROM node:${NODE_VERSION}-alpine AS base

ARG PNPM_VERSION=10.10.0

# Set working directory for all build stages.
WORKDIR /usr/src/app

# Install pnpm.
RUN --mount=type=cache,target=/root/.npm \
    npm install -g pnpm@"${PNPM_VERSION}"

################################################################################
# Create a stage for installing production dependecies.
FROM base AS deps

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.local/share/pnpm/store to speed up subsequent builds.
# Leverage bind mounts to package.json and pnpm-lock.yaml to avoid having to copy them
# into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=pnpm-lock.yaml,target=pnpm-lock.yaml \
    --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --prod --frozen-lockfile

################################################################################
# Create a stage for building the application.
FROM deps AS build

# Download additional development dependencies before building, as some projects require
# "devDependencies" to be installed to build. If you don't need this, remove this step.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=pnpm-lock.yaml,target=pnpm-lock.yaml \
    --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# Copy the rest of the source files into the image.
COPY . .

# Run the build script.
RUN pnpm run build

# Rebuild better-sqlite3 native bindings in the build stage
RUN pnpm rebuild better-sqlite3

################################################################################
# Create a new stage to run the application with minimal runtime dependencies
# where the necessary files are copied from the build stage.
FROM base AS final

# Install pm2 globally
RUN npm install -g pm2

# Use production node environment by default.
ENV NODE_ENV=production

# Copy package.json so that package manager commands can be used.
COPY package.json .
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
# Copy the pm2 configuration file.
COPY --from=build /usr/src/app/ecosystem.config.js ./ecosystem.config.js

# Copy rebuilt better-sqlite3 native bindings from build stage
COPY --from=build /usr/src/app/node_modules/.pnpm/better-sqlite3@*/node_modules/better-sqlite3/build ./node_modules/.pnpm/better-sqlite3@11.10.0/node_modules/better-sqlite3/build

# Expose the ports that the application listens on.
# The number of ports exposed should match the number of PM2 instances defined by the "max" setting.
EXPOSE 3000-3009

# Do a ls to verify the contents of the current directory and the dist directory.
RUN ls -la ./ && ls -la ./dist

# Rebuild better-sqlite3 using pnpm
RUN pnpm rebuild better-sqlite3

# Run the application as a non-root user.
USER node

# Run the application.
CMD ["pnpm", "pm2:runtime"]
