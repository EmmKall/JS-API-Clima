const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

window.addEventListener('load', () =>{
    formulario.addEventListener('submit', buscarClima);
});

function buscarClima(e){
    e.preventDefault();

    const ciudad = document.querySelector('#ciudad').value;
    const pais = document.querySelector('#pais').value;

    if( ciudad === '' || pais === '' )
    {
        mostrarMensaje('Datos obligatorios', 'error');
        return;
    } else{
        consultarAPI(ciudad, pais);
    }
}

function mostrarMensaje(message, tipo){

    const alerta = document.querySelector('.alert');

    if(!alerta)
    {
        const mensaje = document.createElement('DIV');
        mensaje.classList.add('alert', 'px-4', 'py-3', 'rounded', 'max-w-md', 'mx-auto', 'mt-6', 'text-center');
        if( tipo === 'error' )
        {
            mensaje.classList.add('bg-red-100', 'border-red-400', 'text-red-700');
        } else{
            mensaje.classList.add('bg-green-100', 'border-green-400', 'text-green-700');
        }
        mensaje.innerHTML = `
            <strong class="font-bold">Estatus</strong>
            <span class="block">${message}</span>
        `;

        container.appendChild(mensaje);

        setTimeout(() => {
            mensaje.remove();
        }, 3000);
    }
}

function consultarAPI(ciudad, pais) {

    const appId = 'a77aaeefb9eafcbba2451b8961e517cb';

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`;

    spinner();

    fetch( url )
        .then( (response) => response.json() )
        .then( datos => {
            limpiarResultado();
            if( datos.cod === "404" ) {
                mostrarMensaje('No se encontro la ciudad', 'error');
                return;
            } 

            mostrarClima( datos );

        } )
        .catch( error => console.log( error ) );
}

function mostrarClima( datos ) {
    
    if( !datos.main ){
        return;
    }

    const { temp_max, temp_min, temp } = datos.main;
    const { name } = datos;
   
    let max = convertirGrados( temp_max );
    let min = convertirGrados( temp_min );
    let actual = convertirGrados( temp );
    
    max = max.toFixed( 3 );
    min = min.toFixed( 3 );
    actual = actual.toFixed( 3 );

    const grados = document.createElement('DIV');
    grados.classList.add('grados', 'text-center', 'border', 'border-green-400', 'rounded', 'bg-green-100');
    grados.innerHTML = `
        <p class="font-bold text-green-600 text-6xl">${name}</p>
        <p class="font-bold text-4xl text-green-400">${actual} &#8451</p>
        <p class="text-red-400 text-2xl">Max: ${max} &#8451</p>
        <p class="text-blue-400 text-2xl">Min: ${min} &#8451</p>
    `;

    resultado.appendChild( grados );

}

const convertirGrados = grado => parseInt( grado ) - 273.15;

function limpiarResultado(){
    const gradosResultado = document.querySelector('.grados');

    if( gradosResultado ) gradosResultado.remove();
}

function spinner(){
    const divSpinner = document.createElement('div');

    divSpinner.className.add = ('sk-fading-circle');
    
    divSpinner.innerHTML = `
        <div class="sk-circle1 sk-child"></div>
        <div class="sk-circle2 sk-child"></div>
        <div class="sk-circle3 sk-child"></div>
        <div class="sk-circle4 sk-child"></div>
        <div class="sk-circle5 sk-child"></div>
        <div class="sk-circle6 sk-child"></div>
        <div class="sk-circle7 sk-child"></div>
        <div class="sk-circle8 sk-child"></div>
        <div class="sk-circle9 sk-child"></div>
        <div class="sk-circle10 sk-child"></div>
        <div class="sk-circle11 sk-child"></div>
        <div class="sk-circle12 sk-child"></div>
    `;

    resultado.appendChild(divSpinner);

    setTimeout(() => {
        divSpinner.remove();
    }, 3000);

}