
## Description

  <p><a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable backend server-side applications.</p>
  <p><a href="https://nestjs.com/" target="_blank">NestJs</a> framework for building backend.</p>



## Installation from zero

Install Visual Studio Code

Install extension: ES7+ React/Redux/React-Native snippets

Install Node.js version LTS 

```bash
node -v
v16.16.0
npm -v
npm WARN config global `--global`, `--local` are deprecated. Use `--location=global` instead.
8.11.0
npx -v
npm WARN config global `--global`, `--local` are deprecated. Use `--location=global` instead.
8.11.0
```

Install Git from https://git-scm.com/
```bash
git --version
git version 2.37.1.windows.1
```
Clone repo, by example:

```bash
git clone https://github.com/dariopalminio/daro-web-app.git
```

Install MongoDB in local machine Version 5.0.10-rc0 from https://www.mongodb.com/try/download/community

Configure MongoDB PATH

- Server: C:\Program Files\MongoDB\Server\6.0\bin\mongod
- Client: C:\Program Files\MongoDB\Server\6.0\bin\mongo
- Data: C:\Program Files\MongoDB\Server\6.0\data\

Start Data Base Server 

export PATH=/Users/dariopalminio/Applications/mongodb-macos-x86_64-4.4.6/bin:$PATH
mongod --dbpath /Users/dariopalminio/data/db

Install Keycloak 13.0.1 from https://www.keycloak.org/archive/downloads-13.0.1.html

Because Keycloak uses Java, then install JDK from https://jdk.java.net/

Configure environment var JAVA_HOME and PATH
```bash
javac -version
javac 17
```

Configure Keycloak PATH and execute 
```bash
standalone.bat
```

Start Keycloak Server in http://127.0.0.1:8080/auth/ 

Server running and go to http://localhost:8080/auth/ 

Create admin user with admin pass in Keykloak

Login as admin

Create Realm  with name: my-realm-test

Create Client with name:	rest-client-test

Copy client ID (example: d1dd32a1-1e54-4f8f-96d3-18c7a8466408)

Configure .env with Keycloak variables

Install NestJS as global

```bash
sudo npm i -g @nestjs/cli
nest new daro-web-shop-backend
npm install dotenv
npm install nodemailer
npm i --save-dev @types/nodemailer
npm i @types/nodemailer-smtp-transport --save
```

## Installation

```bash
$ npm install
```

## Run

Start Mongo Data Base Server 

export PATH=/Users/dariopalminio/Applications/mongodb-macos-x86_64-4.4.6/bin:$PATH
mongod --dbpath /Users/dariopalminio/data/db

Start Keycloak Server 

cd Applications/keycloak-13.0.1/bin
sh standalone.sh
http://127.0.0.1:8080/auth/
admin admin

Start cliente http://localhost:3000/



```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
