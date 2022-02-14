const express = require('express');
const path = require('path');

const server = express();

// built in middleware to serve static content just as images, css, html etc
server.use(express.static(path.join(__dirname, 'dist', 'micro-warehouse-frontend')));

// all get requests will point to angular's index.html in dist folder
server.get('/*', async (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'micro-warehouse-frontend', 'index.html'));
});
//C:\Users\klara\Documents\Uni\Microservices\project-mono-repo-KlaraGtknst\MicroWarehouse\micro-warehouse-frontend\src\index.html
//create dist file by running: npm run build

const port = process.env.PORT || 4200;  //3001
server.listen(port, () => console.log('App Running on port ' + port));
