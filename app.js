const express = require('express');
const exphbs = require('express-handlebars');

const app = express();

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//middleware
// app.use(function(req, res, next){
//     console.log(Date.now());
//     next();
// });

//routes
app.get('/', (req, res) =>{
    const titlu = 'panou comenzi';
    res.render('INDEX', {
        title: titlu
    });
});

app.get('/about', (req, res) =>{
    res.render('about');
});
const port = 5000;

app.listen(port, () => {
    console.log(`server pe port ${port}`);  //``(backticks) pt template string, pentru a putea folosi variabile fara sa concatenam
});     // () => {} in loc de function(){} pt callback