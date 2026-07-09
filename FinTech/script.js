//handaling localStorage getItem
let data = JSON.parse(localStorage.getItem('userDetails')) || [];
let transactionArray = JSON.parse(localStorage.getItem('transactionDetails')) || [];
console.log(transactionArray)
let popup = document.querySelector('.popup');
let currentUser = "";
let expenseChart;

//Handaling Login page
let formLogin = document.querySelector('.formLogin');
let username = document.querySelector('#username');
let password = document.querySelector('#password');
let btnLog = document.querySelector('.login');
let register = document.querySelector('.reg');
 

// let transactionArray = [];

let showPopup = (text , visible) =>{
    popup.textContent = text;
    popup.style.display = visible; 

    setTimeout(()=>{
        popup.style.display = "none";
    },2000)

}


// btnLog.addEventListener('click', (e)=>{  //this for some reason block html attributes defined
formLogin.addEventListener('submit', (e)=>{
    e.preventDefault();
    if(username.value.trim()==="" || password.value.trim()==="") return;

    const user = data.find(
        u => (u.username === username.value.trim())
    )
console.log(user);
    
    if (!user) {
        showPopup("User not found", "flex" )
        return;   
    }
    
    if(user.password !== password.value.trim()){    
        showPopup("Incorrect password", "flex" )       
        return;
    }

    if(user){
        showPopup("Logged in successfully", "flex")
        username.value="";
        password.value="";
        currentUser = user.username;
        loadDashboard(currentUser);
    }
});

register.addEventListener('click', ()=>{
    formLogin.classList.add('hide')
    formRegister.classList.remove('hide')
})

//handaling register page
let formRegister = document.querySelector('.formRegister');
let usernameR = document.querySelector('#usernameR');
let passwordR = document.querySelector('#passwordR');
let btnReg = document.querySelector('.register');
let login = document.querySelector('.log');

let userArray = data;



let storeUser = () => {
    

       let user = {
        username: usernameR.value,
        password: passwordR.value
       };

       if(usernameR.value.trim() === "" || passwordR.value.trim() === "") return

       let account = data.find((a)=>{
        return a.username === usernameR.value.trim()
       })
        
       if(account){
            showPopup("Username already taken", "flex")
            return;
        }
       

       userArray.push(user);
       localStorage.setItem('userDetails',JSON.stringify(userArray));
       console.log(userArray);
       usernameR.value="";
       passwordR.value="";
        
}   

// btnReg.addEventListener('click', (e)=>{
formRegister.addEventListener('submit', (e)=>{
    e.preventDefault();
    storeUser();
    

})

login.addEventListener('click',()=>{
    formLogin.classList.remove('hide');
    formRegister.classList.add('hide')
})






//Dashboard code 
 let logout = document.querySelector('.logout');
let dashboard = document.querySelector('.parent');
let nav = document.querySelector('.nav')
let cardMain = document.querySelector('.cardMain')
// let expenseDetails = [{"Current Balance":0.00} ,{"Total Income":0.00},{"Total Expense":0.00},{"Total Transaction":0} ]
let currencyChange = '$';

  let logoutHandler = () =>{
        dashboard.style.display = 'none';
        formLogin.style.display = 'flex';
        showPopup("Logged out succesfully.", "flex")
    }

