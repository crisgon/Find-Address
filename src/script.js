const $cepInput = document.getElementById("cep-input");
const $cepInfo = document.getElementById("cep-info");
const $btnCopy = document.getElementById("btn-copy");
const $addressForm = document.getElementById("address-form");
const $addressNotFound = document.getElementById("not-found-message");

let cepValue = "";
let cepInfo = null;

$cepInput.addEventListener("input", handleInputCepValue);

$addressForm.addEventListener("submit", handleSubmitForm);

$btnCopy.addEventListener("click", handleBtnCopyAddressInfo);

function handleInputCepValue(event) {
  cepValue = event.target.value;
}

async function handleSubmitForm(event) {
  event.preventDefault();

  await fetch(`https://viacep.com.br/ws/${cepValue}/json`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      cepInfo = data;
    });

  showInfoSection();
  populateTextArea();
}

function handleBtnCopyAddressInfo() {
  $cepInfo.select();
  document.execCommand("copy");
}

function showInfoSection() {
  if (cepInfo !== null) {
    $cepInfo.style.display = "block";
    $btnCopy.style.display = "block";
    $addressNotFound.style.display = "none";
  }
}

function populateTextArea() {
  $cepInfo.innerHTML = `
  Bairro: ${cepInfo.bairro} &#13;&#10;
  Cep: ${cepInfo.cep} &#13;&#10;
  Complemento: ${cepInfo.complemento || "Não existe"} &#13;&#10;
  Endereço: ${cepInfo.logradouro} &#13;&#10;
  Cidade: ${cepInfo.localidade} &#13;&#10;
  UF: ${cepInfo.uf}
  `;
}
