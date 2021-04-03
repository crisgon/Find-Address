function $(id) {
  return document.getElementById(id);
}

const $cepInput = $("cep-input");
const $cepInfoTextArea = $("cep-info");
const $btnCopy = $("btn-copy");
const $addressForm = $("address-form");
const $addressNotFound = $("not-found-message");
const $copyMessage = $("copy-message");
const $erroMessage = $("error-message");

let cepValue = "";
let cepInfo = null;

$cepInput.addEventListener("input", handleInputCepValue);

$addressForm.addEventListener("submit", handleSubmitForm);

$btnCopy.addEventListener("click", handleBtnCopyAddressInfo);

function handleInputCepValue(event) {
  cepValue = event.target.value;
  $erroMessage.style.opacity = 0;
}

async function handleSubmitForm(event) {
  event.preventDefault();

  if (cepValue.length !== 8) {
    $erroMessage.style.opacity = 1;
    $erroMessage.innerText = "❌ Invalid CEP";
    return;
  }

  await fetch(`https://viacep.com.br/ws/${cepValue}/json`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (getApiError(data)) {
        $erroMessage.innerText = "Ops. Api error!";
        $erroMessage.style.opacity = 1;
        cepInfo = null;
      } else {
        cepInfo = data;
      }
    });

  showInfoSection();
  populateTextArea();
}

function getApiError(obj) {
  if (obj.erro) {
    return true;
  }

  return false;
}

function handleBtnCopyAddressInfo() {
  $cepInfoTextArea.select();
  document.execCommand("copy");

  $copyMessage.style.opacity = 1;

  setTimeout(() => {
    $copyMessage.style.opacity = 0;
  }, 3000);
}

function showInfoSection() {
  if (cepInfo !== null) {
    $cepInfoTextArea.style.display = "block";
    $btnCopy.style.display = "block";
    $addressNotFound.style.display = "none";
  }
}

function populateTextArea() {
  if (cepInfo) {
    $cepInfoTextArea.innerHTML = `
    Bairro: ${cepInfo.bairro} &#13;&#10;
    Cep: ${cepInfo.cep} &#13;&#10;
    Complemento: ${cepInfo.complemento || "Não existe"} &#13;&#10;
    Endereço: ${cepInfo.logradouro} &#13;&#10;
    Cidade: ${cepInfo.localidade} &#13;&#10;
    UF: ${cepInfo.uf}
  `;
  }
}
