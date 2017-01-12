var express = require('express');

//create our app
var app = express();
const PORT = process.env.PORT || 3000;

app.use(function (req, res, next){
	if (req.headers['x-forwarded-proto'] === 'https'){
		res.redirect('http://' + req.hostname + req.url);
	} else {
		next();
	}
});


app.use(express.static('public'));

app.listen(process.env.PORT, '0.0.0.0', function(err) {
  console.log("Started listening on %s", app.url);
});

