// captura dos elementos do DOM
const form = document.querySelector('#formAluno');
const resultado = document.querySelector('#resultado');
const recuperacaoDiv = document.querySelector('#recuperacaoDiv');
const recuperacaoInput = document.querySelector('#recuperacao');


const usarPrompt = true; 


// escolha do input de dados
if (usarPrompt) {
    
    const container = document.querySelector('.container');
    if(container) {
        container.style.display = 'none';
    }

   
    const aulas = parseInt(prompt('Número de aulas do semestre:'));
    const faltas = parseInt(prompt('Número de faltas do aluno:'));
    const p1 = parseFloat(prompt('Primeira nota (P1):'));
    const p2 = parseFloat(prompt('Segunda nota (P2):'));

    avaliarAluno(aulas, faltas, p1, p2, true);
} else {
    // escutar o evendo submit do formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        resultado.style.display = 'none';
        recuperacaoDiv.style.display = 'none';
        //conveerter os valores
        const aulas = parseInt(document.querySelector('#aulas').value);
        const faltas = parseInt(document.querySelector('#faltas').value);
        const p1 = parseFloat(document.querySelector('#p1').value);
        const p2 = parseFloat(document.querySelector('#p2').value);

        avaliarAluno(aulas, faltas, p1, p2, false);
    });
}

function avaliarAluno(aulas, faltas, p1, p2, viaPrompt) {
    const frequencia = ((aulas - faltas) / aulas) * 100;
    let situacao = '';
    let media = (p1 + p2) / 2;
    let rec = null;

    if (frequencia < 75) {
        situacao = 'Reprovado por falta';
    } else if (media >= 7) {
        situacao = 'Aprovado';
    } else if (media >= 5) {
        //mostrar input adicional para recuperaçao de senha
        //se prmpt
        if (viaPrompt) {
            rec = parseFloat(prompt('Nota complementar (recuperação):'));
            const mediaFinal = (media + rec) / 2;
            situacao = mediaFinal >= 5 ? 'Aprovado após recuperação' : 'Reprovado após recuperação';
            mostrarResultadoPrompt(aulas, faltas, frequencia, p1, p2, rec, situacao);
            return;
        } else {//se form
            recuperacaoDiv.style.display = 'block';
            recuperacaoInput.focus();
            form.onsubmit = function(ev) {
                ev.preventDefault();
                rec = parseFloat(recuperacaoInput.value);
                const mediaFinal = (media + rec) / 2;
                situacao = mediaFinal >= 5 ? 'Aprovado após recuperação' : 'Reprovado após recuperação';
                mostrarResultado(aulas, faltas, frequencia, p1, p2, rec, situacao);
                form.onsubmit = null;
            };
            return;
        }
    } else {
        situacao = 'Reprovado por nota';
    }

    //resultado prompt ou form
    if (viaPrompt) {
        mostrarResultadoPrompt(aulas, faltas, frequencia, p1, p2, rec, situacao);
    } else {
        mostrarResultado(aulas, faltas, frequencia, p1, p2, rec, situacao);
    }
}


// funcao que mostra o resultado logo a baixo do formulario
function mostrarResultado(aulas, faltas, frequencia, p1, p2, rec, situacao) {
    //inserindo elementos em lote no formulario
    resultado.innerHTML = `
        <strong>Número de aulas do semestre:</strong> ${aulas}<br>
        <strong>Número de faltas do aluno:</strong> ${faltas}<br>
        <strong>Percentual de presença do aluno:</strong> ${frequencia.toFixed(2)}%<br><br>
        <strong>Primeira nota (P1):</strong> ${p1}<br>
        <strong>Segunda nota (P2):</strong> ${p2}<br>
        <strong>Nota complementar (recuperação):</strong> ${rec !== null ? rec : '-'}<br><br>
        <strong>Situação final do aluno:</strong> <span style="color:${situacao.includes('Aprovado') ? 'green' : 'red'}">${situacao}</span>
    `;
    resultado.style.display = 'block';
}


// function que o resultado no prompt
function mostrarResultadoPrompt(aulas, faltas, frequencia, p1, p2, rec, situacao) {
    //inserindo elementos em lote no formulario
    let msg = `Número de aulas do semestre: ${aulas}\n` +
        `Número de faltas do aluno: ${faltas}\n` +
        `Percentual de presença do aluno: ${frequencia.toFixed(2)}%\n` +
        `Primeira nota (P1): ${p1}\n` +
        `Segunda nota (P2): ${p2}\n` +
        `Nota complementar (recuperação): ${rec !== null ? rec : '-'}\n` +
        `Situação final do aluno: ${situacao}`;
    alert(msg);
}
