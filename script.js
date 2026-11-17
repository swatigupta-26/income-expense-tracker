
const transactionForm = document.getElementById("transaction-form");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");

const totalIncome = document.getElementById("total-income");
const totalExpenses = document.getElementById("total-expenses");
const balance = document.getElementById("balance");

const transactionList = document.getElementById("transaction-list");
const errorMessage = document.getElementById("error-message");

// Store transactions
let transactions = [];

// Add today's date automatically
dateInput.valueAsDate = new Date();

// Handle form submission
transactionForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const description = descriptionInput.value.trim();
    const amount = Number(amountInput.value);
    const type = typeInput.value;
    const category = categoryInput.value;
    const date = dateInput.value;

    // Form validation
    if (!description || !amountInput.value || !type || !category || !date) {
        errorMessage.textContent = "Please fill in all fields.";
        return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
        errorMessage.textContent = "Please enter an amount greater than zero.";
        return;
    }

    errorMessage.textContent = "";

    // Create transaction
    const transaction = {
        id: Date.now(),
        description: description,
        amount: amount,
        type: type,
        category: category,
        date: date
    };

    transactions.push(transaction);

    updateApp();

    // Clear form
    transactionForm.reset();
    dateInput.valueAsDate = new Date();
});

// Update transaction list and summary
function updateApp() {
    displayTransactions();
    updateSummary();
}

// Display transactions
function displayTransactions() {
    transactionList.innerHTML = "";

    if (transactions.length === 0) {
        transactionList.innerHTML =
            '<p class="empty-message">No transactions yet. Add your first transaction!</p>';
        return;
    }

    transactions.forEach(function (transaction) {
        const item = document.createElement("div");
        item.className = "transaction-item";

        const info = document.createElement("div");
        info.className = "transaction-info";

        const title = document.createElement("h3");
        title.textContent = transaction.description;

        const details = document.createElement("p");
        details.textContent =
            transaction.category + " • " + transaction.date;

        info.appendChild(title);
        info.appendChild(details);

        const right = document.createElement("div");
        right.className = "transaction-right";

        const amount = document.createElement("span");
        amount.className =
            transaction.type === "income" ? "income-text" : "expense-text";

        const sign = transaction.type === "income" ? "+" : "-";
        amount.textContent =
            sign + "₹" + transaction.amount.toFixed(2);

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function () {
            deleteTransaction(transaction.id);
        });

        right.appendChild(amount);
        right.appendChild(deleteButton);

        item.appendChild(info);
        item.appendChild(right);

        transactionList.appendChild(item);
    });
}

// Calculate summary
function updateSummary() {
    let income = 0;
    let expenses = 0;

    transactions.forEach(function (transaction) {
        if (transaction.type === "income") {
            income += transaction.amount;
        } else {
            expenses += transaction.amount;
        }
    });

    totalIncome.textContent = "₹" + income.toFixed(2);
    totalExpenses.textContent = "₹" + expenses.toFixed(2);
    balance.textContent = "₹" + (income - expenses).toFixed(2);
}

// Delete transaction
function deleteTransaction(id) {
    transactions = transactions.filter(function (transaction) {
        return transaction.id !== id;
    });

    updateApp();
}
