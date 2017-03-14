const express = require('express'),
      app = express(),
      path = require('path'),
      request = require('request'),
      environment = 'dev';

app.set('view engine', 'ejs');
app.get('/', (req, res) => {
  res.render('pages/index');
})

// Static Content and node modules
const modules = path.join(__dirname, 'node_modules');
const jsExt = environment === 'dev' ? '.js' : '.min.js';
const cssExt = environment === 'dev' ? '.css' : '.min.css';
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/app'));
app.use('/js/tether', express.static(path.join(modules, 'tether', 'dist', 'js', 'tether' + jsExt)));
app.use('/js/jquery', express.static(path.join(modules, 'jquery', 'dist', 'jquery' + jsExt)));
app.use('/js/bootstrap', express.static(path.join(modules, 'bootstrap', 'dist', 'js', 'bootstrap' + jsExt)));
app.use('/js/bootstrap-datetimepicker', express.static(path.join(__dirname, 'public', 'js', 'lib', 'bootstrap-datetimepicker.min.js')));
app.use('/js/knockout', express.static(path.join(modules, 'knockout', 'build', 'output', 'knockout-latest' + jsExt)));
app.use('/js/moment', express.static(path.join(modules, 'moment', 'min', 'moment.min.js')));
app.use('/css/tether', express.static(path.join(modules, 'tether', 'dist', 'css', 'tether' + cssExt)));
app.use('/css/bootstrap', express.static(path.join(modules, 'bootstrap', 'dist', 'css', 'bootstrap' + cssExt)));
app.use('/css/bootstrap-datetimepicker', express.static(path.join(__dirname, 'public', 'css','bootstrap-datetimepicker.min.css')));
app.use('/css/font-awesome', express.static(path.join(__dirname, 'public', 'css', 'font-awesome.min.css')));

// API routes
const apiKey = 'yBP7s9oe5rIrLKmTV3CjZzxFlR8WeifXAhvQkxBC',
      apodUrl = 'https://api.nasa.gov/planetary/apod';

app.get('/api/apod', (req, res) => {
  request.get(apodUrl + '?date=' + req.query.date + '&api_key=' + apiKey, (err, response, body) => {
    if (err) {
      console.warn(err);
      res.status(400).send(err);
    } else {
      if (response.statusCode === 200) {
        res.status(200).send(body);
      } else {
        var message = JSON.parse(body).msg;
        console.log('Message: ' + message);
        res.status(400).send(message);
      }
    }
  });
});


app.listen(3000, '0.0.0.0', () => {
  console.log('APOD app listening on port 3000!');
})
