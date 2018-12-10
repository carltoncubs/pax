# Cub Sign In Frontend

This is the frontend for the web app we use for tracking attendance at
cub nights.

At the start and end of each night the cubs sign in and out using this
application. All the information is written to a Google Sheet so we
can keep track of attendance.

# Testing

For unit tests we use Jest. These can be run using `npm test`. For
integration testing, we use selenium and a dummy server to record
requests made to it. Thanks to
[BrowserStack](https://www.browserstack.com/) we can easily test on
multiple platforms.

![BrowserStack logo](/images/Browserstack-logo.svg)
