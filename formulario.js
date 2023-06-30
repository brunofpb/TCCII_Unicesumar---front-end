const formulario = document.querySelector("form");
const Inome = document.querySelector(".nome");
const Idata = document.querySelector(".data");
const Iemail = document.querySelector(".email");
const Itelefone = document.querySelector(".telefone");
const Isetor = document.querySelector(".setor");
const Iprioridade = document.querySelector(".prioridade");
const Isolicitacao = document.querySelector(".solicita");

const sucesso = "Solicitação cadastrada com sucesso!";
const erro = "Todos os campos devem ser preenchidos!";

// Função que verifica se tem algum campo vazio, se sim, retorna erro e não grava
function alerta() {
  if (
    Isolicitacao.value === "" ||
    Inome.value === "" ||
    Idata.value === "" ||
    Iemail.value === "" ||
    Itelefone.value === "" ||
    Isetor.value === "" ||
    Iprioridade.value === ""
  ) {
    alert(erro);
  } else {
    alert(sucesso);
  }
}

function formatDateForAPI(dateString) {
  const [year, month, day] = dateString.split("-");
  return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
}

// Realizar requisição para a API
function post() {
  const data = {
    nome: Inome.value,
    data: formatDateForAPI(Idata.value),
    email: Iemail.value,
    telefone: Itelefone.value,
    setor: Isetor.value,
    prioridade: Iprioridade.value,
    desc_solicitacao: Isolicitacao.value,
    status: "Aberto"
  };

  fetch("http://localhost:8080/solicitacao", {
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    method: "POST",
    body: JSON.stringify(data)
  })
    .then(function (res) {
      console.log(res);
    })
    .catch(function (res) {
      console.log(res);
    });
}

// Função para limpar os campos
function limpar() {
  Inome.value = "";
  Idata.value = "";
  Iemail.value = "";
  Itelefone.value = "";
  Isetor.value = "";
  Iprioridade.value = "";
  Isolicitacao.value = "";
}

formulario.addEventListener("submit", function (event) {
  event.preventDefault();

  alerta();
  post();
  limpar();
});