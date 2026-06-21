
let overlay = document.querySelector('.overlay');
let form = document.querySelector('form');

// let container = document.querySelector('.container');
let section = document.querySelector('.section');
let container = document.createElement("div");
container.classList.add("container");
section.append(container);

let title = document.querySelector('.title');
let category = document.querySelector('#category');

let obj = {};
let taskArray = [];

taskArray = JSON.parse(localStorage.getItem("data")) || [];

//actions to be done once submit is clicked
form.addEventListener('submit', (e)=>{
    e.preventDefault()

    if(title.value.trim()===""||category.value.trim()===""){
        alert("Please enter the requirements");
        title.style.border = "2px solid red"
        return;
    }

    obj = {
        id : crypto.randomUUID(),
        title: title.value,
        category: category.value,
        status : "pending"
    }
console.log(obj)
    taskArray.push(obj);
    localStorage.setItem("data",JSON.stringify(taskArray));
    loadUI();
    form.reset();
    counterUpdate();  //updating counter once we submit form
})
//we are oading the ui here , basically adding to the dom
//Approach one performing crud using index of array
//Problems with this approach ? if for any reason array gets sorted or change in order the data will become inconsistent.
// let loadUI = () =>{
//     container.innerHTML = "";
//     taskArray.forEach((item,index) => {
//         container.innerHTML += `<div class="box" data-id="${item.id}>
//             <h2>${item.title}</h2>
//             <div class="labels">
//               <p>${item.category}</p>
//               <p data-status="${item.status}"><span class="mark" data-status="${item.status}"></span>${item.status}</p>
//             </div>
//             <span class="hr-line"></span>
//             <div class="btn">  can use id as well but for that put it as follow > ('${item.id}') dont miss single quotes
//               <span class="edit-btn" onclick="editBox(${index})"><i class="ri-edit-box-line"></i></span>
//               <span class="delete-btn" onclick="removeBox(${index})"
//                 ><i class="ri-delete-bin-5-line"></i
//               ></span>
//               <span class="status-btn" onclick="updateStatus(${index} , this)"
//                 ><i class="ri-checkbox-circle-fill"></i></span>
//             </div>`
//     })
// }


//Approach2  using id and event deligation
let loadUI = (list = taskArray) => {
    container.innerHTML = "";
    list.forEach((item) => {
        container.innerHTML += `<div class="box" data-id="${item.id}">
            <h2>${item.title}</h2>
            <div class="labels">
              <p>${item.category}</p>
              <p data-status="${item.status}"><span class="mark" data-status="${item.status}"></span>${item.status}</p>
            </div>
            <span class="hr-line"></span>
            <div class="btn">
              <span class="edit-btn"><i class="ri-edit-box-line"></i></span>
              <span class="delete-btn"><i class="ri-delete-bin-5-line"></i></span>
              <span class="status-btn"><i class="ri-checkbox-circle-fill"></i></span>
            </div>
        </div>`;
    });
}

container.addEventListener('click', (e) => {
    let box = e.target.closest('.box');
    console.log(box)
    if (!box) return;

    let id = box.dataset.id;

    if (e.target.closest('.edit-btn')) {
        editBox(id);
    } else if (e.target.closest('.delete-btn')) {
        removeBox(id);
    } else if (e.target.closest('.status-btn')) {
        updateStatus(id);
    }
});

let removeBox = (id) =>{
    // taskArray.splice(index,1);
    taskArray = taskArray.filter(t => t.id !== id);
    localStorage.setItem("data", JSON.stringify(taskArray));
    loadUI();
    counterUpdate()  //updating counter if box removed
}


let oTitle = document.querySelector(".overlay-title");
let oCategory = document.querySelector(".overlay-options");
let oStatus = document.querySelector(".overlay-status");
let updateIndex = null;

// let editBox = (index) =>{
//     overlay.style.display = "flex";
//     // overlay[0].value = title.value;
//     // overlay[1].value = category.value;
//     // overlay[2].value = status.value;

