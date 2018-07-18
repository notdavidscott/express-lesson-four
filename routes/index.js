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

const artistList = `SELECT * FROM artists`;

router.get('/artist', function(req, res, next) {
  db.all(artistList, function(err, row) {
    res.render('artist', {
      artists: row
    });
  });
});

const newArtist = db.prepare(`INSERT INTO artists(Name) VALUES(?)`);

router.post('/artist', function(req, res, next) {
  console.log(req.body.name);
  const addArtist = req.body.name;
  
  const selectArtist = `SELECT * FROM artists WHERE artists.name = '${addArtist}'`;

  db.all(selectArtist, function(err, row) {
    if (row.length > 0) {
      res.send('Sorry, that artist already exists');
      //this is needed because the row is an array so if there is anything in the array, that means there is an artist with the same name as req.body.params. If the row is zero, that means there is no artist in the database with that name.
    } else {
      newArtist.all(addArtist, function(err, row) {
        if (err){
          res.render('/error', { message: 'oops, something went wrong!'})
        } else {
          res.redirect('/artist');
        }
      });
    }
  });
});


module.exports = router;
