# o-comments-core

JavaScript module which incorporates helpers to load the Livefyre widget using SUDS. It is basically a bridge between Livefyre and FT, and also a wrapper around basic Livefyre functions which are handled in an FT way.

## How to use it
The module can be used as standalone using the 'commentscore' variable.

If you use it as a bower dependency, it can be used the following way:

```javascript
var commentsCore = require('o-comments-core');
```

## API
The main fields that are exposed are the following:

### init
This method is responsible for the configuration used by the module. Calling this method with an object will merge the default configuration with the object specified.

### Widget
Widget can be used to load a Livefyre widget on the page. It is responsible to talk with SUDS, load Livefyre core resources, load an LF widget on the page and handle Livefyre events.

##### Configuration
To create an instance, you need to provide a configuration object. This should have the following structure:

###### Mandatory fields:
 - elId: ID of the HTML element in which the widget should be loaded
 - articleId: ID of the article, any string
 - url: canonical URL of the page
 - title: Title of the page
 - <strong>user</strong>: User object which has the following utilities:
    + isLoggedIn: function which returns true or false based on the user's logged in status
    + getSession: function which returns the user's session if he's logged in
    + getUserId: function
    + getEmail: function
    
###### Optional fields:
 - stream_type: livecomments, livechat, liveblog
 - initExtension: object which contains key-value pairs which should be added to the init object
 - stringOverrides: key-value pairs which override default LF strings

##### Methods
###### load
The only method that can be called is 'load'. This method will initiate loading Livefyre core resources, getting the necessary information from SUDS, and loading the widget on its place specified.

This method can be called once (calling it multiple types will have no effect).

### Auth
Creates Livefyre RemoteAuthDelegate, also provides login and logout into Livefyre.
See http://docs.livefyre.com/developers/user-auth/remote-profiles/#BuildingAuthDelegate

### cache
Provides caching options for the data received from SUDS (init, auth, settings).
It also provides validation based on the user's identity and expiry time of the tokens.

### initObjLoader
This is a wrapper around Suds' init endpoint, but incorporating a cache layer as well.
The only method is 'init'. Calling this method will result in the response of o-suds.endpoints.livefyre.user, but the call is not made if there is valid data in the cache.

##### Configuration
###### Mandatory fields:
   - elId: ID of the HTML element in which the widget should be loaded
   - articleId: ID of the article, any string
   - url: canonical URL of the page
   - title: Title of the page
   - user: User object which has the following utilities:
       + isLoggedIn: function which returns true or false based on the user's logged in status
       + getSession: function which returns the user's session if he's logged in
       + getUserId: function
       + getEmail: function

###### Optional fields:
   - stream_type: livecomments, livechat, liveblog
   - force: if true, cache content is ignored

### resourceLoader
This is responsible for loading Livefyre's core JS libraries, and it also provides a helper to load CSS override.

Methods:
- loadLivefyreCore
- loadCssOverrides

### i18n
It exposes the following objects:
##### lfStringOverride
Contains FT preferred string overrides for the default Livefyre Comments widget.
##### messages
Contains several custom messages, e.g. error messages


### utils
Contains helper functions.

Methods that are available:
##### emptyLivefyreActionQueue
Livefyre creates a queue in localStorage when a user posts a comment without being logged in. This method clears the queue.
##### isPermalinkPresent
Detects if the URL is a Livefyre permalink.
##### cloneObject
Deferences a plain Object and returns a deep copy (same content with different references).

### enableLogging
This method enables logging of the module. It logs using the global 'console' if available (if not, nothing happens).

### disableLogging
This method disables logging of the module.

### setLoggingLevel
This method sets the logging level. This could be a number from 0 to 4 (where 0 is debug, 4 is error), or a string from the available methods of 'console' (debug, log, info, warn, error).
Default is 3 (warn).

## Default configuration

```javascript
{
    "livefyre": {
        "network": "ft.fyre.co",
        "domain": "ft.auth.fyre.co",
        "resourceDomainBase": "http://zor.livefyre.com"
    },
    "resourceUrls": {
        "livefyreJs": "/wjs/v3.0/javascripts/livefyre.js"
    },
    "cache": {
        "authName": "livefyre-ft-prod-authToken",
        "initBaseName": "livefyre-ft-prod-init-"
    }
}
```

## Change the environment
In order to change to the TEST environment, use this:

```javascript
var commentsCore = require('o-comments-core');
commentsCore.init({
    "dependencies": {
        "o-suds": {
            "baseUrl": "http://test.session-user-data.webservices.ft.com"
        }
    },
    "livefyre": {
        "network": "ft-int-0.fyre.co",
        "domain": "ft-int-0.auth.fyre.co",
        "resourceDomainBase": "http://zor.t402.livefyre.com"
    },
    "cache": {
        "authName": "livefyre-ft-test-authToken",
        "initBaseName": "livefyre-ft-test-init-"
    },
    "debug": true // only if you want to see console.log messages for debugging.
});
```