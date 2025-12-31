const express = require('express')
const app = express()

let todos = [
    {
        'id': '101',
        "title": 'Complete Express Project',
        'description': 'Create a TODO app with CRUD operations'
    },
    {
        'id': '102',
        "title": 'Buy Groceries',
        'description': 'Milk, Bread, Fruits'
    },
    {
        'id': '103',
        "title": 'Learn Node.js',
        'description': 'Study advanced Node.js concepts'
    },
]

app.set('view engine', 'ejs');

app.use(express.urlencoded())
app.use(express.json())

// Home route - Display all todos
app.get('/', (req, res) => {
    res.render('index', { todos })
})

// Add todo page
app.get('/add-todo', (req, res) => {
    res.render('addList')
})

// Add todo POST route
app.post('/add-todo', (req, res) => {
    todos.push(req.body)
    res.redirect('/')
})

// Delete todo
app.get('/delete-todo/:id', (req, res) => {
    let id = req.params.id
    todos = todos.filter((todo) => todo.id !== id)
    res.redirect('/')
})

// Edit todo page
app.get('/edit-todo/:id', (req, res) => {
    let id = req.params.id;
    let todo = todos.find((todo) => todo.id == id)
    res.render('editList', { todo })
})

// Update todo
app.post('/update-todo/:id', (req, res) => {
    let id = req.params.id;
    todos = todos.map((todo) => {
        if (todo.id == id) {
            return req.body
        } else {
            return todo
        }
    })
    res.redirect('/')
})

app.use((req, res) => {
    res.status(404).send('Default Route: Page Not Found')
})

app.listen(8080, () => {
    console.log(`http://localhost:8080`)
})