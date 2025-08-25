package com.example.marketplace.controller;



import com.example.marketplace.dto.CommentDTO;
import com.example.marketplace.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class CommentController {
    private final CommentService commentService;

    @PostMapping
    public ResponseEntity<?> createComment(@Valid @RequestBody CommentDTO.CreateRequest request,
                                           @RequestHeader("X-Username") String username) {
        try {
            CommentDTO comment = commentService.createComment(request, username);
            return ResponseEntity.ok(comment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/item/{itemId}")
    public ResponseEntity<List<CommentDTO>> getCommentsByItemId(@PathVariable Long itemId) {
        return ResponseEntity.ok(commentService.getCommentsByItemId(itemId));
    }
}

