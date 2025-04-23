const eventos = [
    { id: 1, nome: "Pitch convincente", pontos: 6 },
    { id: 2, nome: "Produto com bugs", pontos: -4 },
    { id: 3, nome: "Boa tração de usuários", pontos: 3 },
    { id: 4, nome: "Investidor irritado", pontos: -6 },
    { id: 5, nome: "Fake news no pitch", pontos: -8 }
];

let startups = [];
let currentBattle = null;

document.addEventListener("DOMContentLoaded", () => {
    // Inicializando os elementos do documento
    const form = document.getElementById("formCadastro");
    const iniciarBtn = document.getElementById("iniciarCampeonato");
    const continuarBtn = document.getElementById("continuarTorneio");
    const closeCadastroModalBtn = document.getElementById("closeCadastroModal");

    const modalCadastro = document.getElementById("modalCadastro");
    const modalEvento = document.getElementById("modalEvento");

    const startupsContainer = document.getElementById("startupsContainer");
    const bracketContainer = document.getElementById("bracketContainer");

    // Adicionando escuta de eventos
    iniciarBtn.addEventListener("click", () => {
        modalCadastro.style.display = "block";
    });

    closeCadastroModalBtn.addEventListener("click", () => {
        modalCadastro.style.display = "none";
        modalEvento.style.display = "none";
    });

    continuarBtn.addEventListener("click", () => {
        modalCadastro.style.display = "none";
        renderBracket(startupsContainer, bracketContainer, startups);
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const nome = document.getElementById("nomeStartup").value.trim();
        const slogan = document.getElementById("sloganStartup").value.trim();
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

        form.reset();

        renderStartups(startupsContainer);

        // Checa se o number de startups eh valido
        if (startups.length >= 4 && startups.length <= 8 && startups.length % 2 === 0) {
            continuarBtn.disabled = false;
        } else {
            continuarBtn.disabled = true;
        }

        // Bloqueia os inputs e fecha o modal
        if (startups.length === 8) {
            document.getElementById("nomeStartup").disabled = true;
            document.getElementById("sloganStartup").disabled = true;
            document.getElementById("anoFundacao").disabled = true;
            form.querySelector("button[type='submit']").disabled = true;
        }
    });
});

function renderStartups(startupsContainer) {
    startupsContainer.innerHTML = "";
    startups.forEach((startup) => {
        const startupDiv = document.createElement("div");
        startupDiv.className = "startup";
        startupDiv.innerHTML = `
            <h3>${startup.nome}</h3>
            <p><strong>Slogan:</strong> ${startup.slogan}</p>
            <p><strong>Ano de Fundação:</strong> ${startup.anoFundacao}</p>
            <p><strong>Pontuação:</strong> ${startup.pontuacao}</p>
        `;
        startupsContainer.appendChild(startupDiv);
    });
}

function renderBracket(startupsContainer, bracketContainer, participants) {
    bracketContainer.innerHTML = ""; // Clear previous bracket
    const pairs = sortearPares(participants); // Pair startups randomly

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
            aplicarEventosManual(startupA, () => {
                aplicarEventosManual(startupB, () => {
                    const vencedor = determinarVencedor(startupA, startupB);
                    alert(`Vencedor: ${vencedor.nome}`);
                    const remaining = pairs.flat().filter(s => s !== startupA && s !== startupB);
                    remaining.push(vencedor);

                    // Remove the match from the bracket
                    matchDiv.remove();

                    // If only one startup remains, declare the champion
                    if (remaining.length === 1) {
                        alert(`🏆 A grande vencedora do torneio é: ${remaining[0].nome} com ${remaining[0].pontuacao} pontos!`);
                        console.log("Campeã do torneio:", remaining[0]);
                    } else if (remaining.length > 1 && remaining.length % 2 === 0) {
                        // Proceed to the next round if there are more matches
                        renderBracket(startupsContainer, bracketContainer, remaining);
                    }
                });
            });
        });
    });
}

function aplicarEventosManual(startupsContainer, startup, callback) {
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

            renderStartups(startupsContainer);
        });
        eventList.appendChild(li);
    });

    modalEvento.style.display = "block";

    closeEventModal.onclick = () => {
        modalEvento.style.display = "none";
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

function sortearPares(startups) {
    const embaralhadas = [...startups].sort(() => Math.random() - 0.5);
    const pares = [];

    for (let i = 0; i < embaralhadas.length; i += 2) {
        pares.push([embaralhadas[i], embaralhadas[i + 1]]);
    }

    return pares;
}