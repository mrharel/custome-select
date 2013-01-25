custome-select
==============

jquery plugin for custom select elements

##Test Page
http://www.amirharel.com/labs/custom-select/

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
* **options** {Array} (optional) in case the initialization is on a container element this array specify the options we need to create. this is an array of strings containing html string for each option
* **attr** {Array} (optional) in case the initialization is on a container element this array specify the attributes that the option element should have. this is an array of objects where each object isa dictionary where keys are the attribute names and the values are the values to set to each attribute
* **selectedContentCallback** {Function} callback when the custom select needs to render the selected option after the dropdown is closed. this allows you to change the html that we render in the closed select from the html we use to render the option. the method gets 3 parametr: str, index and attr like all other relevant calbacks.

Example
```
//selecting a select element and making it a custom select
$("select").customSelect({
    //callback for change event
    change : function(str,index,attr){
        $(".box1 .selected").html(str);
    },
    //callback to set the html for each option
    optionContentCallback: function(str,index,attr){
        console.log(str,index,attr);
        if( attr["data-name"] ){
            str = str.replace( attr["data-name"] , "<span class='highlight' style='color:"+attr["data-color"]+";'>"+attr["data-name"]+"</span>");
        }
        return str;
    },
    //setting the 3rd element to be selected
    selected: 2,
    //setting minimum width for the dropdown
    dropdownWidth: 250
});
```
####getSelected
This method gets the current selected option. Unlike a real select element, this metho return an object containing the html, the index and the attributes of the selected element.
```
var selectedData = $(".custome-select").customSelect("getSelected");
var html = selectedData.str;
var index = selectedData.index;
var attr = selectedData.attr;
for( var key in attr ){
    console.log(key+"="+attr[key]);
}
```
####getSelectedIndex
This method return the current element index
```
var selectedIndex = $(".custome-select").customSelect("getSelectedIndex");
```
