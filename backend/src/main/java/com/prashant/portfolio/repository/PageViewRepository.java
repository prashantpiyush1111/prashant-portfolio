package com.prashant.portfolio.repository;

import com.prashant.portfolio.entity.PageView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PageViewRepository extends JpaRepository<PageView, Long> {
    @Query("select p.path, count(p) from PageView p group by p.path order by count(p) desc")
    List<Object[]> countViewsByPath();
}
