package com.githubrappittest.testappgithub.config;

import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.context.annotation.Configuration;
import com.vs.rappit.springsecurity.base.authentication.oauthlogin.OAuthSecurityConfig;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends OAuthSecurityConfig {}
