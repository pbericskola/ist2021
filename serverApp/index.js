const { request, response } = require('express');
const express = require('express');
const products_work_module = require('products-work-module');

let app = express();
const port = 8000;

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.get('/', (request, response) =>
{
    response.send(products_work_module.allProducts());
});

app.get('/getProduct', (request, response) =>
{
    response.send(products_work_module.getProduct(request.query.id));
});

app.post('/saveProduct', (request, response) =>
{
    products_work_module.changeProduct(request.body);
    response.send("Uspešno ste snimili proizvod!");
});

app.get('/deleteProduct', (request, response) =>
{
    products_work_module.deleteProduct(request.query.id);
    response.send('Uspešno ste obrisali proizvod.');
});

app.post('/addProduct', (request, response) =>
{
    products_work_module.addProduct(request.body);
    response.send('Uspešno ste dodali proizvod.');
});

app.get('/sortProducts', (request, response) =>
{
    response.jsonp(products_work_module.sortProducts(parseInt(request.query.sortBy)));
});

app.listen(port, () => {console.log(`Server startovan na portu ${port}.`)})