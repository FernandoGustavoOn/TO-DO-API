// Configuração da API
const API_BASE_URL = '/api/todos';

// Estado da aplicação
let todos = [];
let currentFilter = 'all';
let editingTodoId = null;

// Elementos DOM
const todoForm = document.getElementById('todoForm');
const todosList = document.getElementById('todosList');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const errorMessage = document.getElementById('errorMessage');
const emptyState = document.getElementById('emptyState');
const editModal = document.getElementById('editModal');
const editForm = document.getElementById('editForm');
const closeModal = document.getElementById('closeModal');
const cancelEdit = document.getElementById('cancelEdit');

// Elementos de estatísticas
const totalTasks = document.getElementById('totalTasks');
const pendingTasks = document.getElementById('pendingTasks');
const completedTasks = document.getElementById('completedTasks');

// Filtros
const filterButtons = document.querySelectorAll('.filter-btn');

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', () => {
    loadTodos();
    setupEventListeners();
});

// Configurar event listeners
function setupEventListeners() {
    // Formulário de nova tarefa
    todoForm.addEventListener('submit', handleCreateTodo);
    
    // Formulário de edição
    editForm.addEventListener('submit', handleUpdateTodo);
    
    // Modal
    closeModal.addEventListener('click', closeEditModal);
    cancelEdit.addEventListener('click', closeEditModal);
    
    // Fechar modal clicando fora
    editModal.addEventListener('click', (e) => {
        if (e.target === editModal) {
            closeEditModal();
        }
    });
    
    // Filtros
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            currentFilter = btn.dataset.filter;
            updateFilterButtons();
            renderTodos();
        });
    });
    
    // ESC para fechar modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !editModal.classList.contains('hidden')) {
            closeEditModal();
        }
    });
}

// Carregar todas as tarefas
async function loadTodos() {
    showLoading(true);
    hideError();
    
    try {
        const response = await fetch(API_BASE_URL);
        
        if (!response.ok) {
            throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }
        
        todos = await response.json();
        renderTodos();
        updateStats();
        
    } catch (err) {
        showError('Erro ao carregar tarefas: ' + err.message);
        console.error('Erro ao carregar tarefas:', err);
    } finally {
        showLoading(false);
    }
}

// Criar nova tarefa
async function handleCreateTodo(e) {
    e.preventDefault();
    
    const title = document.getElementById('todoTitle').value.trim();
    const description = document.getElementById('todoDescription').value.trim();
    
    if (!title) {
        showError('O título é obrigatório!');
        return;
    }
    
    const newTodo = {
        title: title,
        description: description || null,
        isCompleted: false
    };
    
    try {
        showLoading(true);
        
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newTodo)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Erro ${response.status}`);
        }
        
        const createdTodo = await response.json();
        todos.push(createdTodo);
        
        // Limpar formulário
        todoForm.reset();
        
        renderTodos();
        updateStats();
        
        // Mostrar sucesso
        showSuccess('Tarefa criada com sucesso!');
        
    } catch (err) {
        showError('Erro ao criar tarefa: ' + err.message);
        console.error('Erro ao criar tarefa:', err);
    } finally {
        showLoading(false);
    }
}

// Atualizar tarefa
async function handleUpdateTodo(e) {
    e.preventDefault();
    
    const id = parseInt(document.getElementById('editId').value);
    const title = document.getElementById('editTitle').value.trim();
    const description = document.getElementById('editDescription').value.trim();
    const isCompleted = document.getElementById('editIsCompleted').checked;
    
    if (!title) {
        showError('O título é obrigatório!');
        return;
    }
    
    const updatedTodo = {
        id: id,
        title: title,
        description: description || null,
        isCompleted: isCompleted
    };
    
    try {
        showLoading(true);
        
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedTodo)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Erro ${response.status}`);
        }
        
        // Atualizar tarefa na lista
        const index = todos.findIndex(todo => todo.id === id);
        if (index !== -1) {
            todos[index] = { ...updatedTodo };
        }
        
        closeEditModal();
        renderTodos();
        updateStats();
        
        showSuccess('Tarefa atualizada com sucesso!');
        
    } catch (err) {
        showError('Erro ao atualizar tarefa: ' + err.message);
        console.error('Erro ao atualizar tarefa:', err);
    } finally {
        showLoading(false);
    }
}

// Deletar tarefa
async function deleteTodo(id) {
    if (!confirm('Tem certeza que deseja excluir esta tarefa?')) {
        return;
    }
    
    try {
        showLoading(true);
        
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }
        
        // Remover tarefa da lista
        todos = todos.filter(todo => todo.id !== id);
        
        renderTodos();
        updateStats();
        
        showSuccess('Tarefa excluída com sucesso!');
        
    } catch (err) {
        showError('Erro ao excluir tarefa: ' + err.message);
        console.error('Erro ao excluir tarefa:', err);
    } finally {
        showLoading(false);
    }
}

