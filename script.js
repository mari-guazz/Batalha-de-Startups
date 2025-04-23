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
    const nomeInput = document.getElementById("nomeStartup");
    const sloganInput = document.getElementById("sloganStartup");
    const anoInput = document.getElementById("anoFundacao");
    const submitBtn = form.querySelector("button[type='submit']");

    let startups = [];

    iniciarBtn.addEventListener("click", () => {
        modal.style.display = "block";
    });

    closeModalBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const nome = nomeInput.value;
        const slogan = sloganInput.value;
        const ano = anoInput.value;

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
            <p><strong>Pontuação Inicial:</strong> 70 pontos</p>
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
            nomeInput.disabled = true;
            sloganInput.disabled = true;
            anoInput.disabled = true;
            submitBtn.disabled = true;
            modal.style.display = "none";
        }
    });

    continuarBtn.addEventListener("click", () => {
        modal.style.display = "none";
        iniciarTorneio(startups);
    });
});

function sortearPares(startups) {
    const embaralhadas = [...startups].sort(() => Math.random() - 0.5);
    const pares = [];

    for (let i = 0; i < embaralhadas.length; i += 2) {
        pares.push([embaralhadas[i], embaralhadas[i + 1]]);
    }

    return pares;
}

function aplicarEventosManual(startup, rodadaId) {
    const eventosAplicados = new Set();

    alert(`\n📣 Eventos para ${startup.nome}`);

    while (true) {
        let menu = `Atribuir eventos para "${startup.nome}" (Rodada ${rodadaId})\nPontuação atual: ${startup.pontuacao}\n\n`;
        eventos.forEach(evento => {
            const jaUsado = eventosAplicados.has(evento.id) ? "(já usado)" : "";
            menu += `${evento.id} - ${evento.nome} (${evento.pontos > 0 ? "+" : ""}${evento.pontos}) ${jaUsado}\n`;
        });
        menu += `0 - Encerrar eventos para esta startup\n`;

        const escolha = parseInt(prompt(menu));

        if (escolha === 0) break;

        const evento = eventos.find(e => e.id === escolha);

        if (!evento) {
            alert("Evento inválido.");
        } else if (eventosAplicados.has(evento.id)) {
            alert("Esse evento já foi aplicado a esta startup nesta rodada.");
        } else {
            startup.pontuacao += evento.pontos;
            eventosAplicados.add(evento.id);
            alert(`Evento "${evento.nome}" aplicado a ${startup.nome}. Nova pontuação: ${startup.pontuacao}`);
        }
    }
}

function executarBatalha(startupA, startupB, rodadaId) {
    alert(`\n🔥 BATALHA ENTRE:\n${startupA.nome} VS ${startupB.nome}`);

    aplicarEventosManual(startupA, rodadaId);
    aplicarEventosManual(startupB, rodadaId);

    if (startupA.pontuacao > startupB.pontuacao) {
        alert(`✅ ${startupA.nome} venceu a batalha! Ganhou +30 pontos.`);
        startupA.pontuacao += 30;
        return startupA;
    } else if (startupB.pontuacao > startupA.pontuacao) {
        alert(`✅ ${startupB.nome} venceu a batalha! Ganhou +30 pontos.`);
        startupB.pontuacao += 30;
        return startupB;
    } else {
        const vencedor = Math.random() < 0.5 ? startupA : startupB;
        alert(`🤝 Empate! ${vencedor.nome} foi escolhido aleatoriamente como vencedor e ganhou +30 pontos.`);
        vencedor.pontuacao += 30;
        return vencedor;
    }
}

function iniciarTorneio(startups) {
    let rodada = 1;
    let participantes = [...startups];

    while (participantes.length > 1) {
        alert(`\n🏁 RODADA ${rodada}: ${participantes.length} startups`);
        const pares = sortearPares(participantes);
        const classificados = [];

        pares.forEach(([a, b]) => {
            const vencedor = executarBatalha(a, b, rodada);
            classificados.push(vencedor);
        });

        participantes = classificados;
        rodada++;
    }

    alert(`🏆 A grande vencedora do torneio é: ${participantes[0].nome} com ${participantes[0].pontuacao} pontos!`);
    console.log("Campeã do torneio:", participantes[0]);
}