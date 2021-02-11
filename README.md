# Usage

## Before the first run
1. ~~**Installing the database.** This project uses MySQL for the database, which will need to be installed separately.~~
  ~~* If you are using Homebrew for Mac, you can run `brew install mysql`, then `mysql.server start` to start the server.~~
 ~~* If you are using Macports, run `port install mysql8-server`, then `sudo port load mysql8-server` to start the server.~~
  
  ~~When MySQL installs, it gives you a temporary password to use for the root user. Note this down for the first time you run `mysql -u root -p`.~~
  
  ~~Confirm that MySQL is available for connections on port 3306. To do this, log in to MySQL (`mysql -u root -p`), and run `SHOW VARIABLES LIKE 'port'`. If `port` has value 3306, the connection will work. If `port` is set to 0, you may need to edit your my.conf file to ensure that networking is on; see details [here](https://trac.macports.org/wiki/howto/MySQL). If you are using Macports, ensure that `/opt/local/etc/mysql8/my.cnf/` includes a line that says `[mysqld]` and, below it, `skip-networking=OFF`.~~

  
2. ~~**Connecting to the database.** For testing purposes at the present, this project connects to your MySQL database through a `guest` account that you will need to set up. Log in to MySQL as an administrator (`mysql -u root -p`) then add a guest user with full access(!) for now:~~

Disregard for now:
```
CREATE USER 'guest'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON * . * TO 'newuser'@'localhost';
FLUSH PRIVILEGES;
```

~~It should now be possible to log in to MySQL via `mysql -u guest -p` with password `password`. (This will be secured using an environment variable soon, and the privileges to the account will be more restricted to only the tables we need to access.)~~

3. **Docker.** Be sure that Docker is installed and running on the server. (On a Mac, [Docker Desktop](https://www.docker.com/products/docker-desktop) should be installed and running.) The `node:12-alpine` Docker image needs to be locally available, which can be done with `docker pull node:12-alpine` or

  ```
  npm run docker
  ```

4. **Dependencies.** Install the NPM dependencies

  ```
  npm install
  ```

## Running the server

Start the server with

```
npm run start
```

Users can now navigate to `localhost:8080` using a browser.

# Authors
- Brad Gersh [GitHub](https://github.com/bradley-gersh)
- Jonathan Hualoto [GitHub](https://github.com/JHualoto)
- Matthew Leng [GitHub](https://github.com/Mleng89)
- Vincent Pang [GitHub](https://github.com/dev-vp)