let loadDashboard = (loginUser) => {
    dashboard.style.display = 'flex'
    formLogin.style.display= 'none'
    settingsMain.style.display='none'
    dashboardMain.style.display='flex'

 

    nav.innerHTML = `<div>
                        <span class="line"></span>
                        <h3>${loginUser}</h3>
                        <div class="logout" onclick="logoutHandler()" ><span><i class="ri-logout-box-r-line"></i></span>Logout</div>
                    </div>`


    let currentBalance = 0.00;
    let totalIncome = 0.00;
    let totalExpence = 0.00;

   const userTransactions = transactionArray.filter(
    t => t.owner === loginUser
);
    

    // transactionArray.forEach((elem)=>{
        userTransactions.forEach((elem) =>{
        if(elem.expense == "expense"){
            currentBalance-=Number(elem.amt);
            totalExpence+=Number(elem.amt);
            
        }            
        if(elem.expense == "income"){
            currentBalance+=Number(elem.amt);
            totalIncome+=Number(elem.amt);
        }
            
    })


    
//chart 


const ctx = document.getElementById('chart');


if (expenseChart) {
    expenseChart.destroy();
}



  expenseChart =  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Income', 'Expense'],
      datasets: [{
        label: '#Income vs Expense',
        data: [totalIncome,totalExpence],
        backgroundColor: [
                '#22c55e',
                '#ef4444'
            ],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

    cardMain.innerHTML = `<div class="card">
                            <span>
                                <i class="ri-money-dollar-circle-fill"></i>
                            </span>
                            <div>
                            <p>Current Balance</p>
                            <h1>${currencyChange}${currentBalance}</h1>
                            </div>
                        </div>
                        <div class="card">
                            <span>
                                
                                <i class="ri-funds-box-fill"></i>
                            </span>
                            <div>
                            <p>Total Income</p>
                            <h1>${currencyChange}${totalIncome}</h1>
                            </div>
                        </div>
                        <div class="card">
                            <span>
                                <i class="ri-wallet-fill"></i>
                            </span>
                            <div>
                            <p>Total Expense</p>
                            <h1>${currencyChange}${totalExpence}</h1>
                            </div>
                        </div>
                        <div class="card">
                            <span>
                                <i class="ri-exchange-dollar-line"></i>
                            </span>
                            <div>
                            <p>Total Transaction</p>
                            <h1>${userTransactions.length}</h1>
                            </div>
                        </div>`           
  
                        




let tableBody = document.querySelector('tbody');

 tableBody.innerHTML="";
userTransactions.forEach((elem, idx)=>{
   
    tableBody.innerHTML+=` 
                      <tr>
                          <td>${elem.date}</td>
                          <td>${elem.desc}</td>
                          <td>${elem.txCategory}</td>
                          <td>${elem.amt}</td>
                          <td><button onclick="deleteTransaction(${elem.id})" style="background-color:red ; color:white ; border-radius:8px ; padding:5px; cursor:pointer ">delete</button></td>
                      </tr>
                    `
})



} //we can call a function onclick="" and it will work only of the fucntion is declared in global scope



function deleteTransaction(id){
    
    
    transactionArray = transactionArray.filter(transaction => transaction.id !== id);


    localStorage.setItem('transactionDetails',JSON.stringify(transactionArray));

    loadDashboard(currentUser);

}





//switching dashboard
const navItems = document.querySelectorAll(".side");

navItems.forEach(item => {
    item.addEventListener("click", () => {
        navItems.forEach(nav => nav.classList.remove("active"));
        item.classList.add("active");
    });
});



//overlay handaling 
let overlay = document.querySelector('.overlay');
let showTransaction = document.querySelector('.transactionbtm');
let forum = document.querySelector('.ovl');

overlay.addEventListener('click', ()=>{
    overlay.style.display='none';
});

showTransaction.addEventListener('click', ()=>{
    overlay.style.display='flex'
})

forum.addEventListener('click', (e)=>{
    e.stopPropagation();
})



//handaling dashbaord and setting toggle
let dashboardMain = document.querySelector('.dashboard-main');
let settingsMain = document.querySelector('.settings-main');
let settingsbtn = document.querySelector('.settings');
let dashboardbtn = document.querySelector('.dashboard');

dashboardbtn.addEventListener('click', ()=>{
    dashboardMain.style.display='flex';
    settingsMain.style.display = 'none';
})

settingsbtn.addEventListener('click', ()=>{
    dashboardMain.style.display ='none';
    settingsMain.style.display = 'flex';
})



//handaling transactions

forum.addEventListener('submit', (e)=>{
    e.preventDefault();
    // const data = new FormData(forum);      //not collecting data cause fromData function requires name attribute in the tags
    // console.log(...data.entries)

    const data = Object.fromEntries(new FormData(forum));
    data.owner = currentUser;
    data.id = Date.now();
    transactionArray.push(data);
    localStorage.setItem('transactionDetails', JSON.stringify(transactionArray));
    forum.reset();
    console.log(data)
    loadDashboard(currentUser);

})




//handaling date 
let dateInput = document.querySelector('#date');
dateInput.value = new Date().toISOString().split("T")[0];

//handaling reset data

let resetAllTransaction = document.querySelector('.reset');
resetAllTransaction.addEventListener('click', ()=>{
    // transactionArray = [];    
    // localStorage.setItem('transactionDetails',JSON.stringify(transactionArray));
    // // localStorage.removeItem('transactionDetails');

    // loadDashboard(currentUser);
    
transactionArray = transactionArray.filter(transaction => transaction.owner !== currentUser);

    localStorage.setItem('transactionDetails',JSON.stringify(transactionArray)    );

    loadDashboard(currentUser);

})



//handaling settings
let namechange = document.querySelector('.namechange')

namechange.innerHTML = `<h1 class="text-2xl font-bold">Profile Details</h1>
                            <form class="change">
                                <div>
                                    <div>
                                        <label for="username">Full Name</label>
                                        <input type="text" id="usernameS" placeholder="User">
                                    </div>
                                    <div>
                                        <label for="currencyS">Primary Currency</label>
                                        <select name="" id="currencyS">
                                            <option value="$" selected>USD ($)</option>
                                            <option value="€">EUR (€)</option>
                                            <option value="£">GBP (£)</option>
                                            <option value="₹">INR (₹)</option>
                                            <option value="¥">JPY (¥)</option>
                                        </select>
                                    </div>
                                </div>

                                <button type="submit">Save Changes</button>

                            </form>`


const changeForm = document.querySelector('.change');
const usernameInput = document.querySelector('#usernameS');
const currencyInput = document.querySelector('#currencyS');

changeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    
    const newUsername = usernameInput.value.trim();

    if(!newUsername){
        currentUser=currentUser;
        return;
    }

    const existingUser = data.find(
        u => u.username === newUsername
    );

    
    if(existingUser && existingUser.username !== currentUser){
        showPopup("Username already exists", "flex");
        return;
    }


    const oldUsername = currentUser;
    currentUser = newUsername;
    currencyChange = currencyInput.value;

    console.log("Old Username:", oldUsername);
    console.log("New Username:", newUsername);
    console.log(transactionArray);
    console.log(userArray)

    transactionArray.forEach(transaction => {
        if (transaction.owner === oldUsername) {
            console.log("Updating:", transaction);
            transaction.owner = newUsername;
        }
    });

    const user = userArray.find(u => u.username === oldUsername);
    
    if (user) {
        user.username = newUsername;
    }

    localStorage.setItem('transactionDetails',JSON.stringify(transactionArray));
    localStorage.setItem('userDetails',JSON.stringify(userArray));

    loadDashboard(currentUser)

});


