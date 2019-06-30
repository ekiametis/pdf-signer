# Base Image
FROM loyaltyone/docker-alpine-java-node:jre-8-node-8

# Environments
ENV APP="/opt/api"
ENV PATH=$APP:$PATH 

# Create directories, user and grant permission
RUN mkdir -p $APP
RUN mkdir -p $APP/tmp

# Select entire directory
WORKDIR $APP

# Copy sources
COPY api "$APP"/api
COPY conf "$APP"/conf
COPY jsignpdf "$APP"/jsignpdf
COPY package.json "$APP"/
COPY package-lock.json "$APP"/
COPY app.js "$APP"/

# Install dependencies and list sources
RUN npm install --production

CMD [ "npm", "start" ]