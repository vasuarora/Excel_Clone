let rowNumberSection = document.querySelector(".row-number-section");

let formulaBarSelectedCellArea = document.querySelector(".selected-cell-div");

let cellSection = document.querySelector(".cell-section");

let columnTagsSection = document.querySelector(".column-tag-section");

let formulaInput=document.querySelector(".formula-input-section");

let lastCell;

let dataObj={};

formulaInput.addEventListener("keydown", function (e) {
  if (e.key == "Enter") {

    let typedFormula = e.currentTarget.value;
    console.log(typedFormula);

    if (!lastCell) return;                  //incase of no cell selected

    let selectedCellAdd = lastCell.getAttribute("data-address");              //selected cell address
    let cellObj = dataObj[selectedCellAdd];

    cellObj.formula = typedFormula;           //new formula

    let upstream = cellObj.upstream;

    for (let k = 0; k < upstream.length; k++) {
      removeFromDownstream(upstream[k], selectedCellAdd);                 //removing curr cell from children downstream
    }

    cellObj.upstream = [];

    let formulaArr = typedFormula.split(" ");            //to extract cells present in the formula
    let cellsInFormula = [];

    for (let i = 0; i < formulaArr.length; i++) {
      if (
        formulaArr[i] != "+" &&
        formulaArr[i] != "-" &&
        formulaArr[i] != "*" &&
        formulaArr[i] != "/" &&
        isNaN(formulaArr[i])
      ) {
        cellsInFormula.push(formulaArr[i]);
      }
    }

    for (let i = 0; i < cellsInFormula.length; i++) {
      addToDownstream(cellsInFormula[i], selectedCellAdd);     //adding curr cell in downstream of child cell
    }
    cellObj.upstream = cellsInFormula;                            //creating new upstream      
    let valObj = {};

    for (let i = 0; i < cellsInFormula.length; i++) {
      let cellValue = dataObj[cellsInFormula[i]].value;

      valObj[cellsInFormula[i]] = cellValue;
    }

    for (let key in valObj) {
      typedFormula = typedFormula.replace(key, valObj[key]);
    }

    let newValue = eval(typedFormula);             //evaluating formula

    lastCell.innerText = newValue

    cellObj.value = newValue;

    let downstream = cellObj.downstream;

    for (let i = 0; i < downstream.length; i++) {
      updateCell(downstream[i]);                       //updating the children downstream
    }

    dataObj[selectedCellAdd] = cellObj;
    formulaInput.value="";
  }
});

cellSection.addEventListener("scroll",function(e){
  rowNumberSection.style.transform=`translateY(-${e.currentTarget.scrollTop}px)`;                  //this will give us scroll pixels and acc to that we will move our row

  columnTagsSection.style.transform=`translateX(-${e.currentTarget.scrollLeft}px)`;                //this will give us scroll pixels and acc to that we will move our column
})

for(let i = 1;i<=100;i++){
    let div = document.createElement("div")
    div.innerText = i
    div.classList.add("row-number")
    rowNumberSection.append(div)
}

for(let i = 0;i<26;i++){

    let asciiCode = 65 + i; 

    let reqAlphabet = String.fromCharCode(asciiCode)

    let div = document.createElement("div")
    div.innerText = reqAlphabet;
    div.classList.add("column-tag")
    columnTagsSection.append(div)
}

