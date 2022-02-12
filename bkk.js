const express = require(`express`)
const app = express()

const pasirinkimas = (req,res)=> {
    res.send( `<br><br><h1 style="text-align: center;
    
    text-shadow: 0 -1px 4px #FFF, 0 -2px 10px #ff0, 0 -10px 20px #ff8000, 0 -18px 40px #F00;">Čia gali trumpai susipažinti su tuo kas laukia pradėjus mokytis vairuoti: </h1> <br><iframe width="560" height="315" src="https://www.youtube.com/embed/hlnKgV04fWM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe><iframe width="560" height="315" src="https://www.youtube.com/embed/xDwdjM-StxM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe><iframe width="560" height="315" src="https://www.youtube.com/embed/2ZoONcbYOek" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe><br><br><h3 style =" text-align: center;  text-shadow: 0 -1px 4px #FFF, 0 -2px 10px #ff0, 0 -10px 20px #ff8000, 0 -18px 40px #F00;">   Kelias atgal į pagrindinį langą paspaudus<a href ="/"> ČIA!!!</a></h3>`)

}
module.exports = {pasirinkimas}