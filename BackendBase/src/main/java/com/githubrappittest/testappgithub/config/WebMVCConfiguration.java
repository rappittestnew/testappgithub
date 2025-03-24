package com.githubrappittest.testappgithub.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.vs.rappit.authorization.AuthorizationInterceptor;
import com.vs.rappit.base.cache.MSServiceAclCache;
import com.vs.rappit.base.cache.ServiceAclCache;
import com.vs.rappit.jwt.JWTService;

@Configuration
public class WebMVCConfiguration implements WebMvcConfigurer {

  public static final int ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

  @Autowired private ServiceAclCache serviceAclCache;
  @Autowired private MSServiceAclCache msServiceAclCache;
  @Autowired private JWTService jwtService;

  @Value("${anonymous-fe-paths}")
  private List<String> anonymousFEPaths;

  @Value("${anonymous-be-paths}")
  private List<String> anonymousBEPaths;

  public void addInterceptors(InterceptorRegistry registry) {
    registry
        .addInterceptor(
            new AuthorizationInterceptor(
                serviceAclCache, msServiceAclCache, jwtService, anonymousFEPaths, anonymousBEPaths))
        .addPathPatterns("/**/rest/**");
  }

  @Override
  public void addResourceHandlers(final ResourceHandlerRegistry registry) {
    registry
        .addResourceHandler("/index.html")
        .addResourceLocations("classpath:static/index.html")
        .setCachePeriod(0);
    registry
        .addResourceHandler("/*/*/*.json")
        .addResourceLocations("classpath:static/")
        .setCachePeriod(0);
    registry
        .addResourceHandler("/**")
        .addResourceLocations("classpath:/static/")
        .setCachePeriod(ONE_YEAR_IN_SECONDS);
  }
}
