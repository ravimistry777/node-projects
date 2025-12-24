const http = require('http');
const fs = require('fs');
const port = 8080

const server = http.createServer((req,res)=>{
    let filepath;
    switch (req.url) {
        case '/':
            filepath = "./home.html"
            break;
        case '/about':
            filepath = "./about.html"
            break;
        case '/contact':
            filepath = "./contact.html"
            break;
        case '/faq':
            filepath = "./faq.html"
            break;        
        
        default:
            filepath = "./notfound.html"
            break;
    } 
    const data = fs.readFileSync(filepath,'utf-8');
    res.write(data);
    res.end();
})

server.listen(port, (err)=>{
    if (err) {
        console.log(err)
    }else{
        console.log(`http://localhost:${port}`)
    }
})