package com.auth_service.controller;

import com.auth_service.config.JwtService;
import com.auth_service.dto.AuthRequest;
import com.auth_service.dto.AuthResponse;
import com.auth_service.dto.RegisterRequest;
import com.auth_service.dto.UserProfileResponse;
import com.auth_service.models.UserModel;
import com.auth_service.repositories.UserRepository;
import com.auth_service.services.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> profile(
            @RequestParam(value = "email", required = false) String emailParam,
            HttpServletRequest request
    ) {
        String email;

        if (emailParam != null && !emailParam.isBlank()) {
            email = emailParam;
        } else {
            // Fallback para extrair do token
            String token = jwtService.extractTokenFromHeader(request);
            email = jwtService.extractUsername(token);
        }

        UserModel user = userRepository.findByEmail(email).orElseThrow();
        return ResponseEntity.ok(
                new UserProfileResponse(user.getName(), user.getEmail(), user.getRole())
        );
    }
}
