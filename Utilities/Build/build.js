// This Node.js file generates the build and documentation files of the project.
// To properly run this code, you need to install Node.js and the uglify-js 
// packages.
//
// To install the Nodejs packages, remember that you can do so either locally 
// (with the command "npm install {ModuleName}") or, preferably globally 
// (with the commands "npm install -g {ModuleName}" and "npm link {ModuleName}")

// ---------------------------------------------------------- REQUIRED PACKAGES
var fs = require('fs');						// File System access
var path = require("path");					// File Path handling
var uglifyjs = require('uglify-es');		// ECMAScript6 transcriber


// ----------------------------------------------------------- GLOBAL VARIABLES
// Create the (relative paths)
var projectRootPath = '..\\..\\';
var buildsFolderPath =  'Builds\\';
var sourcesFolderPath = 'Sources\\';
var concatenatedFilePath = buildsFolderPath + 'openuix.threejs.js';
var debugFilePath = buildsFolderPath + 'openuix.threejs.dbg.js';
var codeMapFilePath = buildsFolderPath + 'openuix.threejs.map.js';
var releaseFilePath = buildsFolderPath + 'openuix.threejs.min.js';
var sourceFilePaths = [];


// ----------------------------------------------------------- GLOBAL FUNCTIONS

/** Turns a relative path into an absolute one. 
 * @param relativePath The relative path to convert.
 * @param checkFileExists Whether or not to check if the file exists.
 * @param checkDirExists Whether or not to check if the directory exists.
 */
function makeAbsolutePath(relativePath, checkFileExists = false, 
	checkDirExists = true)
{
	// Resolve the path from the current directory name
	var absolutePath = path.resolve(__dirname + '\\' + projectRootPath + 
		relativePath);

	// Perform the requested checks
	if (checkFileExists && !fs.existsSync(absolutePath))
		throw Error("File does not exist: " + relativePath);
	if (checkDirExists && !fs.existsSync(path.dirname(absolutePath)))
		throw Error("Directory does not exist: " + path.dirname(relativePath));

	// Return the absolute path
	return absolutePath;
}

function findSourceFiles () {
	sourceFilePaths.push('DevTools/DevTools.js');
	sourceFilePaths.push('Viewport.js');
	sourceFilePaths.push('OpenUIX.js');
}


/** Transpile the code into the minified file. */
function build() {

	// Create a variable to store the data to minify
	var dataToMinify = {};

	// Create a variable to store the concatenated files
	var concatenatedFileData = "";

	// Check that all source files exist
	sourceFilePaths.forEach (function(filePath) {

		// Set the relative and absolute file paths
		var relativePath = sourcesFolderPath + filePath;
		var absolutePath = makeAbsolutePath(relativePath, true);

		// Read the file data
		fileData = fs.readFileSync(absolutePath, 'utf-8');

		// Add the relative path and the data to the list
		dataToMinify[filePath] = fileData;

		// Add the file data to the concatenated data file
		concatenatedFileData += "// " + filePath + "\n\n" + fileData + "\n\n"; 
	});

	// Minify the data of all the files
	var minifiedData = uglifyjs.minify(dataToMinify, { "sourceMap" : true });
	
	// Check if there has been an error and, if so, display it properly
	if (minifiedData.error !== undefined) 
		throw new Error(minifiedData.error.message + 
			"\nFile: " + minifiedData.error.filename + 
			" Line: " + minifiedData.error.line + 
			" Columns: " + minifiedData.error.line);

	// Write the data into the respective files
	var comment = '// OpenUIX - See openuix.org/license\n';
	var codeMapFileName = codeMapFilePath.substr(buildsFolderPath.length);
	var codeMapReference = '//# sourceMappingURL=' + codeMapFileName;
	fs.writeFileSync(makeAbsolutePath(concatenatedFilePath), 
		concatenatedFileData, 'utf8');
	fs.writeFileSync(makeAbsolutePath(debugFilePath), 
		minifiedData.code + codeMapReference, 'utf8');
	fs.writeFileSync(makeAbsolutePath(codeMapFilePath), 
		minifiedData.map.replace(/,/, ",\"sourceRoot\":\"../Sources/\","), 'utf8');
	fs.writeFileSync(makeAbsolutePath(releaseFilePath), 
		comment + minifiedData.code, 'utf8');
}

// ---------------------------------------------------------------- ENTRY POINT

// Execute the right sequence of functions
console.log("Executing in: " + __dirname);
findSourceFiles();
build();

// On completion, display a message on console
console.log('Build Complete');

// Exit the process properly
process.exit();
