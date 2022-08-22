# FRONT END
![](../../Documentation/screenshots/UX-Web-CityResults.png)

## Introduction
The `frontend` folder contains the files for the Node.js and React project. The design files used to outline page flow can be found in the documentation folder. The front end consits of 4 main pages and the interactive flows that follow from them for registering or selecting and booking. Page previews can be seen below. 

## Page Flow

*FRONTEND*
    ↳ [Home](#Home-Page)
    ↳ [Login](#Login)
    ↳ [Login](#Register)
    ↳ [SearchForHealer](#Search-For-Healer)
      ↳ [ViewHealer](#View-Healer)
      ↳ [ViewHealerCalendar](#View-healer-Calendar)
      ↳ [BookWithHealer](#Pay-healer)


## Setup 
1) npm install
2) npm start
3) go to localhost 4200 

NOTE: Frontend and Backend must not be on the same port. If you start the backend first, ensure it is on any port but localhost:3000. 

## To Do
1) Website is not currently mobile friendly
2) Booking API not connected to the frontend
3) Payment API not connected to the frontend
4) Secure state for logged in users not built

## Testing

### Github Actions
The project repository will handle pushes and perform automated tests. For this to work, a port other than 8080 needed to be used for the docker container created in the action. 

### Cypress
The Cypress testing suite runs as E2E (end to end) tests, working through the UI to perform changes to the backend. Cypress GUI can be started from [App/Frontend/] by issuing the command `npx cypress open`, or run headlessly in the terminal with `npx cypress run`. Cypress will indicate which tests pass/fail and is simple to start to write custom tests by referencing the cypress documentation (https://docs.cypress.io/api/table-of-contents)

## Page Preview

### Home Page
**COMPLETE:** Where the user lands on the site. Designed to be friendly and simple. There is room to add an about us page on the navbar or dynamically scrolling down on the homepage to reveal details about the platform. 
![](../../Documentation/screenshots/home.png)

### Login
**COMPLETE:** Allows the user to enter their password and email to login to the platform. The login page for admin, clients, and healers is all the same. The backend dynamically handles navigating them to the appropriate next page, and controlling their access and view of the platform. 
![](../../Documentation/screenshots/UX-WEB-Login.png)

### Search For Healer
**COMPLETE:** Accesible without loging in. Users browser's IP location can be used if availible to find healers near them. Otherwise, the default city of Victoria is selected. Users can use dropdowns to select a new region to browse for healers in. Healers details are displayed in a column on the left. Their approximate location is show on a google map on the right. *the calendar and booking apis are not connected*

### View healer
*The healer profile modal is what users are shown once they click on a healer'*

### View healer Calendar
*The calendar modal to book with pops up when the user selects the booking option on the healer profile'*