// Alternar status de conclusão
async function toggleTodoStatus(id) {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    
    const updatedTodo = {
        ...todo,
        isCompleted: !todo.isCompleted
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedTodo)
        });
        
        if (!response.ok) {
            throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }
        
        // Atualizar tarefa na lista
        const index = todos.findIndex(t => t.id === id);
        if (index !== -1) {
            todos[index] = updatedTodo;
        }
        
        renderTodos();
        updateStats();
        
    } catch (err) {
        showError('Erro ao atualizar status: ' + err.message);
        console.error('Erro ao atualizar status:', err);
    }
}

// Abrir modal de edição
function openEditModal(todo) {
    editingTodoId = todo.id;
    
    document.getElementById('editId').value = todo.id;
    document.getElementById('editTitle').value = todo.title;
    document.getElementById('editDescription').value = todo.description || '';
    document.getElementById('editIsCompleted').checked = todo.isCompleted;
    
    editModal.classList.remove('hidden');
    document.getElementById('editTitle').focus();
}

// Fechar modal de edição
function closeEditModal() {
    editModal.classList.add('hidden');
    editingTodoId = null;
    editForm.reset();
}

// Renderizar lista de tarefas
function renderTodos() {
    const filteredTodos = getFilteredTodos();
    
    if (filteredTodos.length === 0) {
        todosList.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }
    
    emptyState.classList.add('hidden');
    
    todosList.innerHTML = filteredTodos.map(todo => `
        <div class="todo-item ${todo.isCompleted ? 'completed' : ''}">
            <div class="todo-header">
                <h3 class="todo-title">${escapeHtml(todo.title)}</h3>
                <div class="todo-actions">
                    <button class="btn btn-success btn-sm" onclick="toggleTodoStatus(${todo.id})" title="${todo.isCompleted ? 'Marcar como pendente' : 'Marcar como concluída'}">
                        <i class="fas ${todo.isCompleted ? 'fa-undo' : 'fa-check'}"></i>
                    </button>
                    <button class="btn btn-primary btn-sm" onclick="openEditModal(${JSON.stringify(todo).replace(/"/g, '&quot;')})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteTodo(${todo.id})" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            ${todo.description ? `<p class="todo-description">${escapeHtml(todo.description)}</p>` : ''}
            <div class="todo-meta">
                <div class="todo-status">
                    <span class="status-badge ${todo.isCompleted ? 'status-completed' : 'status-pending'}">
                        <i class="fas ${todo.isCompleted ? 'fa-check-circle' : 'fa-clock'}"></i>
                        ${todo.isCompleted ? 'Concluída' : 'Pendente'}
                    </span>
                </div>
                <small>Criada em: ${formatDate(new Date())}</small>
            </div>
        </div>
    `).join('');
}

// Obter tarefas filtradas
function getFilteredTodos() {
    switch (currentFilter) {
        case 'pending':
            return todos.filter(todo => !todo.isCompleted);
        case 'completed':
            return todos.filter(todo => todo.isCompleted);
        default:
            return todos;
    }
}

// Atualizar botões de filtro
function updateFilterButtons() {
    filterButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === currentFilter);
    });
}

// Atualizar estatísticas
function updateStats() {
    const total = todos.length;
    const pending = todos.filter(todo => !todo.isCompleted).length;
    const completed = todos.filter(todo => todo.isCompleted).length;
    
    totalTasks.textContent = total;
    pendingTasks.textContent = pending;
    completedTasks.textContent = completed;
}

// Utilitários de UI
function showLoading(show) {
    loading.classList.toggle('hidden', !show);
}

function showError(message) {
    errorMessage.textContent = message;
    error.classList.remove('hidden');
    
    // Auto-hide após 5 segundos
    setTimeout(() => {
        hideError();
    }, 5000);
}

function hideError() {
    error.classList.add('hidden');
}

function showSuccess(message) {
    // Criar notificação de sucesso temporária
    const notification = document.createElement('div');
    notification.className = 'notification success';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        ${message}
    `;
    
    // Estilos para a notificação
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: '#28a745',
        color: 'white',
        padding: '15px 20px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        zIndex: '9999',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        animation: 'fadeIn 0.3s ease'
    });
    
    document.body.appendChild(notification);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Utilitários
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(date) {
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Adicionar animação fadeOut para notificações
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(style);
