# Evidence

* Please read screenshots folder in Github.
* All related backend is configured in client, please run local to test.

# How to run the application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

## Frontend

To run a client application first edit the `client/src/config.ts` file to set correct parameters. And then run the following commands:

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless Diary application.

# Functionality of the application


# Evidence collection

An alternative way to test your API, you can use the Postman collection that contains sample requests. You can find a Postman collection in this project. To import this collection, do the following.

Click on the import button:

![Alt text](images/1.png?raw=true "Image 1")


Click on the "Choose Files":

![Alt text](images/2.png?raw=true "Image 2")


Select a file to import:

![Alt text](images/3.png?raw=true "Image 3")


Right click on the imported collection to set variables for the collection:

![Alt text](images/4.png?raw=true "Image 4")

Provide variables for the collection (similarly to how this was done in the course):

![Alt text](images/5.png?raw=true "Image 5")
