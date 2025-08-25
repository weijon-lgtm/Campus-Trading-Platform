package com.example.marketplace.repository;



import com.example.marketplace.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByItemIdOrderByCreateTimeDesc(Long itemId);
}
