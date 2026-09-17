package com.prashant.portfolio.controller;

import com.prashant.portfolio.entity.Blog;
import com.prashant.portfolio.service.BlogService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/blogs")
public class BlogController {
    private static final DateTimeFormatter RSS_DATE = DateTimeFormatter.RFC_1123_DATE_TIME;

    private final BlogService service;

    public BlogController(BlogService service) { this.service = service; }

    @GetMapping
    public List<Blog> all() { return service.findAll(); }

    @GetMapping("/rss")
    public org.springframework.http.ResponseEntity<String> rss() {
        StringBuilder xml = new StringBuilder();
        xml.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
        xml.append("<rss version=\"2.0\"><channel>");
        xml.append("<title>Prashant Maurya | Java Full Stack Developer</title>");
        xml.append("<link>https://github.com/prashantpiyush1111/prashant-portfolio</link>");
        xml.append("<description>Articles about Java, Spring Boot, React and full-stack development.</description>");
        for (Blog blog : service.findAll()) {
            xml.append("<item>");
            appendTag(xml, "title", blog.getTitle());
            appendTag(xml, "link", "https://github.com/prashantpiyush1111/prashant-portfolio/blog/" + blog.getId());
            if (blog.getPublishedDate() != null) {
                appendTag(xml, "pubDate", blog.getPublishedDate().atStartOfDay(ZoneOffset.UTC).format(RSS_DATE));
            }
            appendTag(xml, "description", blog.getDescription() != null ? blog.getDescription() : blog.getSummary());
            xml.append("</item>");
        }
        xml.append("</channel></rss>");
        return org.springframework.http.ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("application/rss+xml"))
                .body(xml.toString());
    }

    @GetMapping("/{id}")
    public Blog byId(@PathVariable Long id) { return service.findById(id); }

    private static void appendTag(StringBuilder xml, String tag, String value) {
        xml.append('<').append(tag).append('>')
                .append(escapeXml(value == null ? "" : value))
                .append("</").append(tag).append('>');
    }

    private static String escapeXml(String value) {
        return value.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&apos;");
    }
}
