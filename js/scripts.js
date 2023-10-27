//////////// Seleção de elementos e Variáveis da aplicação ////////////
const todoForm = document.querySelector('#todo-form');
const todoInput = document.querySelector('#todo-input');
const todoList = document.querySelector('#todo-list');
const editForm = document.querySelector('#edit-form');
const editInput = document.querySelector('#edit-input');
const cancelEditBtn = document.querySelector('#cancel-edit-btn');
const filterSelect = document.querySelector('#filter-select');

let targetEl; // Identificar o elemento que foi clicado     
let parentEl; // Seletor para identificar a div mais próximo de onde foi clicado
let todoTitle; // variável para receber o título antes da edição
//let oldInputValue;
let registers; // Variável para armazenar temporariamente o contador de registros
let idEdit;
let todoItem = { id: '', task: '', status: "Open" }

////////////////////////////////////
//////////// Funções ////////////
/** Função para salvar tarefa */
function saveTodo(todo) {

    // Efetuar a contagem de registros
    if(Object.keys(localStorage).length == 0){
        localStorage.setItem("reg", 0);
        registers = 1;
    }else {
        registers = Number(localStorage.getItem("reg")) + 1;
    }
    
    // Array para receber os valores
    todoItem = {
        id: registers,
        task: todo,
        status: "Open"
    };

    // Salva o item de tarefa no localstorage
    localStorage.setItem(todoItem.id, JSON.stringify(todoItem));

    // Salva o item contador no localstorage
    localStorage.setItem("reg", Number(localStorage.getItem("reg")) + 1);

    // Recarrega o código
    location.reload();

}


/** Função para carregar as tarefas */
function load (){

    // Busca e transforma o localstorage em objeto
    const keys = Object.keys(localStorage);
       
    // Efetua a leitura dos itens do localstorage
    for(let k = 0; k < keys.length; k++){

        // Verifica excluindo o registro contador
        if(keys[k] != "reg"){

            // Verifica excluindo os itens que já foram deletados em algum momento
            if(localStorage.getItem(k) != "0000000000"){

                // Verifica o status da tarefa observando se nela existe o texto "Closed"
                if(localStorage.getItem(k).includes("Closed")){
                    
                    // Espera o documento ser carregado para então marcar as tarefas que estão concluídas
                    document.addEventListener("DOMContentLoaded", () =>  document.getElementById(k).classList.add("done"));
                }

                // Chama a função carregando os itens
                let n = JSON.parse(localStorage.getItem(k))
                renderItems(n);
            }

        }
    }
}


/** Função para gerar o HTML das tarefas */
function renderItems(item){

    // Valida se chegou informação válida
    if( item != null){

        let text = `<div class="todo" id="${item.id}">
        <h3>${item.task}</h3>
        <button class="finish-todo">
        <i class="fa-solid fa-check"></i>
        </button>
        <button class="edit-todo">
        <i class="fa-solid fa-pen"></i>
        </button>
        <button class="remove-todo">
        <i class="fa-solid fa-xmark"></i>
        </button>
        </div>`;
        
        // Insere o html na posição depois de iniciar o objeto selecionado
        todoList.insertAdjacentHTML("afterbegin", text);
    }
}


/** Função para esconder/apresentar os formulários */
const toggleForms = () => {
    editForm.classList.toggle("hide");
    todoForm.classList.toggle("hide");
    //todoList.classList.toggle("hide");

}


/** Função para atualizar o novo valor da tarefa */
const updateTodo = (id, text) => {

    todoItem = {
        id: Number(id),
        task: text,
        staus: 'Open'
    };

    // Armazena a tarefa
    localStorage.setItem(id, JSON.stringify(todoItem));

    // Carrega a tela novamente
    load();

}


/** Função para marcar como finalizado a tarefa */
function done(id){
    // Array com os valores da tarefa
    if(id){

        todoItem = {
            id: Number(id),
            task: todoTitle,
            staus: parentEl.classList.contains("done")? "Closed" : "Open"
        };
    
        // Armazena a tarefa
        localStorage.setItem(id, JSON.stringify(todoItem));
    }
}


