package pe.edu.cibertec.ws_websocket.chat.model;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class MensajeChat {
    private TipoMensaje tipo;
    private String contenido;
    private String usuario;
}
