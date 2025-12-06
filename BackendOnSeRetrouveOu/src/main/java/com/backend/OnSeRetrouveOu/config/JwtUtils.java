package com.backend.OnSeRetrouveOu.config;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

@Component
public class JwtUtils {

  @Value("${app.secret.jwt}")
  private String secretKey;

  @Value("${app.jwt.expiration}")
  private Long expirationTime;

  public String generateToken(String username) {
    Map<String, Object> claims = new HashMap<>();
    return createtoken(claims, username);
  }

  private String createtoken(Map<String, Object> claims, String subject) {
    long now = System.currentTimeMillis();
    return Jwts.builder()
        .claims(claims)
        .subject(subject)
        .issuedAt(new Date(now))
        .expiration(new Date(now + expirationTime))
        .signWith(getSignKey())
        .compact();
  }

  private Key getSignKey() {
    byte[] keyBytes = secretKey.getBytes();
    return new SecretKeySpec(keyBytes, "HmacSHA256");
  }

  public Boolean validateToken(String token, UserDetails userDetails) {
    String username = extractUsername(token);
    return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
  }

  private boolean isTokenExpired(String token) {
    return extractExpirationDate(token).before(new Date());
  }

  public String extractUsername(String token) {
    return extractClaim(token, Claims::getSubject); 
  }

  private Date extractExpirationDate(String token) {
    return extractClaim(token, Claims::getExpiration);
  }

  private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
    final Claims claims = extractAllClaims(token);
    return claimsResolver.apply(claims);
  }

  private Claims extractAllClaims(String token) {
    return Jwts.parser()
        .verifyWith((javax.crypto.SecretKey) getSignKey())
        .build()
        .parseSignedClaims(token)
        .getPayload();
  }
}