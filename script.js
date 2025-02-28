const firstName = document.getElementById("fname");
const lastName = document.getElementById("lname");
const userBody=document.getElementById("userBody");
const expenseBody = document.getElementById("expenseBody");
const edidel="<button>Edit</button> <button>Delete</button>";
const table = document.getElementById("usertable");
const userPage = document.getElementById("userpage");
const expensesPage = document.getElementById("expensespage");
const costPage = document.getElementById("costpage");
const userSelect = document.getElementById("userSelect");
const categorySelect = document.getElementById("categorySelect");
const amount = document.getElementById("amount");
const description = document.getElementById("desc");
const mealsTotal = document.getElementById("mealstotal");
const travelTotal = document.getElementById("traveltotal");
const softwareTotal = document.getElementById("softwaretotal");


let categoryTotals = [0,0,0];
let uniqueUID = 1000;
let uniqueEID = 1000;
let currentPage = "users"
let users = [];
let userExpenses = [];


function changePage(target) {
  if (target === currentPage) {
    console.log("Already on page");
  } else if (target === "users") {
    currentPage = "users";
    expensesPage.style.display = "none";
    costPage.style.display = "none";
    updateUserTable();
    userPage.style.display = "block";
  } else if (target === "expenses") {
    currentPage = "expenses";
    userPage.style.display = "none";
    costPage.style.display = "none";
    updateDropdown();
    updateExpenseTable();
    expensesPage.style.display = "block";
  } else if (target === "cost") {
    currentPage = "cost";
    userPage.style.display = "none";
    expensesPage.style.display = "none";
    costPage.style.display = "block";
  }
}




function newUser() {
    var fname = firstName.value;
    var lname = lastName.value;
    if ((fname !== "") && (lname !== "")) {
        document.getElementById('fname').value = '';
        document.getElementById('lname').value = '';
        users.push([uniqueUID, fname, lname, 0]);
        uniqueUID++;
        updateUserTable();
    } else {
        if (!firstName) {

        }
    }
  }

  function newExpense() {
    var userIndex = userSelect.value;
    var fname = users[userIndex][1];
    var lname = users[userIndex][2];
    var category = categorySelect.value;
    var amt = amount.valueAsNumber;
    var desc = description.value;
    userExpenses.push([uniqueEID, users[userIndex][0], fname, lname, amt, category, desc]);
    updateCategories(amt, category);
    uniqueEID++;
    updateExpenseTable();
    updateUserTotal(users[userIndex][0]);
    console.log(userExpenses[userExpenses.length-1]);
  }


function updateUserTable() {
  userBody.innerHTML= users.map(r=>
  "<tr><td>"+r.join("</td><td>")+"</td><td>"+edidel+"</td></tr>" ).join("\n");
}

function updateExpenseTable() {
  expenseBody.innerHTML= userExpenses.map(r=>
    "<tr><td>"+r.join("</td><td>")+"</td><td>"+edidel+"</td></tr>" ).join("\n");
}

function updateDropdown() {
  userSelect.length = 1;
  var targetUser;
  for (let i=0; i < users.length; i++) {
    targetUser = users[i];
    userSelect.options[userSelect.options.length] = new Option(targetUser[1]+" "+targetUser[2],i);
  }
}

function updateCategories(amount, category) {
  console.log("amt="+amount+" category="+category);
  if (category === "Meals") {
    categoryTotals[0] += amount;
    mealsTotal.innerText="Meals: $"+categoryTotals[0]
  } else if (category === "Travel") {
    categoryTotals[1] += amount;
    travelTotal.innerText="Travel: $"+categoryTotals[1]
  } else if (category === "Software") {
    categoryTotals[2] += amount;
    softwareTotal.innerText="Software: $"+categoryTotals[2]
  }
}

