# Usage

## Before the first run
1. Be sure that Docker is installed and running on the server. (On a Mac, [Docker Desktop](https://www.docker.com/products/docker-desktop) should be installed and running.) The `node:12-alpine` Docker image needs to be locally available, which can be done with `docker pull node:12-alpine` or

  ```
  npm run docker
  ```

2. Install the NPM dependencies

  ```
  npm install
  ```

## Running the server

Start the server with

```
npm run start
```

Users can now navigate to `localhost:8080` using a browser.
