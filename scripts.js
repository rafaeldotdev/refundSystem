// Recuperando os elementos.
const form = document.querySelector("form")
const amount = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")
const aside = document.querySelector("aside")

// Recuperando a lista.
const expenseList = document.querySelector("ul")
const dispense = document.querySelector("aside header p span")
const expenseTotal = document.querySelector("aside header h2")

amount.oninput = () => {
  // Obtendo o valor do input.
  let value = amount.value.replace(/\D/g, "")
  amount.value = value
  // Formatando para centavos
  value = Number(value) / 100
  // Formatando para a moeda Local.
  amount.value = formatCurrencyBRL(value)
}

function formatCurrencyBRL(value) {
  value = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })

  return value
}

// Obtem os valores do input.
form.onsubmit = (event) => {
  event.preventDefault()

  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    created_at: new Date().toLocaleString("pt-BR"),
  }

  expenseAdd(newExpense)
}

// Adiciona um novo item na lista (UL).
function expenseAdd(newExpense) {
  try {
    // Cria um elemento Li (item) na nossa Lista (UL).
    const expenseItem = document.createElement("li")
    expenseItem.classList.add("expense")

    // Cria o ícone da categoria.
    const expenseIcon = document.createElement("img")
    expenseIcon.setAttribute("src", `./img/${newExpense.category_id}.svg`)
    expenseIcon.setAttribute("alt", newExpense.category_name)

    // Cria a area (div) da descrição do item.
    const expenseInfo = document.createElement("div")
    expenseInfo.classList.add("expense-info")

    // Cria o nome do item
    const expenseName = document.createElement("strong")
    expenseName.textContent = newExpense.expense

    // Cria a categoria da dispesa
    const expenseCategory = document.createElement("span")
    expenseCategory.textContent = newExpense.category_name

    // Adiciona as informações na DIV.
    expenseInfo.append(expenseName, expenseCategory)

    // Cria a informação de valor
    const expenseAmount = document.createElement("span")
    expenseAmount.classList.add("expense-amount")
    expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount
      .toUpperCase()
      .replace("R$", "")}`

    // Cria o ícon de remover
    const trashIcon = document.createElement("img")
    trashIcon.setAttribute("src", "./img/remove.svg")
    trashIcon.setAttribute("alt", "remover")
    trashIcon.classList.add("remove-icon")

    // Adiciona as informações nos item.
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, trashIcon)

    // Adiciona o item na lista.
    expenseList.append(expenseItem)

    // Chama a função que atualiza a quantidade de itens na lista.
    formClear()
    updateTotals()
    
  } catch (error) {
    console.log(error)
    alert("Não foi possivel concluir a ação. Por favor tente novamente!")
  }
}

// Atualiza quantos itens tem na lista.
function updateTotals() {
  try {
    // Recupera a quantidade de itens da lista.
    const items = expenseList.children
    // Escreve a quantidade de itens.
    dispense.textContent = `${items.length} ${
      items.length > 1 ? "despensas" : "despesa"
    }`

    // variavel para incrementar o total.
    let total = 0

    // Percorre cada LI dentro da UL
    for (let item = 0; item < items.length; item++) {
      const itemAmount = items[item].querySelector(".expense-amount")

      // Remove os CHAR não numéricos e troca a (,) por (.).
      let value = itemAmount.textContent
        .replace(/[^\d,]/g, "")
        .replace(",", ".")

      value = parseFloat(value)

      // Verifica se é um numero.
      if (isNaN(value)) {
        return alert(
          "Não foi possível calcular o total, o valor parece não ser um número"
        )
      }
      // Adiciona o valor total no value.
      total += Number(value)
    }

    // Cria o elemento de Texto estilizado "small".
    const symbolBRL = document.createElement("small")

    // Atribuimos o texto de R$.
    symbolBRL.textContent = "R$"

    // Formatamos e tiramos o R$ por padrao da função formatCurrencyBRL
    total = formatCurrencyBRL(total).toUpperCase().replace("R$", "")

    // Zeramos nosso HTML do expenseTotal
    expenseTotal.innerHTML = ""

    // Adicional o valor no total no texto.
    expenseTotal.append(symbolBRL, total)
  } catch (error) {
    console.log(error)
    alert("Não foi possivel concluir a ação. Por favor tente novamente!")
  }
}

// Evento que captura o click da lista
expenseList.addEventListener("click", (event) => {

  if (event.target.classList.contains("remove-icon")) {
    // Localiza o filho mais perto de ".expense"
    const item = event.target.closest(".expense")

    // Remove item da Lista.
    item.remove()
  }

  // Atualiza a Lista.
  updateTotals()
})


function formClear(){
  expense.value = ""
  category.value = ""
  amount.value = ""

  expense.focus()
}