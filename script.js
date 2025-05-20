// Dados do questionário
const perguntas = [
    {
        id: 1,
        texto: "O Estado deve garantir uma rede de proteção social ampla, mesmo que isso custe caro."
    },
    {
        id: 2,
        texto: "Prefiro trabalhar sozinho e sem supervisão, mesmo em ambientes coletivos."
    },
    {
        id: 3,
        texto: "A liberdade de expressão deve ser total, mesmo que ofenda grupos ou ideias."
    },
    {
        id: 4,
        texto: "Me preocupo profundamente com o que pode dar errado em decisões políticas."
    },
    {
        id: 5,
        texto: "É papel do governo controlar empresas privadas em setores estratégicos."
    },
    {
        id: 6,
        texto: "Eu me incomodo quando há conflitos de opinião em grupos políticos que participo."
    },
    {
        id: 7,
        texto: "Questões morais devem ser tratadas com base em valores tradicionais e religiosos."
    },
    {
        id: 8,
        texto: "Gosto de experimentar ideias políticas novas, mesmo que sejam controversas."
    },
    {
        id: 9,
        texto: "A privatização tende a melhorar a qualidade dos serviços públicos."
    },
    {
        id: 10,
        texto: "Me esforço para entender os dois lados de um debate político antes de formar opinião."
    },
    {
        id: 11,
        texto: "O governo deve poder restringir armas para manter a ordem."
    },
    {
        id: 12,
        texto: "Costumo planejar meus projetos políticos e sociais com antecedência."
    },
    {
        id: 13,
        texto: "Me sinto confortável debatendo política com pessoas que pensam diferente de mim."
    },
    {
        id: 14,
        texto: "O Estado deve promover igualdade de resultado, não apenas de oportunidade."
    },
    {
        id: 15,
        texto: "Tenho dificuldade em confiar nas intenções de políticos ou autoridades."
    },
    {
        id: 16,
        texto: "As leis devem refletir os costumes de nossa cultura, mesmo que isso limite certas liberdades."
    },
    {
        id: 17,
        texto: "Me orgulho de seguir minhas convicções políticas mesmo sob pressão."
    },
    {
        id: 18,
        texto: "Sou sensível a injustiças sociais, mesmo quando elas não me afetam diretamente."
    },
    {
        id: 19,
        texto: "Intervenção do Estado na economia normalmente gera mais problemas do que soluções."
    },
    {
        id: 20,
        texto: "A diversidade de opiniões fortalece o debate político, mesmo quando há tensão."
    }
];

// Opções de resposta
const opcoes = [
    { valor: 1, texto: "Discordo totalmente" },
    { valor: 2, texto: "Discordo" },
    { valor: 3, texto: "Neutro" },
    { valor: 4, texto: "Concordo" },
    { valor: 5, texto: "Concordo totalmente" }
];

// Variáveis globais
let perguntaAtual = 0;
let respostas = {};
let participantId = null;

// Dados para interpretação dos resultados
const interpretacoes = {
    "Direita Liberal": {
        descricao: "Você valoriza a liberdade econômica e pessoal. Acredita que o mercado livre é o melhor caminho para a prosperidade e que o Estado deve interferir minimamente tanto na economia quanto nas escolhas individuais.",
        partidos: "Novo, setores do PSDB, MDB e PL",
        personalidades: "Milton Friedman, Friedrich Hayek, Margaret Thatcher",
        paises: "Estados Unidos, Suíça, Austrália, Nova Zelândia"
    },
    "Direita Conservadora": {
        descricao: "Você defende a liberdade econômica, mas acredita que valores tradicionais e morais devem ser preservados, mesmo que isso exija alguma regulação estatal sobre comportamentos individuais.",
        partidos: "PL, Republicanos, setores do PP e União Brasil",
        personalidades: "Winston Churchill, Ronald Reagan, Jair Bolsonaro",
        paises: "Polônia, Hungria, Rússia"
    },
    "Esquerda Liberal": {
        descricao: "Você defende maior intervenção do Estado na economia para garantir justiça social, mas valoriza liberdades individuais e direitos civis como fundamentais para uma sociedade justa.",
        partidos: "PDT, PSB, setores do PT e PSOL",
        personalidades: "Bernie Sanders, Noam Chomsky, Ciro Gomes",
        paises: "Canadá, Suécia, Dinamarca, Holanda"
    },
    "Esquerda Conservadora": {
        descricao: "Você acredita que o Estado deve ter papel ativo na economia para garantir igualdade, mas também defende valores tradicionais e considera que algumas liberdades individuais podem ser limitadas em nome do bem comum.",
        partidos: "Setores do PT, PCdoB",
        personalidades: "Fidel Castro, Hugo Chávez, Nicolás Maduro",
        paises: "Cuba, Venezuela, China"
    }
};

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Botões de navegação
    document.getElementById('btn-iniciar').addEventListener('click', iniciarCadastro);
    document.getElementById('form-cadastro').addEventListener('submit', iniciarQuestionario);
    document.getElementById('btn-anterior').addEventListener('click', perguntaAnterior);
    document.getElementById('btn-proximo').addEventListener('click', proximaPergunta);
    document.getElementById('btn-imprimir').addEventListener('click', imprimirResultado);
    document.getElementById('btn-compartilhar').addEventListener('click', compartilharResultado);
    
    // Validação de CPF
    document.getElementById('cpf').addEventListener('blur', validarCPF);
    document.getElementById('cpf').addEventListener('input', function(e) {
        e.target.value = formatarCPF(e.target.value);
    });
});

