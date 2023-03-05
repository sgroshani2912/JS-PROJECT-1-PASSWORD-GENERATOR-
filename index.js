const passwordDisp = document.querySelector("[passDisplay]");
const copyMsg = document.querySelector("[copymsg]");
const copyButton = document.querySelector("[copyButton]");
const inputSlider = document.querySelector("[length-slider]");
const displayLength = document.getElementById("data-length");
const uppercheck = document.querySelector("#uppercase");
const lowercheck = document.querySelector("#lowercase");
const numbercheck = document.querySelector("#numbers");
const symbolcheck = document.querySelector("#symbols");
const indicator = document.querySelector("[strength-indicator]");
const generateButton = document.querySelector(".generate-button");
const allCheckbox = document.querySelectorAll("input[type=checkbox]");

let password = "";
let passLength = 10;
let checkCount = 0;
const symbol = '!@#$%^&*()_+-=:;\',~`';
setIndicator("#ccc");
handleSLider();

//Set strength colour to grey-white

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisp.value);
        copyMsg.innerText = "Copied";
    }
    catch(e){
        copyMsg.innerText = "Failed";
    }
    copyMsg.classList.add("active");
    setTimeout( () => {
        copyMsg.classList.remove("active");
    },1500);
     

}

function handleSLider(){
    inputSlider.value = passLength;
    displayLength.innerText = passLength;

    //Additional part
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passLength-min)*100/(max-min)) + "% 100%"
}


function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 5px $(color)`; 
}

function getRandominteger(min, max){
    return Math.floor(Math.random()*(max-min)+min);
}

function getRandomNum(){
    return getRandominteger(0,9);
}

function getRandomupper(){
    return String.fromCharCode(getRandominteger(65,91));

}

function getRandomlower(){
    return String.fromCharCode(getRandominteger(97,123));
}

function getRandomsymbol(){
    const randNum = getRandominteger(0,symbol.length);
    return symbol.charAt(randNum);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSymbol = false;
    if(uppercheck.checked) hasUpper = true;
    if(lowercheck.checked) hasLower = true;
    if(numbercheck.checked) hasNumber = true;
    if(symbolcheck.checked) hasSymbol = true;

    if(hasLower && hasUpper && (hasNumber || hasSymbol) && passLength>=8){
        setIndicator("#0f0");
    }
    else if((hasLower || hasUpper) && (hasNumber || hasSymbol) && passLength>=6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

copyButton.addEventListener('click',()=>{
    if(passwordDisp.value){
        copyContent();
    }
}
    
) 

inputSlider.addEventListener('input',(e)=>{
    passLength = e.target.value;
    handleSLider();
})

function handleCheckBoxChange(){
    checkCount=0;
    allCheckbox.forEach((checkbox)=>{
        if(checkbox.checked){
            checkCount++;
        }
        //Special corner case
        if(passLength<checkCount){
            passLength=checkcount;
            handleSLider();
        }
    })
}

allCheckbox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange);
})

function shufflePassword(array){
    //Fisher Yates method; 
    for(let i = array.length-1; i>0; i--){
        const j = Math.floor(Math.random()*(i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j]=temp;
    }
    let str="";
    array.forEach((el)=>(str+=el));
    return str;

}

generateButton.addEventListener('click',()=>{
    //If none of the boxes are checked
    if(checkCount<=0) return;
    if(passLength<checkCount){
        passLength = checkCount;
        handleSLider();
    }

    console.log("Starting the journey");
    //Remove old password
    password = "";

    //Lets put the stuff mentioned by the checkboxes
    // if(uppercheck.checked){
    //     password+=getRandomupper();
    // }
    // if(lowercheck.checked){
    //     password+=getRandomlower();
    // }
    // if(numbercheck.checked){
    //     password+=getRandomNum();
    // }
    // if(symbolcheck.checked){
    //     password+=getRandomsymbol();
    // }
    let funArr = [];
    if(uppercheck.checked){
        funArr.push(getRandomupper);
    }
    if(lowercheck.checked){
        funArr.push(getRandomlower);
    }
    if(numbercheck.checked){
        funArr.push(getRandomNum);
    }
    if(symbolcheck.checked){
        funArr.push(getRandomsymbol);
    }

    //Necessary addition
    for(let i=0; i<funArr.length;i++){
        password+=funArr[i]();
    }

    //Remaining addition
    for(let i=0; i<passLength-funArr.length ; i++){
        let randIndex = getRandominteger(0,funArr.length);
        password+=funArr[randIndex]();
    }

    //Shuffle the password
    password = shufflePassword(Array.from(password));

    //Displaying password
    passwordDisp.value = password;
    calcStrength();
    
})




