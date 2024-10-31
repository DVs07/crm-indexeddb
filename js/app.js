(function() {
    let DB;
    
    document.addEventListener('DOMContentLoaded', () =>{
        crearDB();
    });

    // Crear la base de datos en la version 1.0
    function crearDB(){
        const crearDB = window.indexedDB.open('crm',1);

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
                keyPath: 'id',
                autoIncrement: true
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

})(); // Funcion de uso local. Se ejecuta cuando la pagina termina de cargar. Se ejecuta una vez. No se repite. 