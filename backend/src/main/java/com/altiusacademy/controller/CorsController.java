package com.altiusacademy.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controlador para manejar peticiones CORS OPTIONS
 * 
 * Este controlador maneja explícitamente las peticiones OPTIONS (preflight)
 * para asegurar que CORS funcione correctamente en todos los endpoints.
 */
@RestController
public class CorsController {

    /**
     * Maneja todas las peticiones OPTIONS para CORS preflight
     * 
     * @return ResponseEntity vacío con status 200 OK
     */
    @RequestMapping(value = "/**", method = RequestMethod.OPTIONS)
    public ResponseEntity<Void> handleOptions() {
        return ResponseEntity.ok().build();
    }
}
