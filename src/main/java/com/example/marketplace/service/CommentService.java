package com.example.marketplace.service;



import com.example.marketplace.dto.CommentDTO;
import com.example.marketplace.entity.Comment;
import com.example.marketplace.entity.Item;
import com.example.marketplace.entity.User;
import com.example.marketplace.repository.CommentRepository;
import com.example.marketplace.repository.ItemRepository;
import com.example.marketplace.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CommentService {
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final ItemRepository itemRepository;

    public CommentDTO createComment(CommentDTO.CreateRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("用户不存在"));

        Item item = itemRepository.findById(request.getItemId())
                .orElseThrow(() -> new RuntimeException("物品不存在"));

        Comment comment = new Comment();
        comment.setContent(request.getContent());
        comment.setUser(user);
        comment.setItem(item);

        comment = commentRepository.save(comment);
        return convertToDTO(comment);
    }

    public List<CommentDTO> getCommentsByItemId(Long itemId) {
        return commentRepository.findByItemIdOrderByCreateTimeDesc(itemId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private CommentDTO convertToDTO(Comment comment) {
        CommentDTO dto = new CommentDTO();
        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        dto.setUsername(comment.getUser().getUsername());
        dto.setCreateTime(comment.getCreateTime());
        return dto;
    }
}
