export class transaction {
    constructor(date,from,to,narrative,amount) {
        this.date = date;
        this.from = from;
        this.to = to;
        this.narrative = narrative;
        this.amount = amount;
    }

    transaction_to_string() {
        return "Date: " + this.date + "  From: " + this.from + "  To: " + this.to + "  Narrative: " + this.narrative + "  Amount: " + this.amount
    }

}