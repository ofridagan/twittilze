// Configuration
const { inputStream, port, publicDir } = require('./app/configuration');

// Koa application
const app = new (require('koa'))();

// Serving the public files (js, css, etc)
app.use(require('koa-static')(publicDir));

// My Stats middleware - makes the stats available as ctx.stats
app.use(require('./app/stats')(inputStream));

// Routes (API)
app.use(require('./app/routes'));

// Start the server
app.listen(port, console.log(`Server listening on port ${port}`));