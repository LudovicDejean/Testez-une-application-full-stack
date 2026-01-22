# Test a full-stack application.


# Project Dependencies 

- maven
- java17+
- npm
- mysql

Be aware of cypress for the front-end it might need additional dependencies. [see](https://docs.cypress.io/app/get-started/install-cypress#Linux-Prerequisites) 

# Installation & Testing.

```bash
git clone https://github.com/LudovicDejean/Testez-une-application-full-stack.git
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
Testez-une-application-full-stack\back\target\site\jacoco
```
![alt text](https://raw.githubusercontent.com/LudovicDejean/Testez-une-application-full-stack/refs/heads/main/ressources/readme/back_coverage.png)

### Front-end
Before running the front-end end-to-end tests ensure the application is running:
```bash
cd front
```
Run the front-end tests:
```bash
npm run cypress:run
```

Run the front-end unit tests:
```bash
npm run test
```

Look at the front-end test coverage:
```bash
npm run test -- --coverage
```
![alt text](https://raw.githubusercontent.com/LudovicDejean/Testez-une-application-full-stack/refs/heads/main/ressources/readme/front_coverage.png)

Look at the end-to-end test coverage:
```bash
npm run e2e:coverage
```
![alt text](https://raw.githubusercontent.com/LudovicDejean/Testez-une-application-full-stack/refs/heads/main/ressources/readme/e2e_coverage.png)
