import fs from "fs";
import log4js from "log4js"
import {parse} from "csv-parse";
import moment from "moment"
import readlineSync from 'readline-sync';
import { transaction } from "./transaction.js"
import { person } from "./person.js"

// LOGGING CODE
log4js.configure({
    appenders: {
        file: { type: 'fileSync', filename: 'logs/debug.log' }
    },
    categories: {
        default: { appenders: ['file'], level: 'debug'}
    }
});
const logger = log4js.getLogger("index.js")

// MAIN CODE

function create_list_of_people(transactions_list) {
    let people_list = []
    for (let i = 1; i < transactions_list.length; i++) {

        let person_from = people_list.find(person => person.name === transactions_list[i].from)
        if (!person_from) {
            person_from = new person(transactions_list[i].from, 0, [], [])
            people_list.push(person_from)
        }
        person_from.transactions_from.push(transactions_list[i])
        person_from.amount_owed += parseFloat(transactions_list[i].amount)

        let person_to = people_list.find(person => person.name === transactions_list[i].to)
        if (!person_to) {
            person_to = new person(transactions_list[i].to, 0, [], [])
            people_list.push(person_to)
        }
        person_to.transactions_to.push(transactions_list[i])
        person_to.amount_owed -= parseFloat(transactions_list[i].amount)
    }
    return people_list
}

function list_all(people_list) {
    logger.info("User has selected List All")
    console.log("\nNames & Owes...")
    for (let i = 0; i < people_list.length; i++) {
        people_list[i].display_amount_owed()
    }
}

function program_main_body() {
    logger.info("Data is Loaded!")

    let people_list = create_list_of_people(transactions_list)

        // DEAL WITH USER INPUT FUNCTIONS
    var input = readlineSync.question("")

        // LIST ALL
    if (input === "List All") {
        list_all(people_list)
    }
        // LIST NAME
    for (let i = 0; i < people_list.length; i++) {
        if (input === "List " + people_list[i].name) {
            logger.info("User has selected List " + people_list[i].name)
            people_list[i].list_all_transactions()
        }
    }
    logger.info("Program has Ended!\n")
}

function check_data_for_errors(file_row) {
    if (file_row[0] === "Date") {
        return false
    }
    else if (isNaN(parseFloat(file_row[4]))) {
        logger.warn("Amount invalid!")
        logger.warn(new transaction(file_row[0], file_row[1], file_row[2], file_row[3], file_row[4]).transaction_to_string())
        return false
    }
    else if (!moment(file_row[0], "DD/MM/YYYY", true).isValid()) {
        logger.warn("Date Invalid!")
        logger.warn(new transaction(file_row[0], file_row[1], file_row[2], file_row[3], file_row[4]).transaction_to_string())
        return false
    }
    else {
        return true
    }
}


function load_one_transaction(file_row) {
    if (check_data_for_errors(file_row)) {
        transactions_list.push(new transaction(file_row[0], file_row[1], file_row[2], file_row[3], file_row[4]))
    }
}

function read_csv_file(file_name) {
    fs.createReadStream(file_name)
        .pipe(parse({delimiter: ','}))
        .on('data', load_one_transaction)
        .on('end', () => program_main_body())
}

function read_json_file(file_name) {
    const transactions_list_json = JSON.parse(fs.readFileSync(input))
    for (let i = 0; i < transactions_list_json.length; i++) {
        transactions_list.push(new transaction(transactions_list_json[i].Date, transactions_list_json[i].FromAccount, transactions_list_json[i].ToAccount, transactions_list_json[i].Narrative, transactions_list_json[i].Amount))
    }
    program_main_body()
}

//Pre Processing Details
logger.info("Program has Started")
var transactions_list = []
var input = readlineSync.question("Name of File: ")

if (!(input.search(".csv") === -1)) {
    logger.info("User has opened " + input)
    read_csv_file(input)
}
else if  (!(input.search(".json") === -1)) {
    logger.info("User has opened " + input)
    read_json_file(input)
}