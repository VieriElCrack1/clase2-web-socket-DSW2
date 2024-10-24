$(document).ready(function() {
    var paginaUsuario = $("#username-page"); //div usuario
    var paginaChat = $("#chat-page"); //div chat
    var formularioUsuario = $("#usernameForm"); //form user
    var formularioMensaje = $("#messageForm"); //form message
    var areaMensajes = $("#messageArea"); //ul message area
    var conectando = $(".connecting"); //ul message area

    var stompClient = null;
    var usuario = null;

    formularioUsuario.on("submit", conectarUsuario);
    formularioMensaje.on("submit", enviarMensajes);

    function conectarUsuario(event) {
        usuario = $("#name").val().trim(); //input name
        if(usuario) {
            //cuando agregue un usuario, voy a esconder un formulario y hacer vista a otro form
            paginaUsuario.addClass("d-none"); //agregar la clase y mostrar
            paginaChat.removeClass("d-none"); //esconder o remover el div pagina chat

            var socket = new SockJS("/websocket"); //instanciar el websocket y recibir el parametro del metodo registerStompEndpoints en el config.
            stompClient = Stomp.over(socket);
            stompClient.connect({}, conectarSocket, errorSocket);
        }

        event.preventDefault(); //evita refrescar pagina
    }

    function enviarMensajes(event) {

            var contenido = $("#message").val().trim(); // obteniendo el mensaje en el div
            if(contenido && stompClient) { //si existen o tienen contenido
                var chatMensaje = {
                    usuario: usuario,
                    contenido: contenido,
                    tipo: "CHAT"
                };

                stompClient.send("/app/chat.enviarMensaje", {},
                    JSON.stringify(chatMensaje));
                    $("#message").val("");
            }

            event.preventDefault(); //evita refrescar pagina
        }

    function conectarSocket() {
        stompClient.subscribe("/topic/public", mensajeRecibido); //suscribir al canal que creamos /topic/public
        //app -> conectar desde el cliente de conexion, del MessageMapping del controlador /app/chat.agregarUsuario
        stompClient.send("/app/chat.agregarUsuario", {},
            JSON.stringify({
                usuario: usuario,
                tipo: "UNIR"
            }));
        conectando.addClass('d-none');
    }

    function mensajeRecibido(mensaje) {
        var mensajeUsuario = JSON.parse(mensaje.body);
        var elementoMensaje = $("<li>").addClass("list-group-item");
        if (mensajeUsuario.tipo === "UNIR") {
            elementoMensaje.addClass("event-message").text(mensajeUsuario.usuario + " se ha unido a la sala");
        } else if (mensajeUsuario.tipo === "SALIR") {
            elementoMensaje.addClass("event-message").text(mensajeUsuario.usuario + " se ha salido a la sala");
        } else {
            var usuarioElement = $("<strong>").text(mensajeUsuario.usuario);
            var textoElement = $("<span>").text(mensajeUsuario.contenido);
            elementoMensaje.append(usuarioElement).append(": ").append(textoElement);
        }
        areaMensajes.append(elementoMensaje);
        areaMensajes.scrollTop(areaMensajes[0].scrollHeight); //para mostrar el scroll para los chat de los mensajes
    }

    function errorSocket() {
        conectando.text("Error al conectarse al websocket")
        conectando.css("color", "red");
    }



});