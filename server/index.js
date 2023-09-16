import express from "express";
// const express = require("express");
import sql from "./db.js";
import cors from "cors"

const app = express();

app.get("/", (req, res) => {
    res.send("Hello")
})

app.use(
    cors({
      origin: ["http://localhost:5173"],
    })
  );

app.use(express.json())

app.get("/api/todos", async (req, res) => {
  console.log("todos")

    // const todos = await sql`SELECT * FROM todos`
    // console.log(todos)
    // if (todos){
    //     res.status(200).send(todos)
    // } else {
    //     res.status(404).send("Errorrrrrrr. Leave the planet")       
    // }
})

app.post("/api/todos2", async (req, res) => {
    const { task, is_completed } = req.body
    const todos2 = await sql `INSERT INTO todos (task, is_completed) VALUES (${task}, ${is_completed}) RETURNING *`
    // console.log(todos2)
    if (todos2){
        res.status(201).send(todos2)
    } else {
        res.status(500).send("Internal server Error")
    }
})

app.put("/api/todos2/:id", async (req, res) => {
  const { id } = req.params;
  const { task, is_completed } = req.body;

  try {
    const updatedTodo = await sql`
      UPDATE todos
      SET task = ${task}, is_completed = ${is_completed}
      WHERE id = ${id}
      RETURNING *
    `;

    if (updatedTodo && updatedTodo.length > 0) {
      res.status(200).json(updatedTodo[0]);
    } else {
      res.status(404).send("Todo not found");
    }
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(500).send("Internal server error");
  }
});


app.delete("/api/todos2/:id", async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedTodo = await sql`DELETE FROM todos WHERE id = ${id} RETURNING *`;
      
      if (deletedTodo && deletedTodo.length > 0) {
        res.status(200).json(deletedTodo[0]);
      } else {
        res.status(404).send("Todo not found");
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
      res.status(500).send("Internal server error");
    }
  });
  
app.listen(3000, () => {
    console.log("Server is running on port 3000")
});