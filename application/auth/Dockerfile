# Stable base image having JDK 17 for build
FROM eclipse-temurin:17-jdk-alpine AS builder

# Set the working directory for build
WORKDIR /app

# Copy Gradle wrapper and configuration files
COPY build.gradle settings.gradle ./
COPY gradlew ./gradlew
COPY gradle ./gradle

# Copy the application source code
COPY src ./src

# Build the application JAR file
RUN ./gradlew clean build -x test

# Start a new stage for the runtime image
FROM eclipse-temurin:17-jre-alpine

# Set the working directory for the runtime container
WORKDIR /app

# Copy the built JAR file from the builder stage
COPY --from=builder /app/build/libs/*SNAPSHOT.jar app.jar

# Expose the application port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
