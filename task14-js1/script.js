let forum = document.querySelector("form");

let notes = document.querySelector(".to-do-notes");

const choose_file = document.querySelector("#choose_file");
const title = document.querySelector("#title");
const description = document.querySelector("#description"); 

let noteArray = [];
let updateIndex = null;




forum.addEventListener('click',(e)=>{
    if(e.target.matches("button[type='submit']") ){
        e.preventDefault();


            let file = choose_file.files[0];
            let image = file?URL.createObjectURL(file):"";

        if(image.trim()===""||title.value.trim()===""||description.value.trim()===""){
            alert("Enter valid inputs");
            return;
        }

        let obj = {
                image:image,
                title:title.value,
                description:description.value  
        }


        if(updateIndex!==null){
            noteArray[updateIndex] = obj;
            updateIndex = null;
            localStorage.setItem("data",JSON.stringify(noteArray));
        }else{
            noteArray.push(obj);
            localStorage.setItem("data",JSON.stringify(noteArray));
        }

        forum.reset();
        loadUI();
        
    }   
})


noteArray = JSON.parse(localStorage.getItem("data")) || [];



function loadUI(){
    
    notes.innerHTML= "";
    
    noteArray.forEach((itm,idx)=>{
    // for(let [itm,idx] of noteArray.entries()){
        let box = document.createElement("div");
        box.classList.add("box");
        
        

        box.innerHTML += `
          <div class="img-box">
            <img src="${itm.image}" alt="" />
          </div>

          <h3>${itm.title.toUpperCase()}</h3>
          <p>${itm.description}</p>
          <div class="btn">
            <button onclick="update(${idx})" class="edit">
              <span><i class="ri-edit-2-line"></i></span>
            </button>
            <button onclick="remove(${idx})" class="remove">X</button>
          </div>` 
          
          notes.append(box);

         
    });
    

}

loadUI()

const remove = (idx)=>{
    noteArray.splice(idx,1);
    localStorage.setItem("data",JSON.stringify(noteArray))
    loadUI()
}

// let editIndex = null;
const update=((idx)=>{
    const item = noteArray[idx];

        // forum[0].value=item.image;
        forum[1].value=item.title;
        forum[2].value=item.description;
    updateIndex=idx;
})


notes.addEventListener("click", (e)=>{
    const box=e.target.closest(".box");
    if(!box) return ;
    box.classList.toggle("expanded")
})