(function(){
    let DB;
    
    const formulario = document.querySelector('#formulario');
    
    document.addEventListener('DOMContentLoaded', () => {
        conectarDB();

        formulario.addEventListener('submit', validarCliente);

    });
    

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