//     updateIndex = index;
//     oTitle.value = taskArray[index].title;
//     oCategory.value = taskArray[index].category;
//     oStatus.value = taskArray[index].status;

     
    
    
    
// overlay.addEventListener('click' , (e)=>{

//     obj = {
//             title   : oTitle.value,
//             category: oCategory.value,
//             status  : oStatus.value
//         }
//     console.log(obj);
//     if(e.target.matches('.submit')){       
        
//         taskArray[updateIndex] = obj;
//         localStorage.setItem("data", JSON.stringify(taskArray))
//         overlay.style.display="none";
//         loadUI()
//         counterUpdate(); //updating counter if we update the box
//     }
    
// })


// }


let editBox = (id) => {
    overlay.style.display = "flex";
    updateId = id;
    console.log(updateId)
    let task = taskArray.find(t => t.id === id);
    
    oTitle.value = task.title;
    oCategory.value = task.category;
    oStatus.value = task.status;

    overlay.addEventListener('click' , (e)=>{
        if(e.target.matches('.x')){
         overlay.style.display = "none";
         return;
        }

        if(e.target.matches('.submit')){
            let matchingIndex = taskArray.findIndex(t => t.id === updateId)
             taskArray[matchingIndex] = {
                id: updateId,
                title: oTitle.value,
                category: oCategory.value,
                status: oStatus.value
             };
            localStorage.setItem("data", JSON.stringify(taskArray))
            overlay.style.display="none";
            loadUI()
            counterUpdate();
        }
    })
}


//logic for closing the overlay
// overlay.addEventListener('click', (e) =>{
//     if(e.target.matches('.x')){
//          overlay.style.display = "none";
//     }
// })

//we are updating the status when button clicked on box
// let updateStatus = (index , element) => {
//     taskArray[index].status = "completed";
//     element.querySelector("i").style.backgroundColor = "green";
//     localStorage.setItem("data", JSON.stringify(taskArray))
//     loadUI();
//     counterUpdate() //updating counter if we direclty changing the status
// }
let updateStatus = (id) => {
    let task = taskArray.find(t => t.id === id);
    task.status = "completed";
    localStorage.setItem("data", JSON.stringify(taskArray));
    loadUI();
    counterUpdate();
}

//logic to update the pending and completed tasks
let completed = document.querySelector(".counterComplete");
let pending = document.querySelector(".counterPending");


completedTask = JSON.parse(localStorage.getItem("counterCompleted")) || 0
pendingTask = JSON.parse(localStorage.getItem("counterPending")) || 0

function counterUpdate(){
    let completedTask = 0;
    let pendingTask = 0;
taskArray.forEach((itm)=>{
    if(itm.status=="completed")
    return completedTask++;
    else if(itm.status=="pending")
    return pendingTask++;
})
// console.log(completedTask , pendingTask)
    completed.textContent = completedTask;
    pending.textContent = pendingTask;
    localStorage.setItem("counterCompleted", completedTask);
    localStorage.setItem("counterPending", pendingTask);
}



//deleting all tasks 

let clearTask = document.querySelector('.clear-task');
clearTask.addEventListener('click', ()=>{
    taskArray=[];
    localStorage.setItem("data", JSON.stringify(taskArray))
    loadUI();
    counterUpdate()
})


//theme
let theme = document.querySelector('.circle');
let themeToggle = document.querySelector('.sun-moon');
// let isDark = false;
let isDark = JSON.parse(localStorage.getItem("theme")) || false ;


