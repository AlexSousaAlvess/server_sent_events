package com.auth_service.services;

import com.auth_service.models.UserModel;

public interface UserService {
    UserModel findByEmail(String email);
}
