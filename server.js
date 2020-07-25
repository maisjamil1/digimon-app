
'use strict'

require('dotenv').config()
const express =require('express')
const superagent =require('superagent')
const pg =require('pg')
const methodOverride =require('method-override')

const app=express()
const PORT=process.env.PORT||3030
const client=new pg.Client(process.env.DATABASE_URL)
client.on('err',(err)=>{
    console.log(err)
})

// app.use(express.static('./public'))
app.use('/public', express.static('public'));
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.use(express.json())

app.set('view engin','ejs')



app.get('/',homepage)
app.post('/add',addTo)
app.get('/renderFAV',renderFAVpage)
app.get('/showdetails/:id',showDetailsPage)
app.put('/update/:id',updateDigi)
app.delete('/delete/:id',deleteDigi)
app.get('/renderSearch',renderSearch)
app.post('/Search',startSearch)
app.get('/results',resultsSearch)












//___________________________________________________________
function homepage(req,res){
    // res.render('index.ejs')
    superagent('https://digimon-api.vercel.app/api/digimon').then(data=>{
        // res.json(data.body)
        let digiArr=data.body.map(obj=>{
            return new DigiMaker(obj)
        })
        
        res.render('index.ejs',{data:digiArr})
    })
    
}
//___________________________________________________________

function DigiMaker(x){
    this.name=x.name ||'namee'
    this.img=x.img ||'imggg'
    this.level=x.level ||'leveeel'

}


//___________________________________________________________
function addTo(req,res){
    let {name,img,level}=req.body
    // console.log(name,img,level);
    const SQL='INSERT INTO MEOWW (name,img,level)VALUES($1,$2,$3);'
    const VALUES=[name,img,level]
    client.query(SQL,VALUES).then(results=>{
        res.redirect('/renderFAV')
    })
    
}
//___________________________________________________________

function renderFAVpage(req,res){
    const SQL='SELECT * FROM MEOWW;'
    client.query(SQL).then(results=>{
        res.render('pages/Fav.ejs',{data:results.rows})
    })
}
//___________________________________________________________

function showDetailsPage(req,res){
    // let digiId=req.params.id
    // console.log(digiId);
    const SQL='SELECT * FROM MEOWW WHERE id=$1;'//نسيت *
    const VALUES=[req.params.id]
    client.query(SQL,VALUES).then(results=>{
        res.render('pages/details.ejs',{val:results.rows[0]})
    })
}
//___________________________________________________________

function updateDigi(req,res){
   
    let {name,img,level}=req.body
    const VALUES=[name,img,level,req.params.id]
    const SQL='UPDATE MEOWW SET name=$1,img=$2,level=$3 WHERE id=$4;'//نسيت *
    client.query(SQL,VALUES).then(results=>{
        res.redirect('/renderFAV')
    })
    
    
    
}
//___________________________________________________________
function deleteDigi(req,res){
   
    
    const SQL= 'DELETE FROM MEOWW WHERE id=$1;'//نسيت *
    const VALUES=[req.params.id]
    client.query(SQL,VALUES).then(results=>{
        res.redirect('/renderFAV')
    })

    
    
}
//___________________________________________________________
function renderSearch(req,res){
    res.render('pages/search.ejs')
}
//___________________________________________________________
let SearchArr;
function startSearch(req,res){
    let $serchBy=req.body.searchBy
    let $text=req.body.text
    // console.log($serchBy,$text);
    superagent(`https://digimon-api.vercel.app/api/digimon/${$serchBy}/${$text}`).then(data=>{
        // res.json(data.body)
        SearchArr=data.body.map(obj=>{
            return new DigiMaker(obj)
        })
        
        res.redirect('/results')
    })
    
}
//___________________________________________________________



function resultsSearch(req,res){
    res.render('pages/results.ejs',{data:SearchArr})
    
}
//___________________________________________________________
































app.get('/test',test)
function test(req,res){
    res.send('tesssssssssssssssssst')
}



app.use('*',notFoundHandler)



function errorHandler(err,req,res){
    res.status(500).send(err)
    }
    
    function notFoundHandler(req,res){
        res.status(404).send('page not found 404')
    }
    
    
    
    
    
    

    
    
    
    client.connect().then(()=>{
    app.listen(PORT,()=>{//◊~
        console.log('up and running on ',PORT)
    })
})







































































































// app.get('/location', (request, response) => {
//   try {//وظيفتها تغطي كل الاحتمالات..في حال النجاح رح تعمل الكود تبعها
//     const geoData = require('./data/geo.json');
//     const city = request.query.city;
//     console.log(city);//tokyo
//     console.log(request.query);//{ city: 'tokyo' }
//     const locationData = new Location(city, geoData);
//     response.status(200).json(locationData);//رح يرجع اوبجيكت واحد الي هو فيه اسم المدينة وموقعها
//   } catch (error) {//في حال الفشل رح يتنفذ هاد
//     errorHandler(error, request, response);
//   }
// });
// //وظيفة الكونستراكتر اني استخلص الداتا من ملف الجيسون واكون اوبجيت بالمعلومات المحددة الي انا بدي اياها 
// function Location(city, geoData) {
//   this.search_query = city;
//   this.formatted_query = geoData[0].display_name;//geoData اسم ملف الجيسون
//   this.latitude = geoData[0].lat;
//   this.longitude = geoData[0].lon;
// }

// function yelphandler(request, response) {//YELP_API_KEY عشان اضيف set استمعلنا
//     superagent(`https://api.yelp.com/v3/businesses/search?location=${request.query.search_query}`).set({ "Authorization": `Bearer ${process.env.YELP_API_KEY}`})
//         .then((yelpRes) => {
           
//             const yelpSummaries = yelpRes.body.businesses.map((yelp$) => {
//                 return new yelpCONS(yelp$);
//             });
//             // console.log('yelp',request.query);//{search_query:,formatted_query:,latitude:,longitude:}
//             response.status(200).json(yelpSummaries);
//         })
//         .catch((err) => errorHandler(err, request, response));
// }