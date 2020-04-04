const express = require("express");
const bodyparser = require("body-parser");
const redis = require("redis");
const cache = redis.createClient();
const port = 8080;
const app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());

const fatorialFuncao = require("./fatorial");

cache.on("connect", () => {
    console.log("Redis is ready");
});

cache.on("error", (e) => {
    console.log("Redis error", e);
});

const getCache = (key) => {
    return new Promise((resolve, reject) => {
        cache.get(key, (err, value) => {
            if(err){
                reject(err);
            }else{
                resolve(value);
            }
        });
    });
};

const setCache = (key, value) => {
    return new Promise((resolve, reject) => {
        cache.set(key, value, 'EX', 300, (err) => {
            if(err){
                reject(err);
            }else{
                resolve(true);
            }
        });
    });

};

app.get("/", (req, res) => {
    res.render('index');
});

app.post("/calculofatorial", (req, res) => {    
    let id = req.body.s1;
    let idValue = parseInt(req.body.s1);
    let valueId = getCache(value);
    
    if(valueId){
        res.send("Id returnet from cache: "+id+": "+valueId)
    }else{        
        
        if(parseInt(idValue) > 0) {
            let calculation = fatorialFuncao(idValue)
            setCache(id, calculation);
            res.send("Id returnet from bd"+" "+ id +" " + calculation);
            
        } else {
            let msgErro = "digite um valor válido"
            res.send(msgErro);
        }
    }                        
});



app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});