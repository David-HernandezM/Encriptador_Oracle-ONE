const textArea = document.querySelector("#user-input");
const encryptButton = document.querySelector("#encrypt");
const decryptButton = document.querySelector("#decrypt");
const copyMessageButton = document.querySelector("#copy-button");
const noMessageWindow = document.querySelector(".no__message");
const messageContainer = document.querySelector(".message__container");
const textAreaMessage = document.querySelector("#text-encrypted");

let userInput = "";
let text = "";

copyMessageButton.onclick = () => {
  const selection = document.createRange();
  selection.selectNodeContents(textAreaMessage);
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(selection);
  const res = document.execCommand('copy');
  window.getSelection().removeRange(selection);
}

decryptButton.onclick = async () => {
  disableButtons(true);
  userInput = textArea.value.trim();
  text = userInput.slice(0, userInput.length);
  deCrypt(userInput)
    .then(result => {
 
    });
  let result = await deCrypt(userInput);
  if (result) {
    noMessageWindow.style.display = "none";
    messageContainer.style.display = "flex";
    await showEnCryptedMesdage(result, textAreaMessage);
    disableButtons(false);
  } else {
    noMessageWindow.style.display = "flex";
    messageContainer.style.display = "none";
    textAreaMessage.innerText = "";
    disableButtons(false);
  }

}

encryptButton.onclick = async () => {
  disableButtons(true);
  userInput = textArea.value.trim();
  text = userInput.slice(0, userInput.length);
  const result = await encrypt(userInput, textArea, textAreaMessage);
  if (result) {
    noMessageWindow.style.display = "none";
    messageContainer.style.display = "flex";
    await showEnCryptedMesdage(result, textAreaMessage);
    disableButtons(false);
  } else {
    noMessageWindow.style.display = "flex";
    messageContainer.style.display = "none";
    textAreaMessage.innerText = "";
    disableButtons(false);
  }

}

async function showEnCryptedMesdage(text, display) {
  await deleteTextFromElement(textAreaMessage, "innerText");
  await putTextInElement(text, display, "innerText");
  return new Promise(res => {
    res(1);
  });
}

const deCrypt = async (text) => {
  let result = "";
  let index = 1;
  let letters = [];
  let wordCrypt = "";
  let checkNext = false;
  let errorIndex = haveOnlyLettersLowerCase(text);

  if (text == "") {
    let result = await throwErrorMessage();
    return new Promise(haveText => {
      haveText(result);
    });
  }

  await deleteTextFromElement(textArea, "value", errorIndex, true, "red");

  if (errorIndex != -1) {
    let error = await throwErrorMessage(errorIndex, "error");
    return new Promise(res => {
      res(error);
    });
  }

  for (let i = 0; i < text.length; i++) {
    if (checkNext) {
      letters.push(text[i]);
      if (index == wordCrypt.length-1 && wordCrypt[index] == text[i]) {
        result += wordCrypt[0];
        checkNext = false;
        letters = [];
        index = 1;
        continue;
      } else if (wordCrypt[index] != text[i]) {
        index = 0;
        checkNext = false;
        result += letters.join("");
        letters = [];
      } else {
        index ++;
        continue;
      }
    }
    if (isVowel(text[i])) {
      wordCrypt = encryptLetter(text[i]);
      letters.push(text[i]);
      checkNext = true;
    } else {
      result += text[i];
      checkNext = false;
    }
  }
  return new Promise(res => {
    res(result);
  });
}

async function encrypt(text, input, display) {
  let errorIndex = haveOnlyLettersLowerCase(text);

  if (text == "") {
    let result = await throwErrorMessage();
    return new Promise(haveText => {
      haveText(result);
    });
  }

  await deleteTextFromElement(textArea, "value", errorIndex, true, "red");

  if (errorIndex != -1) {
    let error = await throwErrorMessage(errorIndex, "error");
    return new Promise(res => {
      res(error);
    });
  }

  return new Promise(res => {
    setTimeout(() => {
      res(errorIndex != -1 ? "" : cryptMessage(text));
    }, 500);
  });
}

const cryptMessage = (text) => {
  let crypted = "";
  for (let i = 0; i < text.length; i++) {
    crypted += encryptLetter(text[i]);
  }
  return crypted;
}

async function putTextInElement(text, element, elementTypeText, time=30) {
  let aux = "";
  while (text.length > 0) {
    aux = await addBeginLetter(aux, text[text.length-1], time);
    if (elementTypeText == "innerText") {
      element.innerText = aux;
    } else {
      element.value = aux;
    }
    text = text.slice(0, text.length-1);
  }
  return new Promise(resolve => {
    resolve(true);
  });
}

async function deleteTextFromElement(element, elementTypeText, delayOnIndex=-1, changeColorOnIndex=false, color="none") {
  let aux = elementTypeText == "innerText" ? element.innerText : element.value;
  let textLength = aux.length;
  for (let i = 0; i < textLength; i++) {
    if (changeColorOnIndex && i == delayOnIndex) {
      element.style.color = color;
    }
    aux = await deleteFirstLetter(aux, i == delayOnIndex ? 500 : 20);
    if (elementTypeText == "innerText") {
      element.innerText = aux;
    } else {
      element.value = aux;
    }
  }
  return new Promise(resolve => {
    resolve(true);
  });
}

async function throwErrorMessage(index=-1, text="") {
  let errorMessage = "No se permiten mayúsculas o vocales con acento!";

  if (text == "") {
    await deleteTextFromElement(textAreaMessage, "innerText");
    return new Promise(haveText => {
      haveText(false);
    });
  }

  if (index != -1) {
    await putTextInElement(errorMessage, textArea, "value");
    await (new Promise(res => {
      setTimeout(() => {
        res(1);
      }, 1500);
    }));
    await deleteTextFromElement(textArea, "value");
    textArea.style.color = "#495057";
    await deleteTextFromElement(textAreaMessage, "innerText");
  }

  return new Promise(res => {
    setTimeout(() => {
      res("");
    }, 500);
  });

}

const haveOnlyLettersLowerCase = (text) =>{
  for (let i = 0; i < text.length; i++) {
    const letterCharCode = text.charCodeAt(i);
    if (letterCharCode >= 65 && letterCharCode <= 90 || isAccentedVowel(text[i])) {
      return i;
    }
  }
  return -1;
}

const encryptLetter = (letter) => {
  const cryptedLetters = {
    a: "ai",
    e: "enter",
    i: "imes",
    o: "ober",
    u: "ufat"
  };
  return cryptedLetters[letter] || letter;
}

const isVowel = (letter) => {
  switch(letter) {
    case 'a': case 'e': case 'i': case 'o': case 'u':
      return true;
    default:
      return false;
  }
}

const isAccentedVowel = (letter) => {
  switch (letter) {
    case "á": case "é": case "í": case "ó": case "ú":
      return true;
    default:
      return false;
  }
}

const addBeginLetter = (text, letter, time=30) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(letter + text);
    }, time);
  });
}

const deleteFirstLetter = (text, time=20) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(text.slice(1, text.length));
    }, time);
  });
}

const disableButtons = (enable) => {
  encryptButton.disabled = enable;
  decryptButton.disabled = enable;
  copyMessageButton.disabled = enable;
}



