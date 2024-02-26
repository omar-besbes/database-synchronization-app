FROM node:18 as build

# OFFICE_TYPE: branch | head
ARG OFFICE_TYPE
ENV OFFICE_TYPE=${OFFICE_TYPE:?}

# Set working directory
WORKDIR /app

# Copy source code in container
COPY apps apps
COPY libs libs
COPY *.json .
COPY .yarnrc.yml .yarnrc.yml
COPY yarn.lock yarn.lock

# Use the correct version of the package manager
RUN corepack enable

# Install dependencies
RUN yarn

# Build the app
RUN yarn build ${OFFICE_TYPE}

FROM node:18

ARG OFFICE_TYPE

# Set working directory
WORKDIR /app

COPY --from=build /app/dist dist
COPY --from=build /app/node_modules node_modules

# To avoid
RUN ln -vs dist/apps/${OFFICE_TYPE}/main.js main.js

CMD ["node", "main.js"]
