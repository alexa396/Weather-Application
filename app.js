const http = require('http');
const fs = require('fs');
const path = require('path');
const port = 3000;

const server = http.createServer(function(req, res) {
  console.log(`${req.method} request for ${req.url}`);

  // Serve index.html file for the root URL
  if (req.url === '/') {
    fs.readFile('index.html', 'utf8', function(err, data) {
      if (err) {
        console.error(`Error reading index.html file: ${err}`);
        res.writeHead(500);
        res.end('Server error');
        return;
      }
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(data);
    });

  // Serve style.css file for /style.css URL
  } else if (req.url === '/style.css') {
    fs.readFile('style.css', 'utf8', function(err, data) {
      if (err) {
        console.error(`Error reading style.css file: ${err}`);
        res.writeHead(500);
        res.end('Server error');
        return;
      }
      res.writeHead(200, {'Content-Type': 'text/css'});
      res.end(data);
    });

  // Serve script.js file for /script.js URL
  } else if (req.url === '/script.js') {
    fs.readFile('script.js', 'utf8', function(err, data) {
      if (err) {
        console.error(`Error reading script.js file: ${err}`);
        res.writeHead(500);
        res.end('Server error');
        return;
      }
      res.writeHead(200, {'Content-Type': 'text/javascript'});
      res.end(data);
    });

  // Serve background.jpg file for /background.jpg URL
  } else if (req.url === '/background.jpg') {
    fs.readFile('background.jpg', function(err, data) {
      if (err) {
        console.error(`Error reading background.jpg file: ${err}`);
        res.writeHead(500);
        res.end('Server error');
        return;
      }
      res.writeHead(200, {'Content-Type': 'image/jpeg'});
      res.end(data);
    });

  // Serve 404 error page for all other URLs
  } else {
    res.writeHead(404);
    res.end('Page not found');
  }
});

server.listen(port, function() {
  console.log(`Server listening on http://localhost:${port}`);
});
