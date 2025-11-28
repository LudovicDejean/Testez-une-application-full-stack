# Test a full-stack application.


# Project Dependencies 

- maven
- java17+
- npm
- mysql

Be aware of cypress for the front-end it might need additional dependencies. [see](https://docs.cypress.io/app/get-started/install-cypress#Linux-Prerequisites) 

# Installation & Testing.

```bash
git clone https://github.com/Aleod-m/Testez-une-application-full-stack
```
## Setup the environnement

Ensure you have your mysql database created with the `ressources/sql/script.sql` with the user matching the credentials defined in the `application.yml`.

## Run the application

Start the back-end:
```bash
cd back && mvn spring-boot:run
```
Start the front-end:
```bash
cd front && npm run start
```

Got to [http://localhost:4200](http://localhost:4200)

The default credentials for the admin are:
- email: `yoga@studio.com`
- passsword: `test!1234`

## Running the tests.

### Back-end
```bash
cd back
```
Ensure your database is still running.

Run the back-end test: 
```bash
mvn clean test
```
Look at the test coverages: 
```bash
xdg-open target/site/jacoco/index.html
```

### Front-end
Before running the front-end end-to-end tests ensure the application is running:
```bash
cd front
```
Run the front-end tests:
```bash
npm run cypress:run
```
Look at the end-to-end test coverage:
```bash
npm run e2e:coverage
```

Run the front-end unit tests:
```bash
npm run test
```
