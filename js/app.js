(function() {
    let DB;

    const listadoClientes = document.querySelector('#listado-clientes');
    
    document.addEventListener('DOMContentLoaded', () =>{
        crearDB();

        if(window.indexedDB.open('crm', 2)){
            obtenerClientes();
        }

        listadoClientes.addEventListener('click', eliminarRegistro);
    });

    // Crear la base de datos en la version 1.0
    function crearDB(){
        const crearDB = window.indexedDB.open('crm',2);

        // Si hay un error
        crearDB.onerror = function(){
            console.log('Hubo un error.');
        };

        // Si todo sale bien
        crearDB.onsuccess = function(){
            console.log('BD Creada correctamente.');
            DB = crearDB.result;
            console.log(DB);
        };

        // Definir el schema
        crearDB.onupgradeneeded = function(e){
            const db = e.target.result;
            const objectStore = db.createObjectStore('crm', {
                keyPath: 'id'
            });

            // Definir las columnas
            objectStore.createIndex('nombre', 'nombre', {unique: false});
            objectStore.createIndex('email', 'email', {unique: true});
            objectStore.createIndex('telefono', 'telefono', {unique: false});
            objectStore.createIndex('empresa', ' empresa', {unique: false});
            objectStore.createIndex('id', 'id', {unique: true});

            console.log('DB creada y lista.');
            
        }

    }

    function eliminarRegistro(e){
        // console.log(e.target.classList);
        if(e.target.classList.contains('eliminar')){
            // console.log('Hiciste clic en Eliminar');
            const idEliminar = Number(e.target.dataset.cliente);

            // console.log(idEliminar);

            const confirmar = confirm('Desea eliminar este Cliente?')
            
            // console.log(confirmar);
            if(confirmar){
                const transaction = DB.transaction(['crm'], 'readwrite');
                const objectStore = transaction.objectStore('crm');

                objectStore.delete(idEliminar);

                transaction.oncomplete = function (){
                    console.log('ELiminado correctamente');
                    e.target.parentElement.parentElement.remove();
                }

                transaction.onerror = function(){
                    console.log('Hubo un error');
                    
                }
            }
        }
        
    }
    function obtenerClientes(){
        const abrirConexion = window.indexedDB.open('crm',2);

        // Si hay un error
        abrirConexion.onerror = function(){
            console.log('Hubo un error.');

        };

        // Si todo sale bien
        abrirConexion.onsuccess = function(){
            DB = abrirConexion.result;
            console.log(DB);

            const objectStore = DB.transaction('crm').objectStore('crm');

            objectStore.openCursor().onsuccess = function(e){
                const cursor = e.target.result;

                if(cursor){
                    console.log(cursor.value);
                    
                    const {nombre, email, telefono, empresa, id} = cursor.value; // Destructuring. Asignar los valores de la base de datos a las variables.

                    listadoClientes.innerHTML += 
                        ` <tr>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${nombre} </p>
                                <p class="text-sm leading-10 text-gray-700"> ${email} </p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                                <p class="text-gray-700">${telefono}</p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
                                <p class="text-gray-600">${empresa}</p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                                <a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Editar</a>
                                <a href="#" data-cliente="${id}" class="text-red-600 hover:text-red-900 eliminar">Eliminar</a>
                            </td>
                        </tr>`;

                    cursor.continue();
                }else{
                    console.log('No hay más registros.');
                }
            }
        };
    }

})(); // Funcion de uso local. Se ejecuta cuando la pagina termina de cargar. Se ejecuta una vez. No se repite. 