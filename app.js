let express = require('express');
let posgres = require('postgres');
let path = require('path');
let ejs = require('ejs');
let app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); 

app.get('/', (req, res) => {
    res.render('main'); 
});

app.listen(5000, () => {
    console.log('Listening: http://localhost:5000/');
});