
package com.careertrack.security;

import java.io.IOException;
import java.util.Arrays;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final String COOKIE_NAME = "CAREERTRACK_AUTH";

    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }
    
    

    @Override
    
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
    
            throws ServletException, IOException {
    	
    	System.out.println("JWT filter called: " + request.getRequestURI());
        Cookie[] cookies = request.getCookies();

        if (cookies != null) {
            Arrays.stream(cookies)
                    .filter(cookie ->
                            COOKIE_NAME.equals(cookie.getName()))
                    .findFirst()
                    .ifPresent(cookie -> authenticateToken(cookie.getValue()));
        }

        filterChain.doFilter(request, response);
    }

    private void authenticateToken(String token) {
        if (token == null || token.isBlank()) {
            return;
        }

        try {
            if (!jwtService.isTokenValid(token)) {
                return;
            }

            Long userId = jwtService.extractUserId(token);

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            userId,
                            null,
                            AuthorityUtils.NO_AUTHORITIES
                    );

            SecurityContextHolder.getContext()
                    .setAuthentication(authentication);

        } catch (RuntimeException ex) {
            // Ignore invalid tokens; protected endpoints will reject
            // requests that remain unauthenticated.
        }
    }
}
