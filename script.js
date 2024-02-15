"use strict";

const account1 = {
  owner: "Daulat Jajra",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2023-11-18T21:31:17.178Z",
    "2023-12-23T07:42:02.383Z",
    "2024-01-02T09:15:04.904Z",
    "2024-01-01T10:17:24.185Z",
    "2024-02-01T14:11:59.604Z",
    "2024-02-05T17:01:17.194Z",
    "2024-02-13T10:51:36.790Z",
    "2024-02-14T07:36:17.929Z",
  ],
  currency: "INR",
  locale: "en-IN",
};

const account2 = {
  owner: "Muskan Khan",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2023-11-01T13:15:33.035Z",
    "2023-11-30T09:48:16.867Z",
    "2023-12-25T06:04:23.907Z",
    "2024-01-01T14:18:46.235Z",
    "2024-01-05T16:33:06.386Z",
    "2024-01-08T18:49:59.371Z",
    "2024-01-09T12:01:20.894Z",
    "2024-01-10T14:43:26.374Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

// create userName
const createUsernames = function (accs) {
  accs.forEach((acc) => {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
createUsernames(accounts);

// format currency
const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};

// format movementsDate
const formatMovemetsDate = (date, locale) => {
  const calcDaysPassed = function (date1, date2) {
    return Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  };
  const daysPassed = calcDaysPassed(date, new Date());

  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} days passed`;
  if (daysPassed <= 14) return "last week";
  else {
    return new Intl.DateTimeFormat(locale).format(date);
  }
};

// display Movements
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = "";

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  movs.forEach((mov, i) => {
    const type = mov > 0 ? "deposit" : "withdrawal";

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovemetsDate(date, acc.locale);
    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    const html = `<div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type} </div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${formattedMov}</div>
        </div>`;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

// display balance
const calcPrintBalance = (acc) => {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

// display Summmery
const displaySummery = (acc) => {
  const income = acc.movements
    .filter((mov) => mov > 0)
    .reduce((sum, mov) => sum + mov, 0);

  labelSumIn.textContent = formatCur(income, acc.locale, acc.currency);

  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((sum, mov) => sum + mov, 0);

  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int, i, ar) => {
      // console.log(ar);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

const updateUI = function (acc) {
  // display movements , balance, summery
  displayMovements(acc);
  calcPrintBalance(acc);
  displaySummery(acc);
};

// current date
const now = function () {
  const now = new Date();
  const options = {
    hour: "numeric",
    minute: "numeric",
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  };

  labelDate.textContent = new Intl.DateTimeFormat(
    currentAccount.locale,
    options
  ).format(now);
};

const startLogOutTimer = function () {
  let time = 300;

  const tick = () => {
    const min = String(Math.floor(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearTimeout(timer);
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = "0";
      sessionStorage.removeItem("loggedIn");
      sessionStorage.removeItem("username");
    }

    time--;
  };
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};
let currentAccount, timer;

// login functions
const loginfn = function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  if (currentAccount && currentAccount.pin === +inputLoginPin.value) {
    sessionStorage.setItem("loggedIn", "true");
    sessionStorage.setItem("username", currentAccount.username);

    labelWelcome.textContent = ` Welcome Back ${
      currentAccount.owner.split(" ")[0]
    } `;

    containerApp.style.opacity = "100";

    now();

    updateUI(currentAccount);

    if (timer) clearTimeout(timer);
    timer = startLogOutTimer();

    inputLoginPin.value = inputLoginUsername.value = "";
    inputLoginPin.blur();
    inputLoginUsername.blur();
  } else {
    alert("Sorry! Invalid User & Pin");
  }
};

// Transfer function
const transferfn = function (e) {
  e.preventDefault();
  const amount = Math.floor(inputTransferAmount.value);
  const receiveAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );

  inputTransferTo.value = inputTransferAmount.value = "";
  if (
    amount > 0 &&
    receiveAcc &&
    currentAccount.balance >= amount &&
    receiveAcc.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiveAcc.movements.push(amount);

    currentAccount.movementsDates.push(new Date().toISOString());
    receiveAcc.movementsDates.push(new Date().toISOString());

    updateUI(currentAccount);

    clearInterval(timer);
    timer = startLogOutTimer();
  }
};

// close fn
const closefn = function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);
    sessionStorage.removeItem("loggedIn");
    sessionStorage.removeItem("username");
    containerApp.style.opacity = "0";
  }
};

// loan function
const loanfn = function (e) {
  e.preventDefault();

  const amount = +inputLoanAmount.value;

  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    setTimeout(() => {
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 1000);
  }
  inputLoanAmount.value = "";
};

// sort function
let sorted = false;
const sortfn = function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
};

document.addEventListener("DOMContentLoaded", function () {
  const isLoggedIn = sessionStorage.getItem("loggedIn") === "true";

  if (isLoggedIn) {
    const savedUsername = sessionStorage.getItem("username");
    currentAccount = accounts.find((acc) => acc.username === savedUsername);

    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;

    updateUI(currentAccount);
    inputLoginPin.blur();
    inputLoginUsername.blur();

    now();

    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
  }
});

btnLogin.addEventListener("click", loginfn);
btnTransfer.addEventListener("click", transferfn);
btnClose.addEventListener("click", closefn);
btnLoan.addEventListener("click", loanfn);
btnSort.addEventListener("click", sortfn);
