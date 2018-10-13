// This Node.js file generates the build and documentation files of the project.
// To properly run this code, you need to install Node.js and the uglify-js 
// packages.
//
// To install the Nodejs packages, remember that you can do so either locally 
// (with the command "npm install {ModuleName}") or, preferably globally 
// (with the commands "npm install -g {ModuleName}" and "npm link {ModuleName}")

 /* jshint  esversion: 6 */
// use strict

// ---------------------------------------------------------- REQUIRED PACKAGES
var fs = require('fs');						// File System access
var path = require("path");					// File Path handling
var process = require("process");			// Controls the process
var exec = require("child_process").exec;	// Command execution


// ----------------------------------------------------------- GLOBAL VARIABLES
// The paths to files and folders
var projectRootPath =  path.resolve(__dirname, '..\\..\\') + "\\",
	sourcesFolderPath = path.resolve(projectRootPath, 'Sources\\'),
	buildsFolderPath =  path.resolve(projectRootPath,'Builds\\'),
	librariesFolderPath = path.resolve(projectRootPath, 'Libraries\\'),
	transpiledCodeFileName =  'openuix.threejs.js',
	transpiledMapFileName = transpiledCodeFileName + '.map',
	minifiedCodeFileName = 'openuix.threejs.min.js',
	minifiedMapFileName = minifiedCodeFileName + '.map',
	minifiedDebugFileName = 'openuix.threejs.dbg.js',
	bundleFileName = 'openuix.threejs.bundle.js',
	threejsFileName = 'three.min.js';
var transpiledCodeFilePath =  path.resolve(buildsFolderPath, transpiledCodeFileName),
	transpiledMapFilePath =  path.resolve(buildsFolderPath, transpiledMapFileName),
	minifiedCodeFilePath = path.resolve(buildsFolderPath, minifiedCodeFileName),
	minifiedMapFilePath = path.resolve(buildsFolderPath, minifiedMapFileName),
	debugFilePath = path.resolve(buildsFolderPath, minifiedDebugFileName),
	bundleFilePath = path.resolve(buildsFolderPath, bundleFileName),
	threejsFilePath = path.resolve(librariesFolderPath, threejsFileName);

// Create variables for task management
var tasks = []; var taskIndex = -1; 

// ----------------------------------------------------------- GLOBAL FUNCTIONS

function executeCommand(command, options) {
	// console.log("Command: " + command);
	exec(command, options, function (error,stdout,stderr) {

		// Display output
		if(stdout && !stdout.startsWith("INFO:")) console.log(stdout);
		if(stderr && !stderr.startsWith("INFO:")) console.error(stderr);
		if (error) { console.log("Build stopped (" + error + ")"); return; }
		
		// Execute the next task
		if (taskIndex < tasks.length- 1) { build(++taskIndex); }
		else console.log("Build completed");
	});
}

/** Build */
function build(taskNumber = 0) {
	taskIndex = taskNumber;
	var task = tasks[taskIndex];
	var encoding = {encoding: "utf8"};
	console.log(task + " started...");
	switch (task)
	{
		case "Cleaning":
			try{
				fs.readdir(buildsFolderPath, (err, files) => {	
					if (err) throw err;
					for (var file of files) {
						fs.unlink(path.join(buildsFolderPath, file), 
							err => {if (err) throw err;});
					}
				});
			} catch (error) {
				console.error("Unable to clean: " + buildsFolderPath); 
				console.log("Build stopped (" + error + ")"); 
				return;
			}
		break;

		case "Transpilation":
			executeCommand("tsc --build " + projectRootPath + "tsconfig.json");
			return;

		case "RollUp":
			executeCommand("rollup --input " + projectRootPath + "Builds/Temp/OpenUIX.js" +
				" --environment THREE" +
				" -o " + transpiledCodeFilePath + " -f umd -n OpenUIX -m" );
			return;
		case "Minimization":
			executeCommand("uglifyjs -c -m -o " + minifiedCodeFileName +
				" --source-map \"content='" + transpiledMapFileName + "'\""+
				" " + transpiledCodeFileName, {"cwd": buildsFolderPath});
			return;

		case "Linking":
			try{
				var comment = '// OpenUIX - See openuix.org/license\n',
					map = "\n//# sourceMappingURL=" + minifiedMapFileName;
				var data = fs.readFileSync(minifiedCodeFilePath, encoding);
				fs.writeFileSync(minifiedCodeFilePath, comment + data, encoding);
				fs.writeFileSync(debugFilePath, data + map, encoding);
				var threejsData = fs.readFileSync(threejsFilePath, encoding);
				var bundleData = comment + data + "\n\n" + threejsData;
				fs.writeFileSync(bundleFilePath, bundleData, encoding);

			} catch (error) {
				console.log("Build stopped (" + error + ")"); 
				return;
			}
		break;
		
	}

	// Execute the next task
	if (taskIndex < tasks.length- 1) { build(++taskIndex); }
	else { console.log("Build completed"); taskIndex = -1; }
}

// ---------------------------------------------------------------- ENTRY POINT

// Clean the console
// process.stdout.write('\033c');

// Process the command line arguments
var cleaning = false, transpilation = true, minimization = true, linking = true;
var watch = false;
process.argv.forEach((arg) => {
	switch (arg) {
		case "-h":
			console.log("OpenUIX build");
			console.log("Options:");
			console.log("-h		Show help.");
			console.log("-c		Enable cleaning task.");
			console.log("-t		Disable transpilation task.");
			console.log("-m		Disable minimization task.");
			console.log("-l		Disable linking task.");
			console.log("-w		Enable watching mode.");
			process.exit();
		break;
		case "-c": cleaning = !cleaning; break;
		case "-t": transpilation = !transpilation; break;
		case "-m": minimization = !minimization; break;
		case "-l": linking = !linking; break;
		case "-w": watch = !watch; break;
	}
});

// Create the tasks
tasks= [];
if (cleaning) tasks.push("Cleaning");
if (transpilation) tasks.push("Transpilation");
if (transpilation) tasks.push("RollUp");
if (minimization) tasks.push("Minimization");
if (linking) tasks.push("Linking");


// See if we have to keep watching for changes in the Sources folder
if (watch) {
	console.log("Watching: " + sourcesFolderPath);
	var watchPeriod = 2000, lastWatch = Date.now() - watchPeriod;
	fs.watch(sourcesFolderPath, { persistent: true, recursive:true }, 
		function (event, fileName) {
		if ((event == "change") && ((Date.now() - lastWatch) > watchPeriod)) {
			console.log("\nChange detected: " + fileName);
			lastWatch = Date.now();

			// Init/reset the build process
			if (taskIndex < 0) build(); else taskIndex = -1;
			
		}
	});
}

// Run the build process
console.log("Building in: " + buildsFolderPath);
build();


