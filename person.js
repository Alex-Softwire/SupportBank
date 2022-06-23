export class person {
    constructor(name,amount_owed,transactions_to,transactions_from) {
        this.name = name;
        this.amount_owed = amount_owed;
        this.transactions_to = transactions_to;
        this.transactions_from = transactions_from;
    }

    list_all_transactions() {
        console.log("\nTransactions 'to' for " + this.name )
        for (let k = 0; k < this.transactions_to.length; k++) {
            console.log(this.transactions_to[k].transaction_to_string())
        }
        console.log("\nTransactions 'from' for " + this.name )
        for (let j = 0; j < this.transactions_from.length; j++) {
            console.log(this.transactions_from[j].transaction_to_string())
        }
    }

    display_amount_owed() {
        console.log(this.name + " owes £" + this.amount_owed.toFixed(2))
    }

    add_transaction(transaction) {
        if (this.name === transaction.to) {
            this.transactions_to.push(transaction)
            this.amount_owed -= parseFloat(transaction.amount)
        }
        else if (this.name = transaction.from) {
            this.transactions_from.push(transaction)
            this.amount_owed += parseFloat(transaction.amount)
        }
    }

}