const express = require('express');
const app = express();
const path = require('path');
const conectando = require('./src/mysql_connector.js');
const ejsMate = require("ejs-mate");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.engine('ejs',ejsMate)
app.set('view engine', 'ejs');

conectando.connect((err)=>{
    if(err) throw err;
    console.log("Conectado a la base");
});

//Querys
const ordenarPor =['nombreA','nombreD','precioA','precioD'];

let query =  `SELECT * FROM product where category = `;
let query2 =  'SELECT * FROM category';
let query3= 'SELECT * from product where name LIKE'


//Mostrar todos los productos de la categoria inicial
app.get('/all-products',async(req,res,next)=>{
    let id = 1;  
    try {
        await conectando.query(`${query} ${id}`,async(err, products) => {
            if(err) res.json({status:500, err});
            conectando.query(query2,(err,categories)=>{
            if(err) res.json({status:500, err});
            res.json({products,categories,ordenarPor})    
             });
           });
    } catch (error) {
        console.log(error)
    }
});


//filtrar por nombre
app.post('/find-for-name', async(req,res,next)=>{
    let name = req.body.name;
        try {
            if(name.indexOf('"')!=-1){
                name = name.replace(/['"]+/g, '')
             }
                await conectando.query(`${query3} '%${name}%'`,(err, products)=>{
                if(err) res.json({status:500, err});
                conectando.query(query2,(err,categories)=>{
                if(err) res.json({status:500, err});
                res.json({products,categories,ordenarPor})
                });
             }); 
             
        } catch (err) {
            console.log(err);
          
        }
});

//filtrar por categoria
app.post('/filter-by-cat', async(req,res,next)=>{
    let id = req.body.id;
    try {
        await conectando.query(`${query} '${id}'`,(err, products)=>{
            if(err) res.json({status:500, err});
            conectando.query(query2,(err,categories)=>{
            if(err) res.json({status:500, err});
            res.json({products,categories,ordenarPor}) 
            })
        });  
    }  catch (err) {
        console.log(err);   
    }    
});

//ordenar por
app.post('/sort-by', async(req,res,next)=>{
    let sortBy = req.body.sortBy;
    let id = req.body.id;
    try {
        if(sortBy==='nombreA'){
            var query3 = `${query} '${id}' ORDER BY name`;
        }else if(sortBy==='nombreD'){
            var query3 = `${query} '${id}' ORDER BY name DESC`;
        }else if(sortBy==='precioA'){
            var query3 = `${query} '${id}' ORDER BY price DESC`;
        }else if(sortBy==='precioD'){
            var query3 = `${query} '${id}' ORDER BY price`;
        }else{
            var query3 = `${query} '${id}'`;
        }
        
        conectando.query(query3,async(err,products)=>{
            if(err) res.json({status:500, err});
            await conectando.query(query2,(err,categories)=>{
            if(err) res.json({status:500, err});
            res.json({products,categories,ordenarPor})        
                })
            });
    } catch (err) {
        console.log(err);  
    }
    
});

//Iniciar servidor
const port = process.env.PORT || 4000;
app.listen(port, ()=>{
    console.log(`Serving on port ${port}`)
})

//keep alive
setInterval(function () {
    conectando.query('SELECT 1');
}, 4000);
