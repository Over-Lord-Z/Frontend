
let create = document.querySelector(".createProduct");
let overlay = document.querySelector(".overlay");
let closeOverlay = document.querySelector(".close");
let form = document.querySelector("form");
let container = document.querySelector(".container")

let imageURL = document.querySelector(".imageURL");
let title = document.querySelector(".title");
let price = document.querySelector(".price");


create.addEventListener("click", ()=>{
    overlay.style.display="flex";
    // overlay.style.opacity="1";
    // overlay.style.visibility="visible";
});

closeOverlay.addEventListener('click', ()=>{
    overlay.style.display = "none";
    // overlay.style.opacity="0";
})


//we want to extract the values of form 
//step 1 : create a array so that later we can do crud operations
//step 2 : create a empty object so that its easy to push data into array.

let obj = {};
let productArr = [];

let updateIdx = null;

productArr = JSON.parse(localStorage.getItem("product-data")) || [];
console.log(productArr)


form.addEventListener("submit", (e)=>{
    e.preventDefault();
    obj = {
            image: imageURL.value,
            title: title.value,
            price: price.value
    } 
    // console.log(obj)

    if(imageURL.value.trim()==="" || title.value.trim()==="" || price.value.trim()===""){
        alert("Enter valid details")
        return;
    } 

    //to update we need to check based on updateIdx. it basically tells if the value is coming cause we are trying to update or create
    if(updateIdx!=null){
        productArr[updateIdx]=obj;
        localStorage.setItem("product-data", JSON.stringify(productArr));
    }else{
        productArr.push(obj);
        localStorage.setItem("product-data", JSON.stringify(productArr));

    }
    

    overlay.style.display="none"
    // overlay.style.opacity="1"

    loadUI();
    form.reset();
});


let loadUI = ()=>{
    container.innerHTML="";
    productArr.forEach((product , index)=>{
    container.innerHTML += `<div class="box">
          <div class="img-box">
            <img src="${product.image}" alt="" />
          </div>
          <h2>${product.title}</h2>
          <p>$${product.price}</p>
          <div class="btn">
            <button onclick="update(${index})" class="update">Update</button>
            <button onclick="remove(${index})" class="delete">Delete</button>
          </div>
        </div>`
})



}

//remove elemet from dom
let remove = (index) => {
    productArr.splice(index,1);
    loadUI();
    localStorage.setItem("product-data", JSON.stringify(productArr));

}


let update = (index) => {
    overlay.style.display = "flex";
    // overlay.style.opacity="1";
     updateIdx = index;
    // form[0].value = productArr[index].image;   //problem with form[0].value is that id new input is added it will cause issues.
    // form[1].value = productArr[index].title;
    // form[2].value = productArr[index].price;

    imageURL.value = productArr[index].image;
    title.value    = productArr[index].title;
    price.value    = productArr[index].price;


}

loadUI();