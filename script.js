const eventos = [
    { id: 1, nome: "Pitch convincente", pontos: 6 },
    { id: 2, nome: "Produto com bugs", pontos: -4 },
    { id: 3, nome: "Boa tração de usuários", pontos: 3 },
    { id: 4, nome: "Investidor irritado", pontos: -6 },
    { id: 5, nome: "Fake news no pitch", pontos: -8 }
];

document.addEventListener("DOMContentLoaded", () => {
    const iniciarBtn = document.getElementById("iniciarCampeonato");
    const modal = document.getElementById("modalCadastro");
    const closeModalBtn = document.getElementById("closeModal");
    const form = document.getElementById("formCadastro");
    const startupsContainer = document.getElementById("startupsContainer");
    const continuarBtn = document.getElementById("continuarTorneio");
    const bracketContainer = document.createElement("div");
    bracketContainer.id = "bracketContainer";
    document.body.appendChild(bracketContainer);

    const eventModal = document.createElement("div");
    eventModal.id = "eventModal";
    eventModal.style.display = "none";
    eventModal.innerHTML = `
        <div id="eventContent">
            <h2>Aplicar Eventos</h2>
            <p id="startupName"></p>
            <ul id="eventList"></ul>
            <button id="closeEventModal">Fechar</button>
        </div>
    `;
    document.body.appendChild(eventModal);

    let startups = [];
    let currentBattle = null;

    iniciarBtn.addEventListener("click", () => {
        modal.style.display = "block";
    });

    closeModalBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const nome = document.getElementById("nomeStartup").value;
        const slogan = document.getElementById("sloganStartup").value;
        const ano = document.getElementById("anoFundacao").value;

        if (!nome || !slogan || isNaN(parseInt(ano))) {
            alert("Dados inválidos! Por favor, preencha todos os campos corretamente.");
            return;
        }

        startups.push({
            nome,
            slogan,
            anoFundacao: parseInt(ano),
            pontuacao: 70
        });

        const startupDiv = document.createElement("div");
        startupDiv.className = "startup";
        startupDiv.innerHTML = `
            <h3>${nome}</h3>
            <p><strong>Slogan:</strong> ${slogan}</p>
            <p><strong>Ano de Fundação:</strong> ${ano}</p>
            <p><strong>Pontuação:</strong> 70 </p>
        `;
        startupsContainer.appendChild(startupDiv);

        form.reset();

        // Check if the number of startups is valid
        if (startups.length >= 4 && startups.length <= 8 && startups.length % 2 === 0) {
            continuarBtn.disabled = false;
        } else {
            continuarBtn.disabled = true;
        }

        // Disable inputs and submit button if the limit is reached
        if (startups.length === 8) {
            document.getElementById("nomeStartup").disabled = true;
            document.getElementById("sloganStartup").disabled = true;
            document.getElementById("anoFundacao").disabled = true;
            form.querySelector("button[type='submit']").disabled = true;
        }
    });

    continuarBtn.addEventListener("click", () => {
        modal.style.display = "none";
        renderBracket(startups);
    });

    function renderBracket(participants) {
        bracketContainer.innerHTML = ""; // Clear previous bracket
        const pairs = sortearPares(participants);

        pairs.forEach(([startupA, startupB], index) => {
            const matchDiv = document.createElement("div");
            matchDiv.className = "match";
            matchDiv.innerHTML = `
                <div class="startup">
                    <h3>${startupA.nome}</h3>
                    <p>Pontuação: ${startupA.pontuacao}</p>
                </div>
                <div class="vs">VS</div>
                <div class="startup">
                    <h3>${startupB.nome}</h3>
                    <p>Pontuação: ${startupB.pontuacao}</p>
                </div>
                <button class="battleBtn" data-index="${index}">Realizar Batalha</button>
            `;
            bracketContainer.appendChild(matchDiv);

            matchDiv.querySelector(".battleBtn").addEventListener("click", () => {
                currentBattle = { startupA, startupB, index };
                aplicarEventosManual(startupA, () => {
                    aplicarEventosManual(startupB, () => {
                        const vencedor = determinarVencedor(startupA, startupB);
                        alert(`Vencedor: ${vencedor.nome}`);
                        const remaining = pairs.flat().filter(s => s !== startupA && s !== startupB);
                        remaining.push(vencedor);

                        if (remaining.length === 1) {
                            alert(`🏆 A grande vencedora do torneio é: ${remaining[0].nome} com ${remaining[0].pontuacao} pontos!`);
                            console.log("Campeã do torneio:", remaining[0]);
                        } else {
                            renderBracket(remaining);
                        }
                    });
                });
            });
        });
    }

    function aplicarEventosManual(startup, callback) {
        const eventList = document.getElementById("eventList");
        const startupName = document.getElementById("startupName");
        const closeEventModal = document.getElementById("closeEventModal");

        startupName.textContent = `Eventos para: ${startup.nome}`;
        eventList.innerHTML = "";

        eventos.forEach(evento => {
            const li = document.createElement("li");
            li.textContent = `${evento.nome} (${evento.pontos > 0 ? "+" : ""}${evento.pontos} pontos)`;
            li.addEventListener("click", () => {
                startup.pontuacao += evento.pontos;
                alert(`Evento "${evento.nome}" aplicado a ${startup.nome}. Nova pontuação: ${startup.pontuacao}`);
                li.style.textDecoration = "line-through";
                li.style.pointerEvents = "none";
            });
            eventList.appendChild(li);
        });

        eventModal.style.display = "block";

        closeEventModal.onclick = () => {
            eventModal.style.display = "none";
            callback();
        };
    }

    function determinarVencedor(startupA, startupB) {
        if (startupA.pontuacao > startupB.pontuacao) {
            startupA.pontuacao += 30;
            return startupA;
        } else if (startupB.pontuacao > startupA.pontuacao) {
            startupB.pontuacao += 30;
            return startupB;
        } else {
            const vencedor = Math.random() < 0.5 ? startupA : startupB;
            vencedor.pontuacao += 30;
            return vencedor;
        }
    }
});

function sortearPares(startups) {
    const embaralhadas = [...startups].sort(() => Math.random() - 0.5);
    const pares = [];

    for (let i = 0; i < embaralhadas.length; i += 2) {
        pares.push([embaralhadas[i], embaralhadas[i + 1]]);
    }

    return pares;
}