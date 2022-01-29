let mainBudget = [];
let mainExpense = [];
const mainBudgetHandler = MainBudgetHandler()




const addBudgetBtn = document.querySelector('.add-budget');
    addBudgetBtn.addEventListener('click',()=>{
        const modal = document.querySelectorAll('.modal-container')
        openModalHandler(modal[0])
    })
function showErrorModal(){
    const modal = document.querySelectorAll('.modal-container')
    openModalHandler(modal[3])
}

document.addEventListener('click',function(){
    if(event.target.classList.contains('view-expense')){
        const modal = document.querySelectorAll('.modal-container');
        onViewExpenseHandler(event.target);
        openModalHandler(modal[2]);

    }
    if(event.target.classList.contains('delete-budget')){
        const budgetId = event.target.dataset.budgetId;
        const modal = event.target.parentElement.parentElement;
        //  menghapus value pada add expense
        mainBudgetHandler.deleteBudget(budgetId);
        makeSelectValueHandler();
        closeModalHandler(modal);
    }
    if(event.target.classList.contains('add-expense')){
        const modal = document.querySelectorAll('.modal-container')
        closeModalHandler(modal[2]);
        openModalHandler(modal[1]);

    }
    if(event.target.classList.contains('remove-expense')){
       const tag = event.target.dataset.tag;
       const id = event.target.dataset.budgetId;
       const budgetCard = document.getElementsByClassName(id);
       const budgetAmount = budgetCard[0].querySelector('.budget-amount');
       mainBudgetHandler.deleteExpense(tag);
       onViewExpenseHandler(event.target);
       setProgressBarWidth(id);
       budgetAmount.innerHTML = getTotalExpense(id);
    }

})


function openModalHandler(modal){
    // memberi display block
    modal.style.display = 'block'
    // menyembunyikan modal
    const closeModalBtn = modal.querySelector('.close-modal')
   closeModalBtn.addEventListener('click',()=>{
       closeModalHandler(modal)
   })
    //sembunyikan modal apabila area selain modal di klik
   window.addEventListener('click',()=>{
    if(event.target == modal){
        closeModalHandler(modal);
    }
})
}
function closeModalHandler(modal){
    modal.style.display = 'none';
}





const addBudgetForm = document.querySelector('.add-budget-form');
addBudgetForm.addEventListener('submit',function(e){
    const modal = this.parentElement.parentElement.parentElement;
    e.preventDefault();
    // passing modal to be closed after form are submitted
    onAddBudgetFormSubmitHandler(modal);
})
function onAddBudgetFormSubmitHandler(modal){
    const name = addBudgetForm.querySelector('.budget-name-input')
    const max = addBudgetForm.querySelector('.budget-max-input')
    const budget ={
        id: Date.now(),
        name: name.value,
        max: max.value,
    }
    mainBudgetHandler.addBudget(budget);
    name.value ='';
    max.value ='';
    
    makeSelectValueHandler();
    makeBudgetCardHandler(budget);
    closeModalHandler(modal); 
}
function makeBudgetCardHandler(budget){
    const mainSection = document.querySelector('.main-section');
    const budgetcard =document.createElement('div');
        budgetcard.classList.add('budget-card');
        budgetcard.classList.add(`${budget.id}`);
        budgetcard.innerHTML = makeBudgetCard(budget);
    
    mainSection.appendChild(budgetcard);
}
function makeBudgetCard(budget){
    return`<div class="budget-card-header">
                <h3 class="budget-title">${budget.name}</h3>
                <p class="budget-condition">
                    Rp<span class='budget-amount'>0</span>
                    <span class='budget-max'>/Rp${budget.max}</span></p>
            </div>
            <div class="budget-card-body">
                <div class="progress-bar-container">
                    <div class="progress"></div>
                </div>
            </div>
            <div class="budget-card-footer">
                <button class="btn secondary-btn view-expense" data-budget-id=${budget.id}>View Expenses</button>
                <button class="btn secondary-btn delete-budget" data-budget-id=${budget.id}>Delete Budget</button>
            </div>`
}




