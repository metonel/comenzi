const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(methodOverride('_method')); //pt a face put request la edit

//express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }));

//flash messages
app.use(flash());
//variabile globale, pt mesaje
app.use(function(req, res, next){
    res.locals.msg_success = req.flash('msg_success');
    res.locals.msg_error = req.flash('msg_error');
    next();
});


//routes
app.get('/', (req, res) =>{
    Comenzi.find({})
        .sort({data:'desc'})
        .then(comenzi => {
            res.render('comenzi/index', {
                comenzi: comenzi
            });
        });
});


//adaugare comanda

app.get('/comenzi/add', (req, res) =>{
    res.render('comenzi/add');
});

//editare comanda

app.get('/comenzi/edit/:id', (req, res) =>{
    Comenzi.findOne({
        _id: req.params.id
    })
        .then(comenzi => {
            res.render('comenzi/edit', {
                comenzi:comenzi
            });
        });
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
                req.flash('msg_success', 'comanda adaugata');
                    res.redirect('/');
                })
    }
});

//procesul pt edit

app.put('/comenzi/:id', (req, res) => {
    Comenzi.findOne({
        _id: req.params.id
    })
        .then(comenzi => {
            comenzi.produs = req.body.produs;
            comenzi.tel = req.body.tel;
            comenzi.nume = req.body.nume;

            comenzi.save()
                .then(comenzi => {
                    req.flash('msg_success', 'comanda modificata');
                    res.redirect('/');
                })
        });
});

//sterge

app.delete('/comenzi/:id', (req, res) => {
    Comenzi.remove({_id: req.params.id})
        .then(() => {
            req.flash('msg_success', 'comanda eliminata');
            res.redirect('/');
        });
});

const port = 5000;

app.listen(port, () => {
    console.log(`server pe port ${port}`);  //``(backticks) pt template string, pentru a putea folosi variabile fara sa concatenam
});     // () => {} in loc de function(){} pt callback