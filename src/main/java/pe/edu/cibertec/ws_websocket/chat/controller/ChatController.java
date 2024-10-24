package pe.edu.cibertec.ws_websocket.chat.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;
import pe.edu.cibertec.ws_websocket.chat.model.MensajeChat;

@Controller
public class ChatController {

    @SendTo("/topic/public") //para difundir con los demas clientes
    @MessageMapping("/chat.enviarMensaje") //ya no es http, ahora es tcp es MessageMapping
    public MensajeChat enviarMensaje(@Payload MensajeChat mensaje) {
        return mensaje;
    }

    @MessageMapping("/chat.agregarUsuario")
    @SendTo("/topic/public") //payload -> Anotación que vincula un parámetro de metodo a la carga util de un mensaje
    public MensajeChat agregaUsuario(@Payload MensajeChat mensaje, SimpMessageHeaderAccessor headerAccessor) {
        //el SimpMessageHeaderAccessor puede agregar un usuario del chat y retirarlo del chat
        headerAccessor.getSessionAttributes().put("usuario", mensaje.getUsuario());
        return mensaje;
    }

}
