# Twitter-demo

This app demostrates how to use several modern nodejs projects to quickly prototype a simple web application.

### TODO:
There is so much that needs to be done that is not even funny :)

- better angularjs routing. There is no need to refresh the whole hero-unit whenever there is a route change

- have cheanges in angularjs' routes be better reflected in the expressjs routes. Eg.: if a user change the refresh rate to 1 min, then the express server app should push tweets updates once every minute. If a user changed to 5 sec, the push rate should reflect this change.

- At the right and left bar, the city and country counter should display the number of tweets per second from that particular location, this feature is currently not implemented.

- To keep the complexty low, currently all interactions with Redis is done within nodejs. However, to implement it in Lua and have this Lua script being run within Redis itself would improve performance and allow to better database management.

- Change the icons at the navbar to a more descriptive one.

- Add to new icons at the navbar. A preferences and a about icon and have the technologies used being displayed in the about icon. The preference icon would allow a user to configure the application behavior, things like how often the tweets "snapshots" should refresh and how many tweets should be displayed at a single digest cycle.



