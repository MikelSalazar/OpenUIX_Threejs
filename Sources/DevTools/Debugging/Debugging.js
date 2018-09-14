log = function(message) {
	console.log(message);
}

/** Global error handling function (captures uncaugh exceptions). */
window.onerror = function(message, source, lineno, colno, error) {
	//if (error) message = error.stack;
	console.log(error.message + " " + error.stack);
};