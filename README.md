## Inspiration

The inspiration for this application was a meme on a West Coast Swing group on Facebook 

The Meme's title: "How all-star dancers go to so many events"

Meme picture: A view from the back of an SUV, whose rear seats are replaced with a bed and a dressed, suggesting that the occupants sleep in their car.

These were real comments people made under that meme, and what inspired the creation of this site

- Honestly, if I could be a nomad going from event to event every weekend, I'd be down
- As long as I can borrow a shower at an event, this wouldnt be half bad 😆🚿
- That’s a 3rd Gen. Honda Odyssey (2005-2010), in case anyone’s curious. Very reliable, can be had fairly cheaply private party.
The Mk VI Volkswagen Jetta Sportwagens are also a great option for car camping. The 2.5L engine is very reliable.
- Ya ive done this rather than pay for a hotel room for the weekend. Lol
- I’ve been thinking more and more about car camping for events. Provided weather is not too hot/cold. 🤷🏻‍♀️
- This gave me another idea for housing at Liberty Swing (Picture of a 1994 GMC Vandura G2500 being sold for $6000)

Based on these comments, we can extract an initial set of principles this project should follow

Primary goal:
Allow travelling dancers to connect with resources to aid with a nomadic lifestyle

How I think this app can help
- Travelling dancers will add anonymized information related to their travel plans. Other users on an app like Facebook can offer to help these dancers

Other principles I think are necessary
1) Privacy - users don't specify names, instead get a two word identifier when adding a pin to the map (similar to the Docker engine's container names)
2) Chain of trust - A Facebook group is associated with this app, and the network of mutual friends that dancers have is extensive. Its very likely that you both know someone that can vouch for you both.

Other concerns
1) Tragedy of the commons - can be alleviated by increasing communication between everyone using the app, and increasing trust between parties
2) Bad actors/trolls - we will address this if the app gets popular enough to attract bad actors that for some reason want to distrupt this. Will likely need to add an authentication mechanism and denial of service attack prevention.

## Why travel by car instead of flight

Flights, hotels and rental cars can be expensive. As dancers, we have an extensive network of friends and mutual friends across the world.

We can leverage this network of trusted connections that you don't often find in other communities. Because there are so many dance styles, and some people attend mroe than one, its highly likely that you'll have some dancers (e.g. lindy hop) at their home scene, while others are travelling to their scene (WCS)

Just make sure to bridge the divide with memes beforehand so that there's no animosity between groups.


## Setup
Get dependencies:
go get .
go mod tidy

## Requirements/solutioning

### Pass 1:
- Backend
Backend API server in Go, that has no authentication/authorization that lets any client create, read, update and delete map marker objects.

Map markers in this application are a point on a map, centered on the city the user is interested in. The list of cities is obtained from the "Simple Maps" database: https://simplemaps.com/data/us-cities, where the list of cities is filtered to only those cities who population is over 5000

This ensures that users aren't able to provide sensitive information that could let people identify vulnerable people that might be far from home.

- Frontend
Plain HTML, JS and CSS. fetch API makes network requests. 
Open Street map for the map https://www.openstreetmap.org/

Each marker is clickable, and displays the city name, anonymized identifier, date range, 

The anonymized name is the exact code used in the names-generator.go package used in Docker:
https://github.com/moby/moby/blob/39f7b2b6d0156811d9683c6cb0743118ae516a11/pkg/namesgenerator/names-generator.go#L852-L863

Users will create markers, and would wait for someone on the facebook page to make a comment indicating that they are able to help them out. The user corresponding to that anonymous name will reach out to the person offering assistance.
Both parties will verify trust by talking to their mutual friends who can vouch that they have seen them at dance events and can be trusted. Once this trust is established, they can make plans over Facebook or any other platform they prefer

- Database
Sqlite will be used

- Deployment
Deployed on Docker, with the sqlite folder math mounted as a persistent volume
Nginx acts as reverse proxy to the go container, and serves static files associated with frontend

TODO:
- Timezone and time handling
The timezone used should correspond to the timezone of the location travellers will be in. The backend can skip timezone information since we are specifying location separately. Potential hosts might have an issue if they're examining dates from the frontend and Javascript is performing the time filtering. The new temporal API should help ease this, but its still experimental. The main issue is that the Javascript Date object doesn't have the concept of wall clock time or calendar date because Javascript has no concept of "no time zone"
For example, most festival sites say their first dance is at Friday 6PM, and the final dance ends on Sunday at 11:30PM. The timezone used will be the timezone that the festival is located in. Travellers will likely enter a Start Date of Thursday or Friday, based on when they expect to arrive to the festival, and and end date of Monday in this accommodation app.
They shouldn't need to specify explicitly what time on Thursday or Friday they arrive at, and our application's filter shouldn't be concerned with looking up the exact time or time zone of arrival and departure either.

For now though, the backend uses RFC3339 to handle dates, but this will need to be changed to calendar dates instead