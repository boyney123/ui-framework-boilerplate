var express = require('express');
var app = express();
var fs = require('fs');

var componentPaths = [];
var currentComponentIndex = 0;

var componentHTML = [];

//TODO:
/**
	1. strip out unused css
		1a) Outomate this process rather than hardcoded?
	2. make sure elements have prefix
		2a. maybe config file in each dir
	3. make sure no global elements are styled
	4. Order items to be displayed?
	5. Sub groups?
	6. Delete area where the shiz gets injected every time
	7. Move node file stuff to grunt?? Why do it on node....
**/

clearComponentArea = function(_callback){
	fs.readFile('./app/index.html', 'utf8', function (err,file) {
		var startIndex = file.indexOf("<!--fw-comp-start-->") + 20;
		var endIndex = file.indexOf("<!--fw-comp-end-->");
		var output = file.slice(0, startIndex) + file.slice(endIndex, file.length);
		fs.writeFile('./app/index.html', output, 'utf8', function (err) {
			if (err) return console.log(err);
			_callback.call();
		});
	});
}

addComponentsToIndex = function(){
	fs.readFile('./app/index.html', 'utf8', function (err,file) {

		var startIndex = file.indexOf("<!--fw-comp-start-->") + 20;

		var output = file.substr(0, startIndex) + componentHTML.join("") + file.substr(startIndex);

		fs.writeFile('./app/index.html', output, 'utf8', function (err) {
		 if (err) return console.log(err);
		});
	});
};


parseHtmlComponent = function(path){
	fs.readFile(path, 'utf-8', function(err, contents) { 
		var elementToExtract = "<body>";
		var startIndex = contents.indexOf(elementToExtract) + elementToExtract.length;
		var endIndex = contents.indexOf(elementToExtract.replace("<", "</"))
		var component = "\n\t<div class='component-wrapper'>" + contents.slice(startIndex, endIndex) + "\t</div>\n\t";
		componentHTML.push(component);
		currentComponentIndex++;
		parseComponent();
	});
}

parseComponent = function(){
	//due to async behaviour have to do files 1 by 1
	if(currentComponentIndex < componentPaths.length){
		fs.readdir(componentPaths[currentComponentIndex], function(err, files) {
			files.filter(function(file) { return file.substr(-5) == '.html' })
			this.parseHtmlComponent(componentPaths[currentComponentIndex] + files[0]);
		});
	}
	else{
		//all components are done. Add them to main index file
		this.addComponentsToIndex();
	}
};


//clear the file
clearComponentArea(function(){
	//file cleared now add components

	fs.readdir('./app/components/', function(err, folders) {

		totalComponents = folders.length;

		//loop through all components
		folders.forEach(function(component) { 
			var pathToComponent = './app/components/' + component +"/";
			componentPaths.push(pathToComponent);
	    });
	    parseComponent();

});
})


app.get('/', function (req, res) {
    res.sendfile('./app/index.html');
});


app.listen(3000);