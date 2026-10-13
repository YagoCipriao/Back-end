const API_URL = 'http://localhost:3000/api/alunos';

const form = document.getElementById('aluno-form');
const btnCancel = document.getElementById('btn-cancel');
const btnSave = document.getElementById('btn-save');
const tbody = document.getElementById('alunos-tbody');

// Campos do formulário
const inputId = document.getElementById('aluno-id');
const inputNome = document.getElementById('nome');
const inputEmail = document.getElementById('email');
const inputCurso = document.getElementById('curso');
const inputTelefone = document.getElementById('telefone');
const inputAnos = document.getElementById('anos');
const inputCpf = document.getElementById('CPF'); // Mantido 'CPF' como no HTML

// Estado de edição
let editandoId = null;

// ===============================
// READ - Listar Alunos (GET)
// ===============================
async function carregarAlunos() {
    try {
        const resposta = await fetch(API_URL);
        const alunos = await resposta.json();

        tbody.innerHTML = '';

        if (!alunos || alunos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;">Nenhum aluno cadastrado.</td></tr>';
            return;
        }

        alunos.forEach(aluno => {
            const tr = document.createElement('tr');

            tr.innerHTML = `
                <td>#${aluno.id}</td>
                <td>${aluno.nome}</td>
                <td>${aluno.email}</td>
                <td>${aluno.curso}</td>
                <td>${aluno.telefone}</td>
                <td>${aluno.anos}</td>
                <td>${aluno.Cpf}</td>
                <td class="actions">
                    <button class="btn-icon btn-edit" onclick="iniciarEdicao(${aluno.id})">Editar</button>
                    <button class="btn-icon btn-delete" onclick="deletarAluno(${aluno.id})">Excluir</button>
                </td>
            `;

            tbody.appendChild(tr);
        });

    } catch (erro) {
        console.error('Erro ao buscar alunos:', erro);
    }
}

// ===============================
// PREPARAR EDIÇÃO
// ===============================
async function iniciarEdicao(id) {
    try {
        const resposta = await fetch(API_URL);
        const alunos = await resposta.json();
        const aluno = alunos.find(a => a.id === id);

        if (!aluno) {
            alert('Aluno não encontrado!');
            return;
        }

        editandoId = aluno.id;
        inputId.value = aluno.id;
        inputNome.value = aluno.nome;
        inputEmail.value = aluno.email;
        inputTelefone.value = aluno.telefone;
        inputAnos.value = aluno.anos;
        inputCpf.value = aluno.Cpf;
        inputCurso.value = aluno.curso;

        btnSave.textContent = 'Atualizar Aluno';
        btnCancel.style.display = 'inline-block';
        inputNome.focus();
    } catch (erro) {
        console.error('Erro ao preparar edição:', erro);
    }
}

// ===============================
// CREATE & UPDATE (POST / PUT)
// ===============================
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Mapeamento correto exigido pelas validações do backend
    const aluno = {
        nome: inputNome.value,
        email: inputEmail.value,
        curso: inputCurso.value,
        telefone: inputTelefone.value,
        anos: inputAnos.value,
        Cpf: inputCpf.value
    };

    try {
        if (editandoId) {
            await fetch(`${API_URL}/${editandoId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(aluno)
            });
        } else {
            await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(aluno)
            });
        }

        resetarFormulario();
        await carregarAlunos(); // Atualiza a tabela na tela imediatamente
    } catch (erro) {
        console.error('Erro ao salvar:', erro);
        alert('Erro ao salvar os dados no servidor!');
    }
});

// ===============================
// DELETE (DELETE)
// ===============================
async function deletarAluno(id) {
    if (confirm('Deseja realmente excluir este aluno?')) {
        try {
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            await carregarAlunos(); // Atualiza a tabela na tela imediatamente
        } catch (erro) {
            console.error('Erro ao deletar aluno:', erro);
        }
    }
}

// ===============================
// LIMPAR / RESETAR FORMULÁRIO
// ===============================
function resetarFormulario() {
    editandoId = null;
    inputId.value = '';
    form.reset();
    btnSave.textContent = 'Salvar Aluno';
    btnCancel.style.display = 'none';
}

btnCancel.addEventListener('click', resetarFormulario);

// Inicializa a listagem de alunos ao abrir a página
carregarAlunos();