const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;
const DB_FILE = path.join(__dirname, 'db.json');

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ler Banco
function readDatabase() {
    if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, JSON.stringify({ alunos: [] }, null, 2));
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
}

// Salvar Banco
function salvarBancoDados(dados) {
    fs.writeFileSync(DB_FILE, JSON.stringify(dados, null, 2));
}

// CREATE - POST
app.post('/api/alunos', (req, res) => {
    const { nome, email, curso, telefone, anos, Cpf } = req.body;

    if (!nome || !email || !curso || !telefone || !anos || !Cpf) {
        return res.status(400).json({ erro: 'Todos os campos são obrigatórios!' });
    }

    const db = readDatabase();
    const nextId = db.alunos.length > 0 ? Math.max(...db.alunos.map(a => a.id)) + 1 : 1;

    const novoAluno = { id: nextId, nome, email, curso, telefone, anos, Cpf };
    db.alunos.push(novoAluno);
    salvarBancoDados(db);

    res.status(201).json(novoAluno);
});

// READ - GET
app.get('/api/alunos', (req, res) => {
    const db = readDatabase();
    res.json(db.alunos);
});

// UPDATE - PUT
app.put('/api/alunos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { nome, email, curso, telefone, anos, Cpf } = req.body;
    const db = readDatabase();

    const index = db.alunos.findIndex(a => a.id === id);
    if (index === -1) {
        return res.status(404).json({ erro: 'Aluno não encontrado!' });
    }

    if (!nome || !email || !curso || !telefone || !anos || !Cpf) {
        return res.status(400).json({ erro: 'Todos os campos são obrigatórios!' });
    }

    db.alunos[index] = { ...db.alunos[index], nome, email, curso, telefone, anos, Cpf };
    salvarBancoDados(db);

    res.json(db.alunos[index]);
});

// DELETE - DELETE
app.delete('/api/alunos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const db = readDatabase();

    const index = db.alunos.findIndex(a => a.id === id);
    if (index === -1) {
        return res.status(404).json({ erro: 'Aluno não encontrado!' });
    }

    db.alunos.splice(index, 1);
    salvarBancoDados(db);

    res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});