const addExpenseForm = document.querySelector('.add-expense-form');
addExpenseForm.addEventListener('submit',function(e){
    e.preventDefault();
    const modal = this.parentElement.parentElement.parentElement;
    const description = document.querySelector('.expense-desc-input');
    const amount = document.querySelector('.expense-amount-input');
    const expenseAlocation = document.querySelector('.expense-alocation');
    
    const expense = {
        id: expenseAlocation.value,
        tag : Date.now(),
        description : description.value,
        amount : amount.value,
    }
    if(mainBudget.length){
        mainBudgetHandler.addExpenses(expense);
        onAddExpenseHandler(expense.id);
        description.value ='';
        amount.value ='';
        closeModalHandler(modal);
        setProgressBarWidth(expense.id);
    }else{
       showErrorModal();
    }
})



function makeSelectValueHandler(){
  const expenseAlocation = document.querySelector('.expense-alocation');
  expenseAlocation.innerHTML = null;
  mainBudget.forEach((budget)=>{
      const selectValue = document.createElement('option');
        selectValue.setAttribute('value', budget.id);
        selectValue.innerHTML = budget.name;
      expenseAlocation.append(selectValue);
  })
}






function onAddExpenseHandler(id){
    const budgetCard = document.getElementsByClassName(id);
    const budgetAmount = budgetCard[0].querySelector('.budget-amount');
    budgetAmount.innerHTML = getTotalExpense(id);
}
function getTotalExpense(id){
    const expenses = mainExpense.filter(expense =>{
        return expense.id == id;
    })
    const total = [];
    if(expenses.length){
        expenses.forEach((e)=>{
            total.push(parseInt(e.amount));
        });
        return total.reduce((total,i)=>{
            return total + i
        })
    }else{
        return 0
    }
    
}


function setProgressBarWidth(id){
    const budgetCard = document.getElementsByClassName(id);
    const progressBar = budgetCard[0].querySelector('.progress');
        progressBar.style.width = `${getProgressWidth(id)}%`;
        if(getProgressWidth(id) > 50){
            progressBar.style.backgroundColor = 'yellow';
        }
        if(getProgressWidth(id) > 75){
            progressBar.style.backgroundColor = 'crimson';
        }
        if(getProgressWidth(id) < 50){
            progressBar.style.backgroundColor = 'rgb(122, 102, 250)';
        }
        if(getProgressWidth(id) > 100){
           budgetCard[0].style.backgroundColor = 'rgba(220, 20, 60, 0.226)';
        }else{
            budgetCard[0].style.backgroundColor = '#fff';
        }
}
function getProgressWidth(id){
    const budget = mainBudget.find(budget =>{
        return budget.id == id;
    })
    const total = parseInt(budget.max);
    const expense = getTotalExpense(id);
    return (expense / total) * 100;
}

function onViewExpenseHandler(target){
    const id = target.dataset.budgetId;
    const expense = mainExpense.filter(expense =>{
       return expense.id == id;
    })
    const container = document.querySelector('.view-expense-list');
    container.innerHTML = null;
    if(!expense.length){
        container.innerHTML = `<p class=expense-list>You don't have any expense yet</p>`
    }else{
        expense.forEach((e)=>{
            const li = document.createElement('li');
                li.classList.add('expense-list');
                li.innerHTML = makeExpenseCard(e);
            container.appendChild(li);
        })
    }
}
function makeExpenseCard(expense){
    return ` <div class="expense-desc">
    <p class="expense-name">${expense.description}</p>
    <p class="expense-amount">Rp${expense.amount}</p>
    </div>
    <button class="btn ternary-btn remove-expense" data-budget-id=${expense.id} data-tag=${expense.tag}>&times;</button>`
}





function MainBudgetHandler(budget){

    function addBudget(budget){
       mainBudget.push(budget);
    }
    function deleteBudget(budgetId){
       const newBudget = mainBudget.filter(budget =>{
            return budget.id !== parseInt(budgetId)
        })
        
        mainBudget= [...newBudget];
    }
    function addExpenses(expense){
        mainExpense.push(expense);
    }
    function deleteExpense(expenseTag){
        const newExpense = mainExpense.filter(expense =>{
            return expense.tag != expenseTag;
        })
        
        mainExpense= [...newExpense];
    }
    return {
        addBudget,
        deleteBudget,
        addExpenses,
        deleteExpense,
    }
}
