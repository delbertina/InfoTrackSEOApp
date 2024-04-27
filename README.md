# InfoTrackSEOApp
Frontend: React, Typescript, MUI

Backend: C# Asp.Net Web API, EF Core, SQLite

Made as a take home project during the interview process with the company **InfoTrack** .

I spent ~40 hours over the course of 2 weeks on the development of this project.
This project was the final round of the ~5 round interview process, but the company decided to respond with a generic rejection email.
The initial expectation was for the company to provide a completed backend of this project since the position was frontend focused, but that did not end up being the case.
I had to spend the majority of my time getting up to speed on C#, .NET, and EF Core to complete this project.

## Design Overview
When reading over the instructions it was clear that being able to keep track and review the history of previous searches.
I could see that making this solution able to track multiple different query & domain pairs would also greatly benefit the user.
Using Google Search Console is clearly the solution to this problem, but creating a browser extension would be a much better solution than a fullstack application.
With a browser extension, a button press could open the exact URL in the browser (wouldn't have the classes & ids obfuscated) and automatically display a lits of hits on the webpage itself.

In addition to those better solutions, could also redesigning the database to have a field for location & run the scrape endpoint as a script on multiple different servers around the world. The script would run via a CRON job every so often and report back the findings to the API. Then a more complicated graph with geolocation data & fetch results could display where in the US/world the domain is performing better in search result ranking. Then the frontend would purely be for viewing the data and creating searches without fetching new data.

## Frontend Overview

Home Page
- Displays a button that opens up the search select dialog
- Displays a list of recent fetches
- Clicking on a fetch goes to the details for the search for that fetch

![image](https://github.com/delbertina/InfoTrackSEOApp/assets/6349928/fa330dc7-0912-4ecf-9e81-c19b95c31817)

Details Page
- Displays similar info to the home page, but is filtered to only the current search
- Has a button to make a new fetch
- Displays a graph with placeholder data for fetch history
- Display info for search is also a button to bring up the search select dialog

![image](https://github.com/delbertina/InfoTrackSEOApp/assets/6349928/7bce9eb6-0ecc-45f3-acc7-e0bb8e0e4649)

Search Select Dialog
- Displays a list of existing searches to select
- Add new button for entering the details for a new search
- Either adding a new search or selecting & submitting an existing search navigates the user to that search's details page

![image](https://github.com/delbertina/InfoTrackSEOApp/assets/6349928/21b7f08c-808a-44a4-b8fe-5725250fb678)


Settings Page
- By default, the app only re-reads previously stored results of fetches
- This is because testing this over and over will look weird and get your IP throttled or blocked+

![image](https://github.com/delbertina/InfoTrackSEOApp/assets/6349928/98f4d061-2e37-4d1d-b2c8-cdeb9d9cce01)

## Backend Overview

Database
- Went with the database-first method for using EF Core
- Initially tried the model-first but that way was not very straight forward for my first solo .NET project

API
- This was my first .NET and actually writing the code parts wasn't much different than writing java or javascript
- I enjoyed the LINQ stuff and still think that way of doing things is much better than the javascript map, filter, etc array manipulation
- I also greatly enjoyed getting to dive deep into RegEx. It's always a fun time when I get to use my RegEx skills
- I made full CRUD endpoints for every object for completeness even though I wasn't planning on making use of most of them in the frontend


## Future Work
I spent a lot of time on this project and feel like I've reached a good stopping point, but there's still a lot of things I would add/change if I could invest more time in this. This is a project that could have easily grown to consume many more weeks of my free time, but at some point it has to be good enough.

### Testing
Rather than spend a little time to add some quick superficial unit test, I decided to spend the time to add the proof of concept graph on the search details page. Since this was my first solo .NET project, I would need to invest some time to get aquainted with how to do the initial setup for tests specifically in this language & framework. Still, this would be the first thing I would spend more time on improving.

### Frontend API Handling
Error toasts, loading indicators (stuff loads too fast to really need this at the moment), and a more unified place for the API calls to live would all benefit the user when the app has to communicate with the API. After adding a comprehensive test suite, this would be the next thing I would add & improve about the application.

### API Paginate & Sort List Endpoints
This isnt so much an issue with the solution at it's current state, but it could easily slow down the app once there's hundreds of searches and thousands of fetches and millions of hits. Having the fetches & searches being sorted by most recent & paginated to return say a maximum of 25 would prevent this from ever being a problem. Then the frontend components could be updated to have "infinite scroll" functionality to automatically fetch the next page & remove previous pages from the dom to prevent the app from using excessive resources.

### Frontend tooltips
There's a few different places where I think the application could benefit from adding tooltips to give more information to the user about a button or field. It's a minor change, but not as high priority as other items.

### New Search Field RegEx Validation
Take the time to setup field validation to give the user a quicker error when their input isn't going to be validated OK by the API.
