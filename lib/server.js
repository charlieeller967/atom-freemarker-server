var express      = require( 'express' );
var path         = require( 'path' );
var url          = require( 'url' );
var favicon      = require( 'static-favicon' );
var logger       = require( 'morgan' );
var cookieParser = require( 'cookie-parser' );
var bodyParser   = require( 'body-parser' );

var cwd = process.cwd();
var app = express();
var router = express.Router();

app.use( favicon() );
app.use( logger('dev') );
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use( cookieParser() );
app.use( '/', router );
app.use( express.static( cwd ) );

//404
app.use(function( req, res, next ) {
	var err = new Error( 'Not Found' );
	err.status = 404;
	next( err );
});

//error
app.use(function( err, req, res, next ) {
	res.status( err.status || 500 );
	res.render('error', {
		message: err.message,
		error: {}
	});
});

//port
app.set( 'port', process.env.PORT || 80 );

var server = app.listen(app.get( 'port' ), function() {
	console.log( 'Server Started (port: ' + server.address().port + ')' );
});
