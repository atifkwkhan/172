
//Init 
var Transform = require('stream').Transform;
var util	= require(	"util" );
var program = require('commander');
var util = require('util');
var fs = require('fs');
var text = fs.createReadStream('input-sensor.txt');


//other modules such as fs, commander, underscore etc are loaded
// For Node 0.8 users 

if (!Transform) {
 Transform = require('readable-stream/transform');
}

//Constructor logic includes Internal state logic. PatternMatch needs to consider it because it has to parse chunks that gets transformed

function PatternMatch(p) {
//Switching on object mode so when stream reads sensordata it emits single pattern match. 
	Transform.call(
	this, { 
	objectMode: true 
	}
	);
	
	this.pattern = p;
}

// Extend the Transform class.
// --
// NOTE: This only extends the class methods - not the internal properties. As such we
// have to make sure to call the Transform constructor(above). 

util.inherits(PatternMatch, Transform);
program
	.option('-p, --pattern <pattern>', 'Input Patterns such as . ,') 
	.parse(process.argv);

var patternStream = text.pipe(new PatternMatch(program.pattern)); 
patternStream.on(
	'readable', 
	 function() { 
		var line 
		while(null !== (line = this.read())){   
			console.log(line.toString('ascii')); 
		} 
	}); 
// Transform classes require that we implement a single method called _transform and
//optionally implement a method called _flush. You assignment will implement both.
PatternMatch.prototype._transform = function(chunk, encoding, getNextChunk) { 
	var data = chunk.toString('ascii'); 
	this.push("INPUT IS------------------------------------------------>"); 
	this.push(data); 
	
	var parse = data.split(this.pattern)
	parse.splice(parse.length-1, 1);

 	this.push("OUTPUT IS----------------------------------------------->"); 
	
	
	for(var i = 0; i < parse.length; i++){
	    var output='';
		
		if(i != parse.length - 1){
			if(i==0){
			output=("[ " + "'" + parse[i] + "'" + ",");
			}
			else{
			output=output+("'" + parse[i].slice(1) + "'" + ",");
			}
		}
		
		else{
			output=output+("'" + parse[i].slice(1) + "'" + " ]");
		}
		this.push(output);
	}
	getNextChunk();  
}

//After stream has been read and transformed, the _flush method is called. It is a great
//place to push values to output stream and clean up existing data
PatternMatch.prototype._flush = function(flushCompleted) {
console.log("Program Finished");
}
