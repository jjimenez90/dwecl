var mapa; // va a contener el mapa Google después de crearlo
var directionsDisplay;
var directionsService;
var googleLatLongActual;
window.onload = obtenerSituacion;

function obtenerSituacion() {
    if (navigator.geolocation) { // Nos aseguramos de que el navegador soporta la API Geolocation
        navigator.geolocation.getCurrentPosition(visualizarSituacion, errorSituacion); //Llamamos al método getCurrentPosition y le pasamos una función manejadora
    } else {
        alert("No hay soporte de geolocalización");
    }
}
// El manejador que será llamado cuando el navegador tenga una situación
// Recibe una variable que contiene la longitud y la latitud así como información sobre la exactitud

function visualizarSituacion(posicion) {
    // Obtenemos latitud y longitud del objeto posicion.coords
    var latitud = posicion.coords.latitude;
    var longitud = posicion.coords.longitude;
    mostrarMapa(posicion.coords);
}

function errorSituacion(error) {
    var tiposError = {
        0: "Error desconocido",
        1: "Permiso denegado por el usuario",
        2: "Posicion no disponible",
        3: "Tiempo excedido"
    };
    var mensajeError = tiposError[error.code];
    if (error.code === 0 || error.code === 2) {
        mensajeError = mensajeError + " " + error.message;
    }
}


function mostrarMapa(coordenadas) {
    var enviar = document.getElementById("enviar");
    enviar.addEventListener("click", calcRoute);

    googleLatLongActual = new google.maps.LatLng(coordenadas.latitude, coordenadas.longitude);

    var opcionesMapa = {
        zoom: 14,
        center: googleLatLongActual,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var divMapa = document.getElementById("mapa");
    var titulo = "Tu situación";
    var contenido = "Tu estás aquí: " + coordenadas.latitude + ", " + coordenadas.longitude;
    mapa = new google.maps.Map(divMapa, opcionesMapa);
    //introducimos la capa del trafico
    directionsDisplay = new google.maps.DirectionsRenderer();
    var trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(mapa);
    directionsDisplay.setMap(mapa);
    addMarker(mapa, googleLatLongActual, titulo, contenido);

}

//metodo para calcular la ruta
function calcRoute() {
    var start = document.getElementById('start').value;
    var end = document.getElementById('end').value;
    if(start==""){
        start=googleLatLongActual;
    }
    var request = {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING
    };
    //objeto que nos calcula la ruta.
    directionsService = new google.maps.DirectionsService();
    //route, metodo que calcula la ruta
    directionsService.route(request, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        }
    });
}

function addMarker(mapa, googleLatLong, titulo, contenido) {
    // Crear el marcador
    var opcionesMarker = {
        position: googleLatLong,
        map: mapa,
        title: titulo,
        clickable: true
    };
    var marcador = new google.maps.Marker(opcionesMarker);
    //cambiamos el icono del puntero.
    marcador.setIcon('direction_down.png');
    //crear la ventana de información
    var opcionesVentanaInfo = {
        content: contenido,
        position: googleLatLong
    };
    var ventanaInfo = new google.maps.InfoWindow(opcionesVentanaInfo);
    // crear un manejador para el evento click en el marcador
    google.maps.event.addListener(marcador, "click", function () {
        ventanaInfo.open(mapa);
    });
}