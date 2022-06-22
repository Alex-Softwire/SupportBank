import log4js from "log4js";
const logger = log4js.getLogger("index.js")

export class Transaction {
    constructor(Date,From,To,Narrative,Amount) {
        this.Date = Date;
        this.From = From;
        this.To = To;
        this.Narrative = Narrative;
        this.Amount = Amount;
    }

    transaction_to_string() {
        return "Date: " + this.Date + "  From:" + this.From + "  To: " + this.To + "  Narrative: " + this.Narrative + "  Amount: " + this.Amount
    }

    amount_checknumber() {
        if (isNaN(parseFloat(this.Amount))) {
            logger.warn("Amount invalid! - Will be set to 0")
            logger.warn(this.transaction_to_string())
            this.Amount = 0
        }
    }
}