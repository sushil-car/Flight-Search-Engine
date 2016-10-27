# FlightSearchEngine

Author: Sushi Adokar

This is a basic flight search engine application using technologies such as AngularJS, NodeJS, Express.

Following are the tools, needed to install the application dependencies:
1) Node (Download and install from nodejs site)
2) npm (It will get install automatically along with Node)
3) Ensure git is installed or you can download from https://git-scm.com/download
4) bower (npm install bower)

Use below command to install node dependencies

npm install

Go to ng folder and install bower dependencies using below command:

bower install

Now, use below command to run your server:

node server.js or node start

use localhost:3000, to test the flight application.

You can now search for the available flights, Enjoy... :)

------------------------------------------------------------------------------------------------------

Test Cases:

I have created sample JSON data accordingly. Following tests can be performed on the App.

1)Input values as:
    Departure Date = 30 Oct 2016
    Return Date = 30 Oct 2016 
	Origin: Delhi 
	Destination: Pune

Result: This will show the depart and returning flights

2)Input values as:
    Departure Date = 11 Nov 2016
    Return Date = 11 Nov 2016 
	Origin: Delhi 
	Destination: Pune

Result: Only depart flights are available i.e. no return flight

3)Input values as:
    Departure Date = 11 Nov 2016
    Return Date = 11 Nov 2016 
	Origin: Pune 
	Destination: Delhi

Result: Only return flights are available i.e. no flight from Pune to Delhi

One calso test theapp by easily adding data to data.JSON file

Thanks