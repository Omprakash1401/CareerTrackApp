
package com.careertrack.service;

import java.util.Locale;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.careertrack.exception.DuplicateEmailException;
import com.careertrack.dto.LoginRequest;
import com.careertrack.dto.LoginResponse;
import com.careertrack.exception.InvalidCredentialsException;

import java.util.Optional;


import com.careertrack.dto.RegisterRequest;
import com.careertrack.dto.RegisterResponse;
import com.careertrack.entity.User;
import com.careertrack.repository.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public RegisterResponse register(RegisterRequest request) {

        String email = request.getEmail()
                .trim()
                .toLowerCase(Locale.ROOT);

        if (userRepository.existsByEmail(email)) {
            throw new DuplicateEmailException(
                    "An account with this email already exists.");
        }

        String hashedPassword =
                passwordEncoder.encode(request.getPassword());

        User user = new User(
                request.getName().trim(),
                email,
                hashedPassword
        );

        User savedUser = userRepository.save(user);

        return new RegisterResponse(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail()
        );
    }
    

public LoginResponse login(LoginRequest request) {

    String email = request.getEmail()
            .trim()
            .toLowerCase(Locale.ROOT);

    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new InvalidCredentialsException(
                    "Invalid email or password."
            ));

    boolean passwordMatches = passwordEncoder.matches(
            request.getPassword(),
            user.getPassword()
    );

    if (!passwordMatches) {
        throw new InvalidCredentialsException(
                "Invalid email or password."
        );
    }

    return new LoginResponse(
            user.getId(),
            user.getName(),
            user.getEmail()
    );
}
	

	public Optional<LoginResponse> getUserProfile(Long userId) {

		return userRepository.findById(userId)
				.map(user -> new LoginResponse(
						user.getId(),
						user.getName(),
						user.getEmail()
						));
	}


    
}

