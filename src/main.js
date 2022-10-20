import "./css/index.css"
import IMask from "imask"

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

//funcionalidade para pegar qual o tipo de cartão
function setCardType(type) {
  const colors = {
    visa: ["#436D99", "#2D57F2"],
    mastercard: ["#DF6F29", "#C69347"],
    default: ["black", "gray"],
  }

  ccBgColor01.setAttribute("fill", colors[type][0]) //muda de acordo com o tipo de cartão
  ccBgColor02.setAttribute("fill", colors[type][1])
  ccLogo.setAttribute("src", `cc-${type}.svg`)
}

globalThis.setCardType = setCardType

const securityCode = document.querySelector("#security-code")
const securityCodePattern = {
  mask: "0000",
}
const securityCodeMasked = IMask(securityCode, securityCodePattern)

//validação da data de expiração
const expirationDate = document.querySelector("#expiration-date")
const expirationDatePattern = {
  mask: "MM{/}YY", //propriedade pro mes que validando numero de 1 a 12 não aceitando outro números
  blocks: {
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
  },
}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

const cardNumber = document.querySelector("#card-number")
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    },
  ],

  //o replace esta fazendo uma buscar por NÃO DIGITOS \D/ e subistituindo por vazio, aceitando somente numeros
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")
    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex)
    })

    return foundMask
  },
}
const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

//função de click do botão
const addButton = document.querySelector("#add-card")
addButton.addEventListener("click", () => {
  alert("Cartão adicionado!")
})
//selecionou todo o form que pega todos os inputs
//add 2 eventos e um deles add o submit msm não estando no html
document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault()
})

//função de validação do nome
const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value")

  ccHolder.innerText =
    cardHolder.value.length === 0 ? "FULANO DA SILVA" : cardHolder.value
})

//obter e exibir o cvc do cartão
securityCodeMasked.on("accept", () => {
  updateSecurityCode(securityCodeMasked.value)
})

function updateSecurityCode(code) {
  const ccSecurity = document.querySelector(".cc-security .value")

  ccSecurity.innerText = code.length === 0 ? "123" : code
}

cardNumberMasked.on("accept", () => {
  const cardType = cardNumberMasked.masked.currentMask.cardtype
  setCardType(cardType)
  updateCardNumber(cardNumberMasked.value)
})

function updateCardNumber(number) {
  const ccNumber = document.querySelector(".cc-number")
  ccNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number
}

expirationDateMasked.on("accept", () => {
  updateExpirationDate(expirationDateMasked.value)
})

function updateExpirationDate(date) {
  const ccExpiration = document.querySelector(".cc-extra .value")
  ccExpiration.innerText = date.length === 0 ? "02/32" : date
}

// //validação das regras número de cartão quando é visa ou mc (REGEX )

// //regra do visa
// //inicar com 4 seguido de mais 15 digitos

// //regra do master
// //inicia com 5, seguido de um dígito entre 1 e 5, seguido de 0 ou maus 2 dígitos 5[1-5]\d{0,2}
// //OU (^5[1-5]\d{0,2}|22[2-9\d|^[3-7]\d{0,2}]})
// // inicia com 22, seguido de um digito entre 2 e 9, seguido de 0 ou mais 1 digito
// //OU
// //inicia com 2, seguido de um dogito entre 3 e 7, seguido de 0 ou mais 2 digitos
// //segido de mais 12 digitos
