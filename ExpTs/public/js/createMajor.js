let nome = document.getElementById("majorName");
let code = document.getElementById("majorCode");
let desc = document.getElementById("majorDesc");

function createMajor() {
  let nomeValue = nome.value;
  let codeValue = code.value;
  let descValue = desc.value;
  if (!nomeValue || !codeValue) {
    alert("Preencha todos os campos!");
    return;
  }
  fetch("/major/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: nomeValue,
      code: codeValue,
      description: descValue,
    }),
  }).then((response) => {
    if (response.status === 200) {
      return response.json().then((data) => {
        window.location.href = data.redirect;
      });
    } else if (response.status === 500) {
      return response.json().then((data) => {
        console.log("Erro: " + data.error);
      });
    }
  });
}
