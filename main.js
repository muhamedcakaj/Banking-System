class Person {
    constructor(id, name, surname, balance, array) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.balance = balance;
        this.array = array;
    }

    getId() {
        return this.id;
    }

    getName() {
        return this.name;
    }

    getSurname() {
        return this.surname;
    }

    getBalance() {
        return this.balance;
    }

    transferMoney(money) {
        this.balance += money;
    }

    withdrawMoney(money) {
        if (this.balance >= money) {
            this.balance -= money;
        } else {
            alert("Nuk keni para te mjaftueshme ne gjirollogari");
        }
    }
    addElement(element) {
        this.array.push(element);
    }
    getArray() {
        return this.array;
    }

}
const peopleArray = [];
const currentDate = new Date();
const fullDate = currentDate.toLocaleString();

function main(event) {
    event.preventDefault();
    var loginId = document.getElementById("loginId").value;
    var loginName = document.getElementById("loginName").value;
    var loginSurname = document.getElementById("loginSurname").value;

    var signupId = document.getElementById("signupId").value;
    var signupName = document.getElementById("signupName").value;
    var signupSurname = document.getElementById("signupSurname").value;


    if (loginId) {
        if (existInArray(loginId)) {
            let indexOfCurrentUserInArray = findPeopleIndex(loginId);
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('signupForm').style.display = 'none';
            document.getElementById('bankAccountSection').style.display = 'block';
            //====================================================================
            let arrayFromPersonObject = peopleArray[indexOfCurrentUserInArray].getArray();
            console.log(arrayFromPersonObject);
            document.getElementById("userId").innerHTML = peopleArray[indexOfCurrentUserInArray].getId();
            document.getElementById("userName").innerHTML = peopleArray[indexOfCurrentUserInArray].getName();
            document.getElementById("userSurname").innerHTML = peopleArray[indexOfCurrentUserInArray].getSurname();
            document.getElementById("balance").innerHTML = peopleArray[indexOfCurrentUserInArray].getBalance();
            for (let i = 0; i < arrayFromPersonObject.length; i++) {
                const transactionList = document.getElementById("transactionList");

                const newTransaction = document.createElement("li");

                newTransaction.textContent = arrayFromPersonObject[i];

                transactionList.appendChild(newTransaction);
            }
            //====================================================================
        } else {
            alert("You have not signed up yet.Refresh and try again.")
        }
    } else if (signupId) {
        let balance = 0;
        let array = [];
        peopleArray.push(new Person(signupId, signupName, signupSurname, balance, array));
        saveDataToLocal();
        alert("Log in to get to the main page");
    }
}
function deposit() {
    let currentUserId = document.getElementById("userId").textContent;
    let depositAmount = document.getElementById("depositAmount").value;
    let indexOfCurrentUserInArray = findPeopleIndex(currentUserId);

    peopleArray[indexOfCurrentUserInArray].transferMoney(parseInt(depositAmount));

    document.getElementById("balance").innerHTML = peopleArray[indexOfCurrentUserInArray].getBalance();
    let arrayElementToPush = fullDate + " - You have deposit in your account " + depositAmount + "\u20AC";
    peopleArray[indexOfCurrentUserInArray].addElement(arrayElementToPush);
    saveDataToLocal();
}
function withdraw() {
    let currentUserId = document.getElementById("userId").textContent;
    let withdrawAmount = document.getElementById("withdrawAmount").value;
    let indexOfCurrentUserInArray = findPeopleIndex(currentUserId);

    peopleArray[indexOfCurrentUserInArray].withdrawMoney(parseInt(withdrawAmount));
    document.getElementById("balance").innerHTML = peopleArray[indexOfCurrentUserInArray].getBalance();
    let arrayElementToPush = fullDate + " - You have withdraw from your account " + withdrawAmount + "\u20AC";
    peopleArray[indexOfCurrentUserInArray].addElement(arrayElementToPush);
    saveDataToLocal();
}
function transfer() {
    let currentUserIdIndex = findPeopleIndex(document.getElementById("userId").textContent);
    let personWhoYouHaveToTransferMoneyIndex = findPeopleIndex(document.getElementById("personId").value);

    let money = document.getElementById("transferAmount").value;
    if (personWhoYouHaveToTransferMoneyIndex !== -1) {
        if (peopleArray[currentUserIdIndex].getBalance() >= money) {
            peopleArray[currentUserIdIndex].withdrawMoney(parseInt(money));
            peopleArray[personWhoYouHaveToTransferMoneyIndex].transferMoney(parseInt(money));

            alert("Tranferi u krye me sukses");

            document.getElementById("balance").innerHTML = peopleArray[currentUserIdIndex].getBalance();
            let arrayElementToPush = fullDate + " - You have transfered from your account " + money + "\u20AC to " + peopleArray[personWhoYouHaveToTransferMoneyIndex].getName();
            peopleArray[currentUserIdIndex].addElement(arrayElementToPush);
            let arrayElementToPush2 = fullDate + " - " + peopleArray[currentUserIdIndex].getName() + " - Have transfered in your account the amount of " + money + "\u20AC";
            peopleArray[personWhoYouHaveToTransferMoneyIndex].addElement(arrayElementToPush2);
            saveDataToLocal();
        } else {
            alert("Nuk keni para te mjaftueshme ne gjirollogari");
        }
    } else {
        alert("ID INVALID 404 ERROR");
    }
}
function findPeopleIndex(loginId) {
    for (let i = 0; i < peopleArray.length; i++) {
        if (peopleArray[i].getId() == loginId) {
            return i;
        }
    }
    return -1;
}

function existInArray(id) {
    for (let i = 0; i < peopleArray.length; i++) {
        if (peopleArray[i].getId() == id) {
            return true;
        }
    }
    return false;
}
//=========================================================================================================================================================
function saveDataToLocal() {
    localStorage.setItem('peopleData', JSON.stringify(peopleArray));
}
function loadDataFromLocal() {
    const storedData = localStorage.getItem('peopleData');

    if (storedData) {
        // Parse the JSON string back into an array of plain objects
        const retrievedArray = JSON.parse(storedData);

        // Convert the plain objects into instances of the Person class
        peopleArray.length = 0;
        retrievedArray.forEach(item => {
            peopleArray.push(new Person(item.id, item.name, item.surname, item.balance, item.array));
        });
    }
}
//=============================================================================================================================================================
loadDataFromLocal();
