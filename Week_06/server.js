const http = require('http');

http.createServer((request, response) => {
  const { headers, method, url } = request;
  let body = [];
  request.on('error', (err) => {
    console.error(err);
  }).on('data', (chunk) => {
    body.push(chunk);
  }).on('end', () => {
    body = Buffer.concat(body).toString();
    response.writeHead(200,{'Context-Type':'text/html'})
    response.end('hello world\n');
  })
}).listen(8080); // Activates this server, listening on port 8080.
