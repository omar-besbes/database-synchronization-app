# office_type: branch | head
ARG office_type

FROM node:18

# Set working directory
RUN mkdir app
WORKDIR app

# Copy source code in container
COPY apps apps
COPY libs libs
COPY *.json .
COPY .yarn .yarn
COPY .yarnrc.yml .yarnrc.yml
COPY yarn.lock yarn.lock

# Use the correct version of the package manager
RUN corepack enable

# Install dependencies
RUN yarn

# Build the app
RUN yarn build $office_type

# Run the app
CMD ["yarn", "start", "$office_type"]
