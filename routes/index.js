const express = require('express');
var router = express.Router();
const sqlite = require('sqlite3').verbose();

  const db = new sqlite.Database('./chinook.sqlite', err => {
    if (err) {
      return console.log(err.message);
    }
    console.log("<< | You are connected to the database | >>")
  });

  const query = `SELECT * from artists LIMIT 10`;

  db.all(query, (err, row) => {
    if (err) throw err;
    console.log(row);
  });


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/artist/:id', function(req, res, next) {
  let artist = parseInt(req.params.id);
  console.log(artist);

  let idQuery = `SELECT * FROM artists WHERE ArtistId=${artist}`;
  console.log(idQuery);

  db.all(idQuery, (err, row) => {
    console.log(row);
    if (row.length > 0) {
      res.render('index', {
        artist: row[0]  
      });
    } else {
      res.send('not a valid id');
    }
  }); 
});



module.exports = router;
