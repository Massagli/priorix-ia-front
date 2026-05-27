const cardsContainer =
  document.getElementById(
    "cards-container"
  );

const totalPedidos =
  document.getElementById(
    "total-pedidos"
  );

const altaStatus =
  document.getElementById(
    "alta-status"
  );

const mediaStatus =
  document.getElementById(
    "media-status"
  );

const baixaStatus =
  document.getElementById(
    "baixa-status"
  );

const sendBtn =
  document.getElementById(
    "sendBtn"
  );

const messages =
  document.getElementById(
    "messages"
  );

const input =
  document.getElementById(
    "messageInput"
  );

const filterPriority =
  document.getElementById(
    "filterPriority"
  );

const sortDate =
  document.getElementById(
    "sortDate"
  );




let etapa = 0;

const novaEncomenda = {
  titulo: "",
  descricao: "",
  data_entrega: "",
  tipo_bolo: "",
  cliente: ""
};



function botMessage(text) {

  const div =
    document.createElement("div");

  div.classList.add(
    "message",
    "bot"
  );

  div.innerText = text;

  messages.appendChild(div);

  messages.scrollTop =
    messages.scrollHeight;

}



function userMessage(text) {

  const div =
    document.createElement("div");

  div.classList.add(
    "message",
    "user-msg"
  );

  div.innerText = text;

  messages.appendChild(div);

  messages.scrollTop =
    messages.scrollHeight;

}




function mostrarOpcoesTipo() {

  const div =
    document.createElement("div");

  div.classList.add("options");

  div.innerHTML = `

    <button
      class="option-btn"
      onclick="selecionarTipo('casamento')"
    >
      Casamento
    </button>

    <button
      class="option-btn"
      onclick="selecionarTipo('confeitado')"
    >
      Confeitado
    </button>

    <button
      class="option-btn"
      onclick="selecionarTipo('simples')"
    >
      Simples
    </button>

  `;

  messages.appendChild(div);

  messages.scrollTop =
    messages.scrollHeight;

}




function selecionarTipo(tipo) {

  userMessage(tipo);

  novaEncomenda.tipo_bolo =
    tipo;

  etapa++;

  botMessage(
    "Quem é o cliente?"
  );

}




function reiniciarChat() {

  etapa = 0;

  novaEncomenda.titulo = "";
  novaEncomenda.descricao = "";
  novaEncomenda.data_entrega = "";
  novaEncomenda.tipo_bolo = "";
  novaEncomenda.cliente = "";

  setTimeout(() => {

    botMessage(
      "Vamos cadastrar uma nova encomenda 👋"
    );

    botMessage(
      "Qual o título do pedido?"
    );

  }, 500);

}




botMessage(
  "Olá 👋 Vamos cadastrar uma nova encomenda."
);

botMessage(
  "Qual o título do pedido?"
);




sendBtn.addEventListener(
  "click",
  async () => {

    const texto = input.value;

    if (!texto) return;

    if (etapa === 3) return;

    userMessage(texto);

    input.value = "";

    

    if (etapa === 0) {

      novaEncomenda.titulo =
        texto;

      etapa++;

      botMessage(
        "Agora me envie a descrição."
      );

    }

    

    else if (etapa === 1) {

      novaEncomenda.descricao =
        texto;

      etapa++;

      botMessage(
        "Qual a data de entrega? (AAAA-MM-DD)"
      );

    }

    

    else if (etapa === 2) {

      novaEncomenda.data_entrega =
        texto;

      etapa++;

      botMessage(
        "Escolha o tipo do pedido:"
      );

      mostrarOpcoesTipo();

    }

    

    else if (etapa === 4) {

      novaEncomenda.cliente =
        texto;

      botMessage(
        "Salvando encomenda..."
      );

      try {

        await fetch(
          "http://127.0.0.1:8000/encomendas",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify(
              novaEncomenda
            )
          }
        );

        botMessage(
          "✅ Encomenda criada!"
        );

        carregarEncomendas();

        reiniciarChat();

      }

      catch(error) {

        console.error(error);

        botMessage(
          "❌ Erro ao salvar."
        );

      }

    }

  }
);




