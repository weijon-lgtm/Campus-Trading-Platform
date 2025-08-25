package com.example.marketplace.dto;



import lombok.Data;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

@Data
public class CommentDTO {
    private Long id;
    private String content;
    private String username;
    private LocalDateTime createTime;

    @Data
    public static class CreateRequest {
        @NotBlank(message = "评论内容不能为空")
        @Size(max = 500, message = "评论内容不能超过500字")
        private String content;

        @NotNull(message = "物品ID不能为空")
        private Long itemId;
    }
}
