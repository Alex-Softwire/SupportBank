
export class Person {
    constructor(Name,amount_owed,transactions_to,transactions_from) {
        this.Name = Name;
        this.amount_owed = amount_owed;
        this.transactions_to = transactions_to;
        this.transactions_from = transactions_from;
    }

    listalltransactions() {
        console.log("\nTransactions 'to' for " + this.Name )
        for (let k = 0; k < this.transactions_to.length; k++) {
            console.log(this.transactions_to[k].transaction_to_string())
        }
        console.log("\nTransactions 'from' for " + this.Name )
        for (let j = 0; j < this.transactions_from.length; j++) {
            console.log(this.transactions_from[j].transaction_to_string())
        }
    }

    calculateowes() {
        for (let i = 0; i < this.transactions_to.length; i++) {
            this.transactions_to[i].amount_checknumber()
            this.amount_owed -= parseFloat(this.transactions_to[i].Amount)
        }
        for (let i = 0; i < this.transactions_from.length; i++) {
            this.transactions_from[i].amount_checknumber()
            this.amount_owed += parseFloat(this.transactions_from[i].Amount)
        }
    }

    displayowes() {
        console.log(this.Name + " owes £" + this.amount_owed.toFixed(2))
    }
}