function updateUserTotal(userID) {
  userID=parseInt(userID);
  console.log(typeof userID);
  var total=0;
  for (let i = 0; i<userExpenses.length;i++) {
    console.log("i="+i+" test="+typeof userExpenses[i][1]+" compare="+(userExpenses[i][1]===userID));
    if (userExpenses[i][1]===userID) {
      console.log("match1");
      total+=parseInt(userExpenses[i][4]);
    } 
  }
  for (let j = 0; j<users.length;j++) {
    if (users[j][0]===userID) {
      console.log("match2");
      console.log("current: "+users[j][3]);
      users[j][3]=total;
    }
  }
  console.log(total);
}

function deleteUserExpenses(userID) {
  userID=parseInt(userID);
  for (let i=userExpenses.length-1; i>=0;i--) {
    if (userID===userExpenses[i][1]) {
      updateCategories(-1*parseInt(userExpenses[i][4]), userExpenses[i][5]);
      userExpenses.splice(i,1);
    }
  }
}

function test() {
  console.log(users);
  console.log(userExpenses);
  console.log(categoryTotals);
}


//Edit and delete functionality user table
userBody.onclick=ev=>{
  [...ev.target.closest("tr").children].forEach((td,i)=>{ const btn=ev.target.textContent;
    var tr = td.parentNode;
    var row = tr.rowIndex;
    if (btn==="Edit") {
        td.innerHTML=i===0?td.innerText:i<3?'<input type="text" value="'+td.textContent+'" data-orig="'+td.textContent+'">'
                      : i===3?td.innerText:'<button>Save</button> <button>Cancel</button>';
    }
    else if (btn==="Delete") {
      if (i===0) {
        users.splice(tr.rowIndex-1, 1);
        deleteUserExpenses(td.innerText);
        tr.parentNode.removeChild(tr);
      }
    }
    else if (["Save","Cancel"].includes(btn)) {
      if (i>0 && i<3) {
        td.innerHTML=(btn==="Save"?td.children[0].value:td.children[0].dataset.orig)
        if (btn==="Save") {
          users[row-1][i]=td.innerText;
        }
      } else if (i===0 || i===3) {
        td.innerHTML=td.innerText;
      } else {
        td.innerHTML=edidel;
      }
  }
})
}

//Edit and delete functionality expense table
expenseBody.onclick=ev=>{ let amt; let userID;
  [...ev.target.closest("tr").children].forEach((td,i)=>{ const btn=ev.target.textContent;
    var tr = td.parentNode;
    var row = tr.rowIndex;
    //var amt;
    //var userID;
    if (btn==="Edit") {
        td.innerHTML=i<4?td.innerText:i<7?'<input type="text" value="'+td.textContent+'" data-orig="'+td.textContent+'">'
                      :'<button>Save</button> <button>Cancel</button>';
    }
    else if (btn==="Delete") {
      if (i===1) {
        userID = td.innerText;
      } else if (i===4) {
        amt = td.innerText;
      } else if (i===5) {
        console.log("amount = "+amt);
        updateCategories(parseInt(amt)*(-1), td.innerText);
        userExpenses.splice(tr.rowIndex-1, 1);
        tr.parentNode.removeChild(tr);
        updateUserTotal(userID);
      }
    }
    else if (["Save","Cancel"].includes(btn)) {
      if (i<4) {
        td.innerHTML=td.innerText;
      } else if (i<7) {
        if (i===4) {
          console.log(td.children[0].dataset.orig);
          amt=parseInt(td.children[0].dataset.orig);
          console.log("amt check 1: "+amt);
        }
        td.innerHTML=(btn==="Save"?td.children[0].value:td.children[0].dataset.orig)
      } else {
        td.innerHTML=edidel;
      }
      if (btn==="Save") {
        if (i===0 || i===1 || i===4) {
          userExpenses[row-1][i]=parseInt(td.innerText);
        } else if (i<8) {
          userExpenses[row-1][i]=td.innerText;
        }
        if (i===1) {
          userID = td.innerText;
        } else if (i===4) {
          amt = parseInt(td.innerHTML)-amt;
          console.log("amt check 2: "+amt);
        } else if (i===5) {
          updateCategories(amt, td.innerHTML);
        } else if (i===7) {
          updateUserTotal(userID);
        }
      }
  }
})
}
