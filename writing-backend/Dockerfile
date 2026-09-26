FROM eclipse-temurin:17-jre
WORKDIR /app
COPY target/writing-backend-0.1.0.jar app.jar
EXPOSE 9899
ENTRYPOINT ["java","-jar","app.jar"]