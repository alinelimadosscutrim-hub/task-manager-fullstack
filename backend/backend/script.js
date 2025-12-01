const API = "http://localhost:3000/tarefas";

async function carregar() {
  const tarefas = await fetch(API).then(r => r.json());
  const lista = document.getElementById("taskList");

  lista.innerHTML = "";
  tarefas.forEach(t => {
    const li = document.createElement("li");
    li.className = t.concluida ? "concluida" : "";
    li.innerHTML = `
      <span>${t.titulo}</span>
      <div>
        <button onclick="alternar(${t.id})">✓</button>
        <button onclick="remover(${t.id})">✗</button>
      </div>
    `;
    lista.appendChild(li);
  });
}

async function adicionar() {
  const titulo = document.getElementById("taskInput").value;
  if (!titulo.trim()) return;

  await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ titulo })
  });

  document.getElementById("taskInput").value = "";
  carregar();
}

async function alternar(id) {
  await fetch(`${API}/${id}`, { method: "PUT" });
  carregar();
}

async function remover(id) {
  await fetch(`${API}/${id}`, { method: "DELETE" });
  carregar();
}

document.getElementById("addBtn").addEventListener("click", adicionar);
carregar();
