const timelineContainer =
  document.getElementById(
    "timeline-container"
  );

const alertasContainer =
  document.getElementById(
    "alertas-container"
  );

console.log(
  "Timeline:",
  timelineContainer
);

console.log(
  "Alertas:",
  alertasContainer
);




async function carregarCronograma() {

  try {

    const response = await fetch(
      "http://127.0.0.1:8000/encomendas/priorizadas"
    );

    const data = await response.json();

    console.log("API:", data);

    timelineContainer.innerHTML = "";

    alertasContainer.innerHTML = "";

    if (
      data.alertas &&
      data.alertas.length > 0
    ) {

      data.alertas.forEach((alerta) => {

        const alertaDiv =
          document.createElement("div");

        alertaDiv.classList.add(
          "alerta"
        );

        alertaDiv.innerHTML = `
          ⚠️ ${alerta.mensagem}
        `;

        alertasContainer.appendChild(
          alertaDiv
        );

      });

    }

    if (
      data.cronograma &&
      data.cronograma.length > 0
    ) {

      data.cronograma.forEach((item) => {

        let classeTipo = "festa";

        if (
          item.tipo_bolo
            .toLowerCase()
            .includes("casamento")
        ) {

          classeTipo = "casamento";

        }

        else if (
          item.tipo_bolo
            .toLowerCase()
            .includes("anivers")
        ) {

          classeTipo = "aniversario";

        }

        const div =
          document.createElement("div");

        div.classList.add(
          "timeline-item"
        );

        div.innerHTML = `

          <div class="info">

            <h3>
              ${item.cliente}
            </h3>

            <p>
              <strong>Tipo:</strong>
              ${item.tipo_bolo}
            </p>

            <p>
              <strong>Iniciar em:</strong>
              ${item.iniciar_em}
            </p>

            <p>
              <strong>Entrega:</strong>
              ${item.data_entrega}
            </p>

            <p>
              <strong>Horas necessárias:</strong>
              ${item.horas_necessarias}h
            </p>

          </div>

          <div class="tag ${classeTipo}">
            ${item.tipo_bolo}
          </div>

        `;

        timelineContainer.appendChild(
          div
        );

      });

    }

  }

  catch(error) {

    console.error(
      "Erro:",
      error
    );

  }

}


carregarCronograma();