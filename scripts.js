const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

//initially
let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
//set the strength circle color to grey
setIndicator("#ccc");


//set passwordLength
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min) * 100 / (max - min)) + "% 100%"
    // above code                         for width                                for height    adjusment
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    // shadow
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;

}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
function generateRndNumber() {
    return getRndInteger(0, 9);
}
function generateLowerCase() {
    return String.fromCharCode(getRndInteger(97, 123));
}
function generateUppperCase() {
    return String.fromCharCode(getRndInteger(65, 91));
}
function generateSymbol() {
    let ind = getRndInteger(0, symbols.length);
    //    return symbols['ind'];
    return symbols.charAt(ind);
}

//rules
function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
    } else if (
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        passwordLength >= 6
    ) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}

//async don't handle error implicilty that's why we used then catch
//to handle error in asyn we have to explicilty use try catch block
//in then catch we use chaining

//copy sontent

function copyContent() {
    const textarea = document.createElement('textarea');
    textarea.value = passwordDisplay.value;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);

    copyMsg.innerText = "Copied";
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

// async function copyContent() {
//     try {
//         await navigator.clipboard.writeText(passwordDisplay.value);  //this function is to copy to clipboard
//         copyMsg.innerText = "copied";
//     }
//     catch(e) {
//         copyMsg.innerText = "Failed";
//     }
//     //to make copy wala span visible
//     copyMsg.classList.add("active");

//     setTimeout( () => {
//         copyMsg.classList.remove("active");
//     },2000);

// }

/*await navigator.clipboard.writeText(passwordDisplay.value) is a statement that uses the Clipboard API to write the generated password to the clipboard.
 
   The writeText() method of the Clipboard interface writes the provided text to the clipboard. It returns a Promise that resolves when the text has been successfully written to the clipboard.
 
   By using the await keyword before the navigator.clipboard.writeText(passwordDisplay.value) statement, the code waits until the Promise resolves before moving on to the next line of code. This ensures that the password is successfully written to the clipboard before any further actions are taken.
   */


//to make <copied> span visible
function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}
function handleCheckboxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked) {
            checkCount++;
        }
    });
    // special case
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}
allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckboxChange);
})
inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})
copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value)
        copyContent();
})
generateBtn.addEventListener('click', () => {
    //none of the checkbox are selected

    if (checkCount == 0)
        return;

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    // let's start the jouney to find new password
    console.log("Starting the Journey");
    //remove old password
    password = "";

    //let's put the stuff mentioned by checkboxes

    // if(uppercaseCheck.checked) {
    //     password += generateUpperCase();
    // }

    // if(lowercaseCheck.checked) {
    //     password += generateLowerCase();
    // }

    // if(numbersCheck.checked) {
    //     password += generateRandomNumber();
    // }

    // if(symbolsCheck.checked) {
    //     password += generateSymbol();
    // }

    let funcArr = [];

    if (uppercaseCheck.checked)
        funcArr.push(generateUppperCase);

    if (lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

    if (numbersCheck.checked)
        funcArr.push(generateRndNumber);

    if (symbolsCheck.checked)
        funcArr.push(generateSymbol);

    //compulsory addition
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }
    console.log("COmpulsory adddition done");

    //remaining adddition
    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randIndex = getRndInteger(0, funcArr.length);
        console.log("randIndex" + randIndex);
        password += funcArr[randIndex]();
    }
    console.log("Remaining adddition done");
    //shuffle the password
    password = shufflePassword(Array.from(password));
    console.log("Shuffling done");
    //show in UI
    passwordDisplay.value = password;
    console.log("UI adddition done");
    //calculate strength
    calcStrength();
});