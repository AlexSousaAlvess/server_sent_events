package com.notificacao.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class NotificationDTO {
    private String type;   // "OPERADOR", "SUPERVISOR", "GERENTE"
    private String content;
    private String userEmail;

}
