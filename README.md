custome-select
==============

jquery plugin for custom select elements

##Custom Select
This jquery plugin allows you to create a more fency select control. HTML specification doesn't allow OPTION tags to have nested tags, so there is no way to add a span for example inside of an OPTION to style it.
This is why this plugin was created - to allow developers to create a more advance select box. 

##Files
In ordert use this plugin you need to include the followings:
* jquery
* jquery-custom-select.js
* jquery-custom-select-white.css

##Initializing
There are two ways to initialize a custom select:

###Selecting Existing SELECT
In case you already have a select element and want to convert it to a custom select you can select it like so:
```
$("select").customSelect({...});
```
In this case the custome select will use the position, width, and hieght of the select to replace it. 

###Selecring Container
You can also just add some container element to hold the custom select:
```
$("#custom-select").customSelect({...});
```
The custom select will just use the container dimenssions to render it self.

###Methods
####customSelect
This is the main method to initilize and access the custom select.
When it is being used to initilize the custom select it take one parameter, which is the config object. The config object supports the following attributes:
* **change** {Function} (optional) callback function to be called when the selection has changed in the custom select. the callback will be called with the following parameters:
 * str {String} the inner html of the option that was selected
 * index {Number} the index of the selected option
 * attr {Object} any attributes this option has is being passed as a dictionary.
* **context** {Object} context object for the callback methods.
* **optionContentCallback** {Function} (optional) callback function that is being called when the custom select is trying to render it option elements. the callback shoud return a string which is the html that will be set to the option element. this give you the possibility to set whtever html you want inside of an option element. This method is being called for each option element and will get the following parameters:
 * str {String} the html content that is about to be set into the option element
 * index {Number} the index of the option
 * attr {Object} all the attributes that this option will have
* **selected** {Number} (optional)which option should be set as selected
* **dropdownWidth** {Number} (optional) in case you want you can set the drowpdown width
* **options** TBD...