// Funções de navegação
function iniciarCadastro(e) {
    e.preventDefault();
    document.getElementById('pagina-inicial').classList.add('d-none');
    document.getElementById('pagina-cadastro').classList.remove('d-none');
}

function iniciarQuestionario(e) {
    e.preventDefault();
    
    // Validar CPF
    const cpf = document.getElementById('cpf').value;
    if (!validarCPF(cpf)) {
        document.getElementById('cpf').classList.add('is-invalid');
        return;
    }
    
    // Coletar dados do cadastro
    const dadosCadastro = {
        nome: document.getElementById('nome').value,
        cpf: document.getElementById('cpf').value.replace(/\D/g, ''),
        email: document.getElementById('email').value,
        genero: document.querySelector('input[name="genero"]:checked').value,
        faixa_etaria: document.getElementById('faixa-etaria').value
    };
    
    // Enviar dados para o backend
    fetch('/api/cadastro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosCadastro)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            participantId = data.participant_id;
            document.getElementById('pagina-cadastro').classList.add('d-none');
            document.getElementById('pagina-questionario').classList.remove('d-none');
            mostrarPergunta(0);
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Ocorreu um erro ao processar seu cadastro. Por favor, tente novamente.');
    });
}

function mostrarPergunta(index) {
    const pergunta = perguntas[index];
    const container = document.getElementById('pergunta-container');
    
    // Atualizar barra de progresso
    const progresso = ((index + 1) / perguntas.length) * 100;
    document.getElementById('progress-bar').style.width = progresso + '%';
    document.getElementById('progress-bar').setAttribute('aria-valuenow', progresso);
    document.getElementById('progress-bar').textContent = (index + 1) + '/' + perguntas.length;
    
    // Atualizar botões de navegação
    document.getElementById('btn-anterior').disabled = index === 0;
    document.getElementById('btn-proximo').textContent = index === perguntas.length - 1 ? 'Finalizar' : 'Próximo';
    
    // Criar HTML da pergunta
    let html = `
        <div class="pergunta slide-in">${pergunta.texto}</div>
        <div class="opcoes">
    `;
    
    opcoes.forEach(opcao => {
        const selecionada = respostas[pergunta.id] === opcao.valor ? 'selecionada' : '';
        html += `
            <div class="opcao ${selecionada}" data-valor="${opcao.valor}" onclick="selecionarOpcao(${pergunta.id}, ${opcao.valor})">
                <div class="opcao-valor">${opcao.valor}</div>
                <div class="opcao-texto">${opcao.texto}</div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
    
    // Adicionar evento de clique às opções
    document.querySelectorAll('.opcao').forEach(el => {
        el.addEventListener('click', function() {
            const valor = parseInt(this.getAttribute('data-valor'));
            selecionarOpcao(pergunta.id, valor);
        });
    });
    
    perguntaAtual = index;
}

function selecionarOpcao(perguntaId, valor) {
    respostas[perguntaId] = valor;
    
    // Atualizar visual das opções
    document.querySelectorAll('.opcao').forEach(el => {
        el.classList.remove('selecionada');
        if (parseInt(el.getAttribute('data-valor')) === valor) {
            el.classList.add('selecionada');
        }
    });
}

function perguntaAnterior() {
    if (perguntaAtual > 0) {
        mostrarPergunta(perguntaAtual - 1);
    }
}

function proximaPergunta() {
    // Verificar se a pergunta atual foi respondida
    const perguntaId = perguntas[perguntaAtual].id;
    if (!respostas[perguntaId]) {
        alert('Por favor, selecione uma resposta antes de continuar.');
        return;
    }
    
    if (perguntaAtual < perguntas.length - 1) {
        mostrarPergunta(perguntaAtual + 1);
    } else {
        finalizarQuestionario();
    }
}

function finalizarQuestionario() {
    // Enviar respostas para o backend
    fetch('/api/resultado', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            participant_id: participantId,
            respostas: respostas
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('pagina-questionario').classList.add('d-none');
            document.getElementById('pagina-resultado').classList.remove('d-none');
            mostrarResultado(data);
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Ocorreu um erro ao processar suas respostas. Por favor, tente novamente.');
    });
}

function mostrarResultado(data) {
    // Exibir zona do diagrama de Nolan
    document.getElementById('resultado-titulo').textContent = data.zona;
    
    // Exibir interpretação
    const interpretacao = interpretacoes[data.zona];
    document.getElementById('resultado-interpretacao').textContent = interpretacao.descricao;
    document.getElementById('resultado-partidos').textContent = interpretacao.partidos;
    document.getElementById('resultado-personalidades').textContent = interpretacao.personalidades;
    document.getElementById('resultado-paises').textContent = interpretacao.paises;
    
    // Criar gráfico do diagrama de Nolan
    const ctx = document.getElementById('diagrama-nolan').getContext('2d');
    
    new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Seu posicionamento',
                data: [{
                    x: data.nolan_x,
                    y: data.nolan_y
                }],
                backgroundColor: 'rgba(67, 97, 238, 1)',
                borderColor: 'rgba(67, 97, 238, 1)',
                pointRadius: 10,
                pointHoverRadius: 12
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                x: {
                    min: -10,
                    max: 10,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    title: {
                        display: true,
                        text: 'Econômico (Esquerda ← → Direita)',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        callback: function(value) {
                            if (value === -10) return 'Esquerda';
                            if (value === 0) return '0';
                            if (value === 10) return 'Direita';
                            return '';
                        }
                    }
                },
                y: {
                    min: -10,
                    max: 10,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    title: {
                        display: true,
                        text: 'Valores (Conservador ↓ ↑ Liberal)',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        callback: function(value) {
                            if (value === -10) return 'Conservador';
                            if (value === 0) return '0';
                            if (value === 10) return 'Liberal';
                            return '';
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `(${context.parsed.x.toFixed(1)}, ${context.parsed.y.toFixed(1)})`;
                        }
                    }
                },
                annotation: {
                    annotations: {
                        line1: {
                            type: 'line',
                            xMin: 0,
                            xMax: 0,
                            borderColor: 'rgba(0, 0, 0, 0.3)',
                            borderWidth: 1
                        },
                        line2: {
                            type: 'line',
                            yMin: 0,
                            yMax: 0,
                            borderColor: 'rgba(0, 0, 0, 0.3)',
                            borderWidth: 1
                        }
                    }
                }
            }
        }
    });
    
    // Adicionar rótulos dos quadrantes
    adicionarRotulosQuadrantes(ctx);
}

function adicionarRotulosQuadrantes(ctx) {
    const canvas = ctx.canvas;
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.font = '12px Arial';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.textAlign = 'center';
    
    // Direita Liberal
    ctx.fillText('Direita Liberal', width * 0.75, height * 0.25);
    
    // Direita Conservadora
    ctx.fillText('Direita Conservadora', width * 0.75, height * 0.75);
    
    // Esquerda Liberal
    ctx.fillText('Esquerda Liberal', width * 0.25, height * 0.25);
    
    // Esquerda Conservadora
    ctx.fillText('Esquerda Conservadora', width * 0.25, height * 0.75);
}

function imprimirResultado() {
    const element = document.getElementById('pagina-resultado');
    
    html2pdf().from(element).save('resultado-teste-nolan.pdf');
}

function compartilharResultado() {
    if (navigator.share) {
        navigator.share({
            title: 'Meu resultado no Teste Nolan + Big Five',
            text: 'Descubra se seus amigos são politicamente o que realmente pensam.',
            url: window.location.href
        })
        .catch(error => console.log('Erro ao compartilhar:', error));
    } else {
        // Fallback para navegadores que não suportam a API Web Share
        const url = window.location.href;
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Link copiado para a área de transferência! Compartilhe com seus amigos.');
    }
}

// Funções de validação
function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        return false;
    }
    
    let soma = 0;
    let resto;
    
    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;
    
    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;
    
    return true;
}

function formatarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    
    if (cpf.length > 11) {
        cpf = cpf.substring(0, 11);
    }
    
    if (cpf.length > 9) {
        cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (cpf.length > 6) {
        cpf = cpf.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    } else if (cpf.length > 3) {
        cpf = cpf.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    }
    
    return cpf;
}

// Função global para seleção de opção (chamada pelo HTML)
window.selecionarOpcao = selecionarOpcao;
