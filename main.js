const app = require('./server');
const PORT = process.env.PORT || 8080; // this can be very useful if you deploy to Heroku!

app.listen(PORT, ()=> console.log(`Listening on port ${PORT}`));
