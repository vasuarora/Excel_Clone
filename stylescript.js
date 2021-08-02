let allAlignmentOptions = document.querySelectorAll(".alignment-section span");
let body=document.querySelector("body");

let allColorOptions = document.querySelectorAll(".color-section span");

let menuBarOptions=document.querySelectorAll(".menu-bar-section");

let fileOptions=menuBarOptions[0];

let leftAlign = allAlignmentOptions[0];
let centerAlign = allAlignmentOptions[1];
let rightAlign = allAlignmentOptions[2];

let bgColorPicker = allColorOptions[0];
let fontColorPicker = allColorOptions[1];

leftAlign.addEventListener("click", function () {
  if (lastCell) {
    lastCell.style.textAlign = "left";
    let address = lastCell.getAttribute("data-address");
    dataObj[address].align = "left";
  }
});

rightAlign.addEventListener("click", function () {
  if (lastCell) {
    lastCell.style.textAlign = "right";
    let address = lastCell.getAttribute("data-address");
    dataObj[address].align = "right";
  }
});

centerAlign.addEventListener("click", function () {
  if (lastCell) {
    lastCell.style.textAlign = "center";
    let address = lastCell.getAttribute("data-address");
    dataObj[address].align = "center";
  }
});

let styleOptions=document.querySelectorAll(".font-style span");

let bold=styleOptions[0];
let italic=styleOptions[1];
let underline=styleOptions[2];

bold.addEventListener("click",function(){
    if (lastCell) {
        lastCell.style.fontWeight = "bold";
        let address = lastCell.getAttribute("data-address");
        dataObj[address].style = "bold";
    }
})

italic.addEventListener("click",function(){
    if (lastCell) {
        lastCell.style.fontStyle = "italic";
        let address = lastCell.getAttribute("data-address");
        dataObj[address].style = "italic";
    }
})

underline.addEventListener("click",function(){
    if (lastCell) {
        lastCell.style.textDecoration = "underline";
        let address = lastCell.getAttribute("data-address");
        dataObj[address].style = "underline";
    }
})

bgColorPicker.addEventListener("click", function () {
    let colorPickerElement = document.createElement("input");
    colorPickerElement.type = "color";
    body.append(colorPickerElement);
    colorPickerElement.click();
  
    colorPickerElement.addEventListener("input", function (e) {
      console.log(e.currentTarget.value);
      if (lastCell) {
        lastCell.style.backgroundColor = e.currentTarget.value;
        let address = lastCell.getAttribute("data-address");
        dataObj[address].bgColor = e.currentTarget.value;
      }
    });
});

fontColorPicker.addEventListener("click", function () {
    let colorPickerElement = document.createElement("input");
    colorPickerElement.type = "color";
    body.append(colorPickerElement);
    colorPickerElement.click();
    
    colorPickerElement.addEventListener("input", function (e) {
        console.log(e.currentTarget.value);
        if (lastCell) {
          lastCell.style.color = e.currentTarget.value;
          let address = lastCell.getAttribute("data-address");
          dataObj[address].color = e.currentTarget.value;
        }
    });
});

fileOptions.addEventListener("click",function(e){
    let isOpen=fileOptions.getAttribute("data-open");

    if(isOpen=="true"){
        fileOptions.setAttribute("data-open","false");
        document.querySelector(".file-drop-down").remove();
    }

    else{
        fileOptions.setAttribute("data-open","true");
        let dropDown=document.createElement("div");
        dropDown.innerHTML="<p>Save</p><p>Clear</p>";

        let allOptions=dropDown.querySelectorAll("p");

        allOptions[0].addEventListener("click",function(e){
            localStorage.setItem("sheet",JSON.stringify(dataObj));
        })

        allOptions[1].addEventListener("click",function(e){
            localStorage.setItem("sheet","");
        })

        dropDown.classList.add("file-drop-down");
        fileOptions.append(dropDown);
    }
})