let applyTheme = () =>{
    // document.body.classList.toggle('dark')
    if(!isDark){
        document.body.classList.add('dark')
        themeToggle.innerHTML = `<i class="ri-moon-fill" style="color:white"></i>`
        theme.style.backgroundColor = "black";
        // isDark=true;
               
    }else{
        document.body.classList.remove('dark')
        themeToggle.innerHTML = `<i class="ri-sun-fill"></i>`
        theme.style.backgroundColor = "white";
        // isDark=false;
        
    }
    //  document.body.classList.toggle('dark', isDark);
    // themeToggle.innerHTML = isDark ? `<i class="ri-moon-fill"></i>` : `<i class="ri-sun-fill"></i>`
}
// theme.addEventListener('click' , applyTheme)
theme.addEventListener('click', ()=>{
    isDark = !isDark;
    applyTheme()
    localStorage.setItem("theme", JSON.stringify(isDark)); 
})

let header = document.querySelector('header');
let search = document.querySelector('.op-search');


search.addEventListener('input', (e)=>{
    let query = e.target.value.toLowerCase();
    let filtered = taskArray.filter(t => t.title.toLowerCase().includes(query));
    loadUI(filtered)
})
  


let filterCateogory = document.querySelector('#op-filter-category');
let filterStatus = document.querySelector('#op-filter-status');

// console.log(filterCateogory)

filterCateogory.addEventListener('change', (e)=>{
    let value = e.target.value.toLowerCase();
    let filterdC = value!=""?taskArray.filter(t => t.category.toLowerCase()==value):taskArray;
    loadUI(filterdC);
} )

filterStatus.addEventListener('change', (e)=>{
    let value = e.target.value.toLowerCase();
    console.log(value   )
    let filteredS = value!=""?taskArray.filter(t => t.status.toLowerCase() == value):taskArray;
    loadUI(filteredS)
})


loadUI() //calling once default for localstorage rendering
applyTheme()
counterUpdate()

let console = document.querySelector('.console')
let difference = document.querySelector('.difference');
let comparisonInput = document.querySelector('.comp');
let value1 = document.querySelector('.inputValue')
let value2 = document.querySelector('.attributeValue')
let v1 = null;
let v2 = null;
difference.addEventListener('click', (e)=>{
    
    // v1.textContent = "";
    // v2.textContent = "";

    comparison();

})

function comparison(){
    let ipValue = comparisonInput.value;
    let atValue = comparisonInput.getAttribute("value");
    // console.log(ipValue,atValue);
    if (v1) v1.remove();
    if (v2) v2.remove();
     v1 = document.createElement("h4");
     v2 = document.createElement("h4");
    value1.after(v1);
    value2.append(v2)

    v1.textContent = ipValue;
    v2.textContent = atValue;

    console.style.display="flex"


}



//event propgation display 
//to get event propagation we need to add event listener on each node
let child = document.querySelector('.child') 
let parent = document.querySelector('.p');
let gp = document.querySelector('.gp')
let capture = document.querySelector('.capture')
let bubble = document.querySelector('.bubble')
let note = document.querySelector('.note2')
let op = document.querySelector('.op')



child.addEventListener('click', ()=>{
    child.style.backgroundColor = "#af9b59"
    child.style.transform = "scale(1.1)"
    child.textContent = `child
                         selected`


})
capture.addEventListener('click', () => {
    startFlow(true)
    note.innerHTML = `<span><i class="ri-error-warning-fill"></i></span>Event capturing: Order of flow is inwards, from outer-most parent to the last most child`
});
bubble.addEventListener('click', () => {
    startFlow(false)
    note.innerHTML = `<span><i class="ri-error-warning-fill"></i></span>Event Bubbling: Order of flow is outwards, from inner-most child to the out-most parent`

});


let flow = [];
function makeLabel(label){
    flow.push(label);
    return op.textContent = flow.join('->')
}

let listener = []
function clearListner(){
    listener.forEach(({item , fn , capture})=>{
        item.removeEventListener('click',fn,{capture})
    })
}

function startFlow(flag){
    flow=[];
    clearListner();
    op.textContent='';
    [[gp , 'Grandparent'],[parent , 'parent'], [child , 'child']].forEach(([item , label]) =>{
        const fn = () => makeLabel(label);
        item.addEventListener('click', fn , {capture: flag ,once:true})
        listener.push({item, fn, capture: flag});
    })
}