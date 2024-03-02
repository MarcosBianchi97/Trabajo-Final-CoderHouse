Swal.fire("Bienvenidos!");

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

fetch('cervezas.json')
    .then(response => response.json())
    .then(data => {
        const cervezas = data;

        document.getElementById("cervezas").addEventListener("click", function (event) {
            if (event.target.classList.contains("agregar-carrito")) {
                const idCerveza = parseInt(event.target.getAttribute("data-id"));
                const cervezaSeleccionada = cervezas.find(cerveza => cerveza.id === idCerveza);

                if (cervezaSeleccionada) {
                    carrito.push(cervezaSeleccionada);
                    localStorage.setItem('carrito', JSON.stringify(carrito));
                    actualizarInterfazCarrito();
                    actualizarTotalEfectivo();
                }
            }
        });

        actualizarInterfazCarrito();
        actualizarTotalEfectivo();
    })
    .catch(error => {
        console.error('Error al cargar el archivo JSON de cervezas:', error);
    });

function actualizarInterfazCarrito() {
    const listaCarrito = document.getElementById("lista-carrito");
    listaCarrito.innerHTML = "";

    carrito.forEach(cerveza => {
        const li = document.createElement("li");
        li.textContent = `${cerveza.nombre} - $${cerveza.precio.toFixed(2)}`;

        const botonEliminar = document.createElement("button");
        botonEliminar.textContent = "Eliminar";
        botonEliminar.classList.add("eliminar-producto");
        botonEliminar.addEventListener("click", () => eliminarProducto(cerveza.id));

        li.appendChild(botonEliminar);
        listaCarrito.appendChild(li);
    });
}

function eliminarProducto(id) {
    carrito = carrito.filter(cerveza => cerveza.id !== id);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarInterfazCarrito();
    actualizarTotalEfectivo();
}

function actualizarTotalEfectivo() {
    const totalEfectivoElement = document.getElementById("total-efectivo");
    let total = 0;
    carrito.forEach(cerveza => {
        total += cerveza.precio;
    });
    totalEfectivoElement.textContent = `$${total.toFixed(2)}`;
}

document.getElementById("confirmar-compra").addEventListener("click", function() {
    Swal.fire({
        title: '¿Estás seguro de que deseas confirmar la compra?',
        text: "Una vez confirmada, no podrás deshacer esta acción.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire(
                '¡Compra confirmada!',
                'Tu compra ha sido confirmada con éxito.',
                'success'
            );
        }
    });
});
