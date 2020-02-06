let express = require('express');
let posgres = require('postgres');
let path = require('path');
let ejs = require('ejs');
let app = express();
const port = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); 

app.get('/', (req, res) => {
    res.render('main'); 
});

app.listen(port, () => {
    console.log('Listening: http://localhost:5000/');
});