package com.prashant.portfolio.config;

import com.prashant.portfolio.web.ContactRateLimitInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    private final ContactRateLimitInterceptor contactRateLimitInterceptor;

    public WebMvcConfig(ContactRateLimitInterceptor contactRateLimitInterceptor) {
        this.contactRateLimitInterceptor = contactRateLimitInterceptor;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(contactRateLimitInterceptor);
    }
}
