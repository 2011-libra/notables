# About

This software-as-a-service application allows guest users to write, import, and export Markdown files with a toolbar interface. It also allows users to execute Node.js code blocks from directly within the rendered Markdown file. User code is containerized by Docker and VM2 for security on the server side.

Feel free to fork, test, develop, and share!

# Usage

## Features

- Clean, toolbar-based interface for users unfamiliar with Markdown format.
- Rendered text is exported into Markdown using `markdown-it`. (Note that if the user enters input directly in Markdown format, it will be treated as static text and not rendered.)
- Users can drag-and-drop Markdown files into the editor for revision.
- Executable code blocks can be added using the button on the far right of the toolbar. Once Node-compatible JavaScript code is in the block, it can be executed by clicking the "run" button.

## Installation

These steps are only necessary when installing or updating Notables on the server.

1. **Node.** The server code is compatible with Node 10 and up.

2. **Docker.** Be sure that Docker is installed and running on the server. (On a Mac, [Docker Desktop](https://www.docker.com/products/docker-desktop) should be installed and running.) You can test this by checking that the command `docker run hello-world` successfully executes. It is not necessary to create or log in to a Docker Hub account for the server to run. You will need to create a custom image for the Docker containers:

```
npm run docker
```

3. **Dependencies.** Install the NPM dependencies:

```
npm install
```

## Running the server

Start the server with

```
npm run start
```

Users can now navigate to the server on port 8080 using a browser. The landing page includes instructions on how to use the application from the client side.

# Development

If you wish to fork and develop this repository, the development environment can be started with `npm run start-dev`.

# Acknowledgements

- The approach to server security used here is based on an article by [Tim Nolet](https://www.freecodecamp.org/news/running-untrusted-javascript-as-a-saas-is-hard-this-is-how-i-tamed-the-demons-973870f76e1c/).

- The inspiration to building our own WYSIWYG came from [Freedom Evenden](https://medium.com/javascript-in-plain-english/how-to-create-a-wysiwyg-text-editor-from-scratch-in-reactjs-710f9ebfa665)

# Authors

- Brad Gersh ([GitHub](https://github.com/bradley-gersh))
- Jonathan Hualoto ([GitHub](https://github.com/JHualoto))
- Matthew Leng ([GitHub](https://github.com/Mleng89))
- Vincent Pang ([GitHub](https://github.com/dev-vp))

Please contact us with any questions, comments, or feedback. Thank you!
