package com.prashant.writing.repository;
import com.prashant.writing.entity.Writing;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface WritingRepository extends JpaRepository<Writing,Long>{
 List<Writing> findAllByOrderByUpdatedAtDesc();
 List<Writing> findByIsPublicTrueOrderByUpdatedAtDesc();
}