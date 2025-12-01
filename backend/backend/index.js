const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const DB_PATH = path.join(__dirname, "db.json");

function loadDB() {
  return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
}

function saveDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

app.get("/tarefas", (req, res) => {
  const db = loadDB();
  res.json(db.tarefas);
});

app.post("/tarefas", (req, res) => {
  const db = loadDB();
  const { titulo } = req.body;
  if (!titulo) return res.status(400).json({ erro: "Título obrigatório" });

  const novaTarefa = { id: Date.now(), titulo, concluida: false };
  db.tarefas.push(novaTarefa);
  saveDB(db);
  res.status(201).json(novaTarefa);
});

app.put("/tarefas/:id", (req, res) => {
  const db = loadDB();
  const tarefa = db.tarefas.find(t => t.id == req.params.id);

  if (!tarefa) return res.status(404).json({ erro: "Tarefa não encontrada" });

  tarefa.concluida = !tarefa.concluida;
  saveDB(db);
  res.json(tarefa);
});

app.delete("/tarefas/:id", (req, res) => {
  const db = loadDB();
  db.tarefas = db.tarefas.filter(t => t.id != req.params.id);
  saveDB(db);
  res.json({ mensagem: "Tarefa removida" });
});

app.listen(3000, () => console.log("API rodando na porta 3000"));