////////////////////////////////////
//////////// Eventos ////////////
/** Evento para identificar onde foi clicado */
document.addEventListener("click", (e) => {
    targetEl = e.target; // identifica o elemento que foi clicado     
    parentEl = targetEl.closest("div");// identifica a div mais próximo de onde foi clicado

    // verifica se existe um título e se contém h3 próximo
    if(parentEl && parentEl.querySelector("h3")){
        todoTitle = parentEl.querySelector("h3").innerText;
    }

    // verifica o elemento clicado tem a classe
    if(targetEl.classList.contains("finish-todo")){
        parentEl.classList.toggle("done");
        
        // Chama a função para marcar como finalizado a
        done(parentEl.id);       
        
    }

    // Verifica se foi clicado no botão de remoção
    if(targetEl.classList.contains("remove-todo")){
        // Marca com zeros os itens que serão "removidos"
        localStorage.setItem(parentEl.id,"0000000000")

        // remove a lista no html
        parentEl.remove();

    }

    // Verifica se foi clicado no botão de edição
    if(targetEl.classList.contains("edit-todo")){

        if(!parentEl.classList.contains("done")){
            // Chama a função para listar/esconder o formulário de edição
            toggleForms();

            // Armazena pega o novo valor digitado
            editInput.value = todoTitle;
            
            // Pega o id da tarefa clicada
            idEdit = parentEl.id;

            // Adiciona a classe para destacar o element em edição
            document.getElementById(idEdit).classList.add("edit");
            
            // Desabilita os botões das tarefas
            let ele = todoList.getElementsByTagName("button");
            for(let i=0; i < ele.length; i++){
                ele[i].disabled = true;
                
            }
        }

    }
});


/** Evento do botão de edição */
editForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Armazenda o novo valor informado
    let editInputValue = editInput.value;

    // Pega o id da tarefa
    console.log(idEdit)
    
    // Valida a tarefa que esta em edição e faz a alteração no localstorage
    if(editInputValue){
        updateTodo(idEdit, editInputValue);
    }

    // Chama a função para listar/esconder o formulário de edição
    toggleForms();

    // Recarrega a página
    location.reload();
});


/** Evento para salvar a tarefa */
todoForm.addEventListener("submit", (e) => {
    // Previne a execução padrão do formulário
    e.preventDefault();
    
    // Armazena o valor temporariamente
    let inputValue = todoInput.value

    // Valida se possui valor no input e chama a função para salvar
    if(inputValue){
        saveTodo(inputValue)
    }
})



/** Evento para filtrar conforme status da tarefa */
filterSelect.addEventListener("change", ()=>{

    let text = filterSelect.value; // Variável para salvar o valor digitado
    let divsTodo = document.querySelectorAll(".todo"); // seleciona os elementos com a classe

    // Efetua validações de acordo com o status selecionado
    // Na sequência aplica classes para o comportamento do elemento
    if(text == "done"){
        for(let x = 0; x < divsTodo.length; x++){
           if(!divsTodo[x].classList.contains("done")){
               divsTodo[x].style.display = "none";
    
           }else{
                divsTodo[x].style.display = "flex";
           }
        }

    }else if (text == "todo"){
        for(let x = 0; x < divsTodo.length; x++){
            //divs[x].style.display = "none";
            if(divsTodo[x].classList.contains("done")){
                divsTodo[x].style.display = "none";
     
            }else{
                divsTodo[x].style.display = "flex";
           }
         }

    }else{
        for(let x = 0; x < divsTodo.length; x++){
            divsTodo[x].style.display = "flex";
            
        }
    }
});


/** Evento do botão de cancelar edição */
cancelEditBtn.addEventListener("click", (e) =>{
    // Previne a execução padrão do formulário
    e.preventDefault();

    // Chama a função para listar/esconder o formulário de edição 
    toggleForms();

    // Ativa novamente os botões que estavam desabilitados
    let ele = todoList.getElementsByTagName("button");
    for(let i=0; i < ele.length; i++){
        ele[i].disabled = false;
        
    }

    // Remove a classe do elemento que estava em edição
    document.getElementById(idEdit).classList.remove("edit");
});




////////////////////////////////////////////////
//////////// Aplicação inicio ////////////
load();