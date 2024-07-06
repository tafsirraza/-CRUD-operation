const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

// Initialize SQLite database
const db = new sqlite3.Database('./db.sqlite');

// Create table if not exists
db.run(`CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item TEXT
)`);

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// API to get all items
app.get('/items', (req, res) => {
    db.all('SELECT * FROM items', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// API to add a new item
app.post('/items', (req, res) => {
    const newItem = req.body.item;
    db.run('INSERT INTO items (item) VALUES (?)', [newItem], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.send('Item added successfully');
    });
});

// API to delete an item
app.delete('/items/:id', (req, res) => {
    const itemId = req.params.id;
    db.run('DELETE FROM items WHERE id = ?', itemId, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.send('Item deleted successfully');
    });
});

// API to update an item (not implemented in frontend)
app.put('/items/:id', (req, res) => {
    const itemId = req.params.id;
    const newItem = req.body.item;
    db.run('UPDATE items SET item = ? WHERE id = ?', [newItem, itemId], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.send('Item updated successfully');
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});