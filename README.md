# Cub Sign In Frontend

[![BrowserStack Status](https://www.browserstack.com/automate/badge.svg?badge_key=<badge_key>)](https://www.browserstack.com/automate/public-build/bVBHZm0rQ3hoR2FrTkFPenhpTnllSWk2QVNhNGJqR204YXlFQ1ZmTnVrVT0tLWRTZlN1MTVaSDRsckJnVXlpbVh1K1E9PQ==--c6501519dd6c9bb9835010ffdf9def4955b9b666)

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
