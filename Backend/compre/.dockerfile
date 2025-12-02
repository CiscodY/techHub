# Build stage: usa Maven para compilar y empaquetar
FROM maven:3.9.6-eclipse-temurin-21 as build
WORKDIR /app

# Copia pom, mvnw y wrapper para aprovechar cache de dependencias
COPY mvnw pom.xml ./
COPY .mvn .mvn
# Copia el código
COPY src ./src

RUN chmod +x ./mvnw
# Construye el JAR
RUN ./mvnw -DskipTests clean package

# Runtime stage: imagen mínima con JRE
FROM eclipse-temurin:21-jre as runtime
WORKDIR /app

# Copia JAR generado
COPY --from=build /app/target/*.jar app.jar

# Puerto (por convención 8080)
EXPOSE 8080

# Entrypoint
ENTRYPOINT ["java","-jar","/app/app.jar"]