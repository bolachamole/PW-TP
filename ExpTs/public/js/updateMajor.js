let nome = document.getElementById("majorName");
let code = document.getElementById("majorCode");
let desc = document.getElementById("majorDesc");
const id = window.location.pathname.split("/").pop();

function updateMajor() {
  let nomeValue = nome.value;
  let codeValue = code.value;
  let descValue = desc.value;
  console.log(id); // d505bbf3-af6b-4fa5-90e4-04696e610e1f
  if (!nomeValue || !codeValue) {
    alert("Preencha todos os campos!");
    return;
  }
  console.log(`modificando ${id}`);
  fetch(`/major/update/${id}`, {
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
