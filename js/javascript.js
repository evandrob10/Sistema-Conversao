// REST APi
async function pegaDados(url="USD"){
    let cotacao = await fetch(`https://v6.exchangerate-api.com/v6/caac1159c5c08325e02eb22b/latest/${url}`);
    return cotacao;
}
// Seleção de dados:

let selects = document.querySelectorAll("select");
let inputs = document.querySelectorAll("input");
let button = document.querySelector("button[type='submit']");
let button_close = document.querySelector(".poupup-close");
let campo_resultado = document.querySelector(".poupup-resultado");

//Inicio da conversao:

pegaDados()
    .then((response)=>{
        return response.json();
    })
    .then((data)=>{
        console.log(data);
        return data.conversion_rates;
    })
    .then((cotacao)=>{
        const nomes_moedas = Object.keys(cotacao);
        selects.forEach(($_selects,index)=>{
            nomes_moedas.map(($_moeda)=>{
                let option = document.createElement("option");
                option.setAttribute("id",`${index}${$_moeda}`)
                let moeda = document.createTextNode($_moeda);
                option.appendChild(moeda);
                $_selects.appendChild(option);
            })  
        })     
    })

let valores_campos_coletar = ()=>{
    let valores_c = [];
    inputs.forEach((e)=>{
       valores_c.push(e.value);
    })
    return valores_c;
}
let calculos = (valor_1,valor_2) =>{
    return valor_1 * valor_2;
}
button.addEventListener("click",(e)=>{
    e.preventDefault();
    button.textContent = "Carregando";
    try{
        setTimeout(()=>{
            let valor_campo_1 = valores_campos_coletar()[0];
            let valor_campo_2 = valores_campos_coletar()[1];
            let resultado = calculos(valor_campo_1,valor_campo_2).toFixed(2);
            button.textContent = "O";
            campo_resultado.style.display = "block";
            let texto_resultado = document.querySelector(".texto-resultado");
            texto_resultado.textContent = "Seu resultado é: " + resultado;
        },2000);
    }catch(error){
        setTimeout(()=>{
            button.textContent = "O";
            campo_resultado.style.display = "block";
            let texto_resultado = document.querySelector(".texto-resultado");
            texto_resultado.textContent = "Seu resultado é: " + error;
        },2000);
    }
})
button_close.addEventListener("click",(e)=>{
    e.preventDefault();

    campo_resultado.style.display = "none";

    button.textContent = "CONVERTER";
})
async function coletaValores(moeda_origem,moeda_destino){
    pegaDados(moeda_origem)
        .then((response) =>{
            return response.json();
        })
        .then((data)=>{
            return data.conversion_rates;
        })
        .then((cotacao)=>{
            Object.keys(cotacao).map((e)=>{
                if(e == moeda_origem){     
                    console.log(cotacao[moeda_origem]);
                }else if(e == moeda_destino){
                    inputs.forEach((e,i)=>{
                        if(i == 1 && moeda_origem != moeda_destino){
                            e.value = cotacao[moeda_destino].toFixed(2);
                        }
                    })
                }
            }) 

        })
}
let moedas = [null,null];
selects.forEach((selects,index)=>{
    selects.addEventListener("change",(e)=>{
        e.preventDefault();   
        let select_option_2 = document.querySelector('select[name="moeda-destino"]');      
        moedas[index] = selects.value;
        coletaValores(moedas[0],moedas[1]);
        if(moedas[0] != null){
            select_option_2.removeAttribute("disabled");
        }
        let option = [];
        if(selects[0]){
            option[0] = document.querySelectorAll(`option[id="1${moedas[0]}"]`);
            option[0][0].style.display = "none";
        }
        if(select_option_2[0]){
            option[1] = document.querySelectorAll(`option[id="0${moedas[1]}"]`);
            option[1][0].style.display = "none";
        }
        let options = document.querySelectorAll("option");
        let optionArray = []
        options.forEach((e)=>{
            optionArray .push(e);
        })
        optionArray.filter((e)=>{
            if(e != option[0][0] && e != option[1][0]){
                return e.style.display = "flex";
            }
        })
    })  
})