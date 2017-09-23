const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs');
const _ = require('underscore')

const data = fs.readFileSync('./data.json')

var todoItems = JSON.parse(data.toString())

// add your code here
app.use(bodyParser.json());
//respond with generic object
app.get('/', function(req, res) {

    res.status(200).send('ok')

})

//Read all todo Items from list
app.get('/api/TodoItems', function(req, res) {

        res.status(200).json(todoItems);

    })
    //read single ToDo item from list
app.get('/api/TodoItems/:number', function(req, res) {
        //store user 'number' into variable
        const todoId = parseInt(req.params.number)
        const match = _.findWhere(todoItems, { todoItemId: todoId })

        if (match) {
            res.json(match)
        }


    })
    //create single to do item
app.post('/api/TodoItems/', function(req, res) {
        let newId = todoItems[todoItems.length - 1].todoItemId;
        newId += 1

        let todo = req.body
        var todoItem = {
            todoItemId: newId,
            name: todo.name,
            priority: todo.priority,
            completed: todo.completed
        }

        todoItems.push(todoItem)

        res.json(todoItems);

        fs.writeFile('./data.json', JSON.stringify(todoItems))

    })
    //delete single todo item
app.delete('/api/TodoItems/:number', function(req, res) {
    var deleteIndex = todoItems.findIndex(function(todo) {
        return todo.todoItemId === parseInt(req.params.number)
    })

    if (deleteIndex >= 0) {
        let deleted = todoItems.splice(deleteIndex, 1)
        fs.writeFileSync('./data.json', JSON.stringify(todoItems, null, 2))
        return res.json(deleted)
    }



})



module.exports = app;