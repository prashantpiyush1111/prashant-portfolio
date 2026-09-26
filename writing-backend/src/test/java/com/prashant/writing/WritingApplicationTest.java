package com.prashant.writing;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
@SpringBootTest(properties={
 "spring.datasource.url=jdbc:h2:mem:testdb",
 "spring.datasource.driver-class-name=org.h2.Driver",
 "spring.jpa.hibernate.ddl-auto=create-drop",
 "writing.owner.username=test",
 "writing.owner.password=test",
 "writing.public.code=1234"
})
class WritingApplicationTest { @Test void contextLoads() {} }