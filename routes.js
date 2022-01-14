const fs = require('fs');

// Method to handle the requests and responses
const requestHandler = (req,res) => {
    const url = req.url;
    const method = req.method;
    if(url === '/') {
        res.write('<html>');
        res.write('<head><title>Enter Message</title></head>');
        res.write('<body><form action="/message" method="POST"><input type="text" name="message"><button>Send</button></form></body>');
        res.write("</html>");
        return res.end(); // do not call any methods after this
    }
    if(url === '/message' && method === 'POST') {
        const body = [];
        // Use 'on' to listen to events
        req.on('data', (chunk) => {
            body.push(chunk);
        });
        return req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            const message = parsedBody.split('=')[1];
            fs.writeFile('message.txt', message, (err) => {
                // res.writeHead(302,{
                //     'Location': '/'
                // })
                res.statusCode = 302;
                res.setHeader('Location', '/')
                return res.end();
            })
        });
    }
    res.setHeader('Content-Type','text/html');
    res.write('<head><title>Enter Message</title></head>');
    res.write('<body><h1>Hello from my Node.js Server!!!</h1></body>');
    res.write("</html>");
    return res.end();
}

module.exports = requestHandler; // this can be required in other modules

// Other ways to export.
// module.exports = {
//     handler: requestHandler
// }
// module.exports.handler = requestHandler
// exports.handler = requestHandler