async function deletarEncomenda(id) {

  try {

    await fetch(
      `http://127.0.0.1:8000/encomendas/${id}`,
      {
        method: "DELETE"
      }
    );

    botMessage(
      `🗑️ Encomenda ${id} removida.`
    );

    carregarEncomendas();

    reiniciarChat();

  }

  catch(error) {

    console.error(error);

  }

}




async function carregarEncomendas() {

  try {

    const response =
      await fetch(
        "http://127.0.0.1:8000/encomendas"
      );

    const encomendas =
      await response.json();

    cardsContainer.innerHTML = "";

    let alta = 0;
    let media = 0;
    let baixa = 0;



    let filtradas =
      [...encomendas];

    const prioridade =
      filterPriority.value;

    if (prioridade === "alta") {

      filtradas =
        filtradas.filter(
          item =>
            item.score_prioridade > 10
        );

    }

    else if (
      prioridade === "media"
    ) {

      filtradas =
        filtradas.filter(
          item =>
            item.score_prioridade >= 5 &&
            item.score_prioridade <= 10
        );

    }

    else if (
      prioridade === "baixa"
    ) {

      filtradas =
        filtradas.filter(
          item =>
            item.score_prioridade < 5
        );

    }


    filtradas.sort((a, b) => {

      const dataA =
        new Date(a.data_entrega);

      const dataB =
        new Date(b.data_entrega);

      if (
        sortDate.value ===
        "recentes"
      ) {

        return dataB - dataA;

      }

      return dataA - dataB;

    });



    filtradas.forEach((item) => {

      let priorityClass = "";
      let borderClass = "";
      let prioridadeTexto = "";

      if (
        item.score_prioridade > 10
      ) {

        priorityClass = "red";
        borderClass = "red-border";
        prioridadeTexto =
          "Alta Prioridade";

        alta++;

      }

      else if (
        item.score_prioridade >= 5 &&
        item.score_prioridade <= 10
      ) {

        priorityClass = "yellow";
        borderClass =
          "yellow-border";

        prioridadeTexto =
          "Média Prioridade";

        media++;

      }

      else {

        priorityClass = "green";
        borderClass =
          "green-border";

        prioridadeTexto =
          "Baixa Prioridade";

        baixa++;

      }

      const card =
        document.createElement("div");

      card.classList.add("card");

      card.innerHTML = `

        <div style="
          display:flex;
          justify-content:space-between;
          align-items:center;
        ">

          <h3>${item.titulo}</h3>

          <button
            onclick="deletarEncomenda(${item.id})"
            style="
              background:#ff1f3d;
              color:white;
              border:none;
              width:35px;
              height:35px;
              border-radius:10px;
              cursor:pointer;
            "
          >
            🗑️
          </button>

        </div>

        <div class="date">

          <span class="
            circle
            ${borderClass}
          "></span>

          ${item.data_entrega}

        </div>

        <p style="margin-top:15px;">
          ${item.descricao}
        </p>

        <p style="margin-top:10px;">
          Cliente: ${item.cliente}
        </p>

        <div class="priority-container">

          <div class="
            priority
            ${priorityClass}
          ">
            ${prioridadeTexto}
          </div>

          <span>
            Score ${item.score_prioridade}
          </span>

        </div>

      `;

      cardsContainer.appendChild(card);

    });

    totalPedidos.innerText =
      `Você tem ${filtradas.length} pedidos ativos`;

    altaStatus.innerText =
      `Alta ${alta}`;

    mediaStatus.innerText =
      `Média ${media}`;

    baixaStatus.innerText =
      `Baixa ${baixa}`;

  }

  catch(error) {

    console.error(error);

  }

}




filterPriority.addEventListener(
  "change",
  carregarEncomendas
);

sortDate.addEventListener(
  "change",
  carregarEncomendas
);




carregarEncomendas();

setInterval(
  carregarEncomendas,
  5000
);