for (let i = 1; i <= 100; i++) {
    let rowDiv = document.createElement("div");
    rowDiv.classList.add("row");
                         
    for (let j = 0; j < 26; j++) {       //i = 100   j = 25  asciiCode = 65+25=90  alpha = z  cellAdd = Z100
      // A to Z
      let asciiCode = 65 + j;
  
      let reqAlphabet = String.fromCharCode(asciiCode);
  
      let cellAddress = reqAlphabet + i;

      dataObj[cellAddress]={
        value:undefined,
        formula:undefined,
        upstream:[],
        downstream:[], 
        bold:"",
        italic:"",
        underline:"",
        align: "left",
        color: "black",
        bgColor: "white",
      };
  
      let cellDiv = document.createElement("div");

      //downstream=all those cells in whose formula depends current cell.
      //upstream=all those cells that appear in current cell formula.

      cellDiv.addEventListener("input",function(e){
        let currCellAddress=e.currentTarget.getAttribute("data-address");

        let currCellObj=dataObj[currCellAddress];

        currCellObj.value=e.currentTarget.innerText;      //update value
        currCellObj.formula=undefined;                    //make formula undefined

        let currUpstream=currCellObj.upstream;

        for(let k=0;k<currUpstream.length;k++){
          removeFromDownStream(currUpstream[k],currCellAddress);          //removing curr cell from children downstream      
        }

        currCellObj.upstream=[];             //emptying the curr cell upstream

        let currDownStream=currCellObj.downstream;

        for(let i=0;i<currDownStream.length;i++){             //updating the cells in which curr cell is used as formula
          updateCell(currDownStream[i]);
        }

        dataObj[currCellAddress]=currCellObj;

        console.log(currCellObj);
      });
  
      cellDiv.classList.add("cell");

      cellDiv.contentEditable = true
  
      cellDiv.setAttribute("data-address", cellAddress);

      cellDiv.addEventListener("click",function(e){              //showing the curr cell selected
        if(lastCell){
          lastCell.classList.remove("cell-selected");
        }

        e.currentTarget.classList.add("cell-selected");

        lastCell=e.currentTarget;

        let currCellAddress=e.currentTarget.getAttribute("data-address");

        formulaBarSelectedCellArea.innerText=currCellAddress;
      })

      rowDiv.append(cellDiv);
    }
  
    cellSection.append(rowDiv)
  }

  if(localStorage.getItem("sheet")){                            //storing the cell objects in local storage
    dataObj=JSON.parse(localStorage.getItem("sheet"));

    for(let x in dataObj){
      let cell=document.querySelector(`[data-address='${x}']`)
      if(dataObj[x].value){
        cell.innerText=dataObj[x].value;

        cell.style.fontWeight=dataObj[x].bold;
        cell.style.fontStyle=dataObj[x].italic;
        cell.style.textDecoration=dataObj[x].underline;
        cell.style.textAlign=dataObj[x].align;
      }

      cell.style.color=dataObj[x].color;
      cell.style.backgroundColor=dataObj[x].bgColor;
    }
}

  function removeFromDownStream(parentCell,childCell){
    //fetch parent's cell downstream

    let parentDownstream=dataObj[parentCell].downstream;

    //filter childcell from parent's downstream

    let filteredDownStream=[];

    for(let i=0;i<parentDownstream.length;i++){
      if(parentDownstream[i]!=childCell){
        filteredDownStream.push(parentDownstream[i]);
      }
    }

    //save filtered upstream back in obj

    dataObj[parentCell].downstream=filteredDownStream;
  }

  function updateCell(cell){
    let cellObj=dataObj[cell];
    let upstream=cellObj.upstream;
    let formula=cellObj.formula;

    // upstream me jobhi cell hai unke objects me jaunga whase unki value lekr aunga 
  // wo sari values mai ek object me key value pair form me store krunga where key being the cell address 

    let valObj={};

    for(let i=0;i<upstream.length;i++){
      let cellValue=dataObj[upstream[i]].value;
      valObj[upstream[i]]=cellValue;           //updating the cell value
    }

    for(let key in valObj){
      formula=formula.replace(key,valObj[key]);          //replacing the formula cells with cell value
    }
    
    let newValue=eval(formula);

    let dataOnUi=document.querySelector("[data-address=${cell}]");

    dataObj[cell].value=newValue;

    let downstream=cellObj.downstream;

    for(let i=0;i<downstream.length;i++){                  //recursive call to other children which depend on the current child
      updateCell(downstream[i]);
    }
  }

  function addToDownstream(parent, child) {
    // child ko parent ki downstream me add krna hai
    dataObj[parent].downstream.push(child);
  }