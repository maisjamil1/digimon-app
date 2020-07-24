
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


app.use(express.static('./public'))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.use(express.json())

app.set('view engin','ejs')

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