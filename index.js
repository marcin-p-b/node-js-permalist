import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "YOU PASSWORD",
  port: "5432",
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// let items = [
//   { id: 1, title: "Buy milk" },
//   { id: 2, title: "Go shopping" },
// ];

let items = [];

app.get("/", async (req, res) => {
  const result = await db.query(
    "SELECT * FROM items"
  );
  items=result.rows;
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
  console.log(items);
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  try{
    await db.query("INSERT INTO items (id,title) VALUES($1,$2)",[items.length+1,item]);

  } catch(err){
    await db.query("INSERT INTO items (id,title) VALUES($1,$2)",[items.length+2,item]);
    console.log(err);
  }

  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  const getItemTitle = req.body.updatedItemTitle;
  const getItemId = req.body.updatedItemId;

  try{
    await db.query("UPDATE items SET title=$1 WHERE id=$2",[getItemTitle,getItemId]);

  } catch(err){
    console.log(err);
  }
  res.redirect("/");
});

app.post("/delete", async (req, res) => {
  const deleteItemId = req.body.deleteItemId;

  try{
    await db.query("DELETE FROM items WHERE id=$1",[deleteItemId]);

  } catch(err){
    console.log(err);
  }
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
