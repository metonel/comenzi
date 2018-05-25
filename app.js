const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

//conectarea la baza de date

mongoose.connect('mongodb://localhost/comenzi-dev', { 
})  .then(() => console.log('mongo conect...')) //functia ii promise, prindem raspunsu cu then
    .catch(err => console.log(err));            //prindem eroarea cu catch, daca exista

//incarcarea modelului pt baza de date
require('./models/Comenzi');
const Comenzi = mongoose.model('comenzi'); //*1

//middleware
// app.use(function(req, res, next){
//     console.log(Date.now());
//     next();
// });

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
//body-parser pt a prelua datele din form
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//routes
app.get('/', (req, res) =>{
    const titlu = 'panou comenzi';
    res.render('INDEX', {
        title: titlu
    });
});

app.get('/comenzile', (req, res) =>{
    Comenzi.find({})
        .sort({data:'desc'})
        .then(comenzi => {
            res.render('comenzi/index', {
                comenzi: comenzi
            });
        });
});

app.get('/comenzi/add', (req, res) =>{
    res.render('comenzi/add');
});

app.post('/comenzi', (req, res) =>{
    let errors = [];
    if(!req.body.produs){
        errors.push({text:'specifica produsul'});
    }
    if(!req.body.tel){
        errors.push({text:'specifica nr de telefon'});
    }
    if(errors.length >0 ){
        res.render('comenzi/add', {
            errors: errors,
            produs: req.body.produs,
            tel: req.body.tel
        });
    } else {
        const comanda = {
            produs: req.body.produs,
            tel: req.body.tel,
            nume: req.body.nume
        }
        new Comenzi(comanda)         //vine de aici *1
                .save()
                .then(comenzi => {
                    res.redirect('/comenzile');
                })
    }
});


const port = 5000;

app.listen(port, () => {
    console.log(`server pe port ${port}`);  //``(backticks) pt template string, pentru a putea folosi variabile fara sa concatenam
});     // () => {} in loc de function(){} pt callback