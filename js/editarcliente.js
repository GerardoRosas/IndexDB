(function() {
    let DB;

    const nombreInput = document.querySelector('#nombre');
    const emailInput = document.querySelector('#email');
    const telefonoInput = document.querySelector('#telefono');
    const empresaInput = document.querySelector('#empresa');
    const formulario = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', () => {

        //Conectar DB 
        conectarDB()

        //Actualiza el registro
        formulario.addEventListener('submit', actualizarCliente);

        //Verificar el id de la url
        const parametrosURL = new URLSearchParams(window.location.search);

        const idCliente = parametrosURL.get('id');
        if(idCliente){
            setTimeout(() => {
                obtenerCliente(idCliente);
            }, 2000)
            
        }
    })

    function actualizarCliente(e){
        e.preventDefault();

        if(nombreInput.value === '' || emailInput.value === '' || empresaInput.value === '' || telefonoInput.value === '' ){
            console.log('Hubo un Error');
            return;
        }
    }

    function obtenerCliente(id){
        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectSore = transaction.objectSore('crm');

        const cliente = objectSore.openCursor();
        cliente.onsuccess() = function(e){
            const cursor = e.target.result;

            if(cursor){
                if(cursor.value.id === Number(id)){
                    llenarFormulario(cursor.value);
                }

                cursor.continue();
            }

        }
    }

    function llenarFormulario(datosCliente){
        const { nombre, email, empresa, telefono } = datosCliente;

        nombreInput.value = nombre;
        empresaInput.value = empresa;
        emailInput.value = email;
        telefonoInput.value = telefono;
    }

    function conectarDB(){
        const abrirConexion = window.indexedDB.open('crm', 1);

        abrirConexion.onerror = () => {
            console.log('Hubo un error');
        }

        abrirConexion.onsuccess = () => {
            DB = abrirConexion.result
        }
    }

})();