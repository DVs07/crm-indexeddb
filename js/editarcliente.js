(function(){

    let DB;
    let idCliente;

    const nombreInput = document.querySelector('#nombre');
    const emailInput = document.querySelector('#email');
    const telefonoInput = document.querySelector('#telefono');
    const empresaInput = document.querySelector('#empresa');

    const formulario = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', () => {
        
        conectarDB();

        // Actualizar el cliente
        formulario.addEventListener('submit', actualizarCliente);

        // Verificar el id de la URL
        const paramsURL = new URLSearchParams(window.location.search);

        idCliente = paramsURL.get('id');

        // console.log(idCliente);

        if(idCliente){
            setTimeout(() => {
                obtenerCliente(idCliente);
            }, 1500);
        }
    });

    function actualizarCliente(e){
        e.preventDefault();

        if(nombreInput.value === '' || emailInput.value === '' || telefonoInput.value === '' || empresaInput === ''){
            // console.log('Por favor rellena todos los campos');
            imprimirAlerta('Todos los campos son obligatorios', 'error');
            return;
            
        }

        const clienteActualizado = {
            nombre: nombreInput.value,
            email: emailInput.value,
            empresa: empresaInput.value,
            telefono: telefonoInput.value,
            id: Number(idCliente)
        }

        // console.log(clienteActualizado);

        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');

        objectStore.put(clienteActualizado);

        transaction.oncomplete = () =>{
            imprimirAlerta('Editado Correctamente');

            setTimeout( ()=>{
                window.location.href = 'index.html';
            }, 3000)
        };

        transaction.onerror = () => {
            imprimirAlerta('Error al editar', 'error')
        };
        
    };

    function obtenerCliente(id){
        // console.log(id);
        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');

        // console.log(objectStore);
        const cliente = objectStore.openCursor();

        cliente.onsuccess = function(e){
            const cursor = e.target.result;

            if(cursor){
                
                if(cursor.value.id === Number(id)){
                // console.log(cursor.value);
                //     console.log('ID: ', cursor.value.id 
                //     , ' Nombre: ' , cursor.value.nombre 
                //     , ' Email: ' , cursor.value.email 
                //     , ' Telefono: ' ,cursor.value.telefono 
                //     , ' Empresa: ' , cursor.value.empresa
                // );

                    llenarFormulario(cursor.value);
                }
                

                
                cursor.continue();
                
            }
        };
        
        
    };

    function llenarFormulario(datosCliente){
        const {nombre, email, telefono, empresa} = datosCliente;

        nombreInput.value = nombre;
        emailInput.value = email;   
        telefonoInput.value = telefono;
        empresaInput.value = empresa;
    }

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

})();