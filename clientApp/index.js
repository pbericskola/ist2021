const express = require('express');
const axios = require('axios');
const cookieParser = require("cookie-parser");
const { request } = require('express');

let app = express();
const port = 5000;

app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser());

app.set('view engine', 'ejs');

app.get('/', (request, response) =>
{
    axios.get('http://localhost:8000/').
        then(function(res) 
        {
            let products = res.data;
            response.render('index', {allProducts: products});
        })
        .catch(function (error) 
        {
            console.log(error);
        })
});

app.get('/admin', (request, response) =>
{    
    axios.get('http://localhost:8000/').
        then(function(res) 
        {
            let message = request.cookies["message"];
            response.clearCookie("message", {httpOnly: true});

            let products = res.data;
            response.render('admin', {allProducts: products, message: message});
        })
        .catch(function (error) 
        {
            console.log(error);
        })
});

app.get('/changeProduct/:id', (request, response) =>
{
    let id = parseInt(request.params["id"]);
    axios.get('http://localhost:8000/getProduct', {params: {id: id}}).
        then(function(res) 
        {
            let responseProduct = res.data;
            response.render('change', {product: responseProduct});
        })
        .catch(function (error) 
        {
            console.log(error);
        })
});

app.get('/saveProduct', (request, response) =>
{
    let product = 
    {
        id: request.query["id"],
        naziv: request.query["naziv"],
        cena: parseInt(request.query["cena"])
    }

    axios.post('http://localhost:8000/saveProduct', product).
        then(function(res) 
        {
            response.cookie("message", "Uspešno ste izmenili proizvod!", {httpOnly: true});
            response.redirect("/admin");
        })
        .catch(function (error) 
        {
            console.log(error);
        })
});

app.get('/deleteProduct/:id', (request, response) =>
{
    let id = parseInt(request.params["id"]);

    axios.get('http://localhost:8000/deleteProduct', {params: {id: id}}).
        then(function(res) 
        {
            response.cookie("message", "Uspešno ste obrisali proizvod!", {httpOnly: true});
            response.redirect("/admin");
        })
        .catch(function (error) 
        {
            console.log(error);
        })
});

app.get('/addProduct', (request, response) =>
{
    response.render('add');
});

app.get('/saveAddedProduct', (request, response) =>
{
    let product = 
    {
        naziv: request.query["naziv"],
        cena: parseInt(request.query["cena"])
    }

    axios.post('http://localhost:8000/addProduct', product).
        then(function(res) 
        {
            response.cookie("message", "Uspešno ste dodali proizvod!", {httpOnly: true});
            response.redirect("/admin");
        })
        .catch(function (error) 
        {
            console.log(error);
        })
});

app.listen(port, () => 
{
    console.log(`Klijent startovan na portu ${port}.`)
});