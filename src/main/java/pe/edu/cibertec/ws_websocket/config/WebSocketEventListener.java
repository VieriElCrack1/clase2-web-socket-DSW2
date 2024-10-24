package pe.edu.cibertec.ws_websocket.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import pe.edu.cibertec.ws_websocket.chat.model.MensajeChat;
import pe.edu.cibertec.ws_websocket.chat.model.TipoMensaje;

@RequiredArgsConstructor //solo va a inyectar a las variables -> final
@Slf4j
@Configuration
public class WebSocketEventListener {
    private final SimpMessageSendingOperations messageSendingOperations;

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) { //para ver la desconexion
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage()); //obtener el mensaje
        String usuario = (String) headerAccessor.getSessionAttributes().get("usuario");
        if (usuario != null) {
            var mensaje = MensajeChat.builder().tipo(TipoMensaje.SALIR).usuario(usuario).build();
            messageSendingOperations.convertAndSend("/topic/public", mensaje);
        }
    }
}
