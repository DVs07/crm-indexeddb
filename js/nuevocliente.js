(function(){
    let DB;
    const formulario = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', () => {
        conectarDB();

        formulario.addEventListener('submit', validarCliente);

    });

    function conectarDB(){
        const abrirConexion = window.indexedDB.open('crm', 1);

        // Si hay un error
        abrirConexion.onerror = function(){
            console.log('Hubo un error');
            
        };

        // Si todo sale bien
        abrirConexion.onsuccess = function(){
            DB = abrirConexion.result;

            console.log('Base de datos abierta');
        };
    }

    function validarCliente(e){
        e.preventDefault();

        // console.log('Validando formulario...');

        // Leer todos los inputs del formulario
        const nombre = document.querySelector('#nombre').value;
        const email = document.querySelector('#email').value;
        const telefono = document.querySelector('#telefono').value;
        const empresa = document.querySelector('#empresa').value;

        // Validar todos los campos
        if(nombre === '' || email === '' || telefono === '' || empresa === ''){
            imprimirAlerta('Todos los campos son obligatorios', 'error');
            return;
        }
        
        // Crear un objeto con la informacion
        const cliente = {
            nombre,
            email,
            telefono,
            empresa,
            id : Date.now()
        }
        crearNuevoCliente(cliente);
        
    }

    function imprimirAlerta(mensaje, tipo){

        const alerta = document.querySelector('.alerta');
        if(!alerta){
            // Crear el div
            const divAlerta = document.createElement('DIV');
            divAlerta.classList.add('px-4', 'py-3', 'rounded', 'mx-auto', 'mt-6', 'text-center','border', 'alerta');


            const icono = document.createElement('i');

            if(tipo === 'error'){
                divAlerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700' );
                // icono.classList.add('fa', 'fa-exclamation-circle', 'me-2');
                // icono.classList.add('custom-icon'); // Icono de error
                // icono.classList.add('me-2', 'text-center');
                // icono.innerHTML = `<svg class="w-6 h-6 text-red-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                // <path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v5a1 1 0 1 0 2 0V8Zm-1 7a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H12Z" clip-rule="evenodd" class="align-middle"/></svg>`;

                
            } else{
                divAlerta.classList.add('bg-green-100', 'border-green-400', 'text-green-700');
                // icono.classList.add('fa', 'fa-check-circle', 'me-2'); // Icono de éxito
            }

            const textoAlerta = document.createElement('span');
            textoAlerta.textContent = mensaje;

            
            divAlerta.appendChild(textoAlerta);
            divAlerta.appendChild(icono);
            
            formulario.appendChild(divAlerta);

            setTimeout(() => {
                divAlerta.remove();
            }, 3000);
            
        }
    }

    // Funcion para crear un nuevo cliente
    function crearNuevoCliente(cliente){
        const transaction = DB.transaction(['crm'], 'readwrite');

        const objectStore = transaction.objectStore('crm');

        objectStore.add(cliente);

        transaction.onerror = function(){
            console.log('Hubo un error');
            imprimirAlerta('Hubo un error. El cliente no se pudo agregar', 'error');
        };

        transaction.oncomplete = function(){
            console.log('Cliente agregado');
            imprimirAlerta('Cliente agregado correctamente');

            // Ir a la pagina de clientes. Se redirecciona a index.html en 3 segundos.
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
            
        };
    }
        
})();