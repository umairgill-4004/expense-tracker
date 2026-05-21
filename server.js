const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL || "mongodb://mongo-service:27017/expenses");

const Expense = mongoose.model("Expense", {
  title: String,
  amount: Number
});

app.get("/", (req, res) => {
  res.send("Expense Tracker App Running Successfully");
});

app.post("/expenses", async (req, res) => {
  const expense = await Expense.create(req.body);
  res.json(expense);
});

app.get("/expenses", async (req, res) => {
  const expenses = await Expense.find();
  res.json(expenses);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
