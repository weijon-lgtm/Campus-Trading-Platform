package com.example.marketplace.dto;



import lombok.Data;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class OrderDTO {
    private Long id;
    private Long itemId;
    private String itemName;
    private BigDecimal price;
    private String buyerUsername;
    private String sellerUsername;
    private String status;
    private String buyerContact;
    private String message;
    private LocalDateTime createTime;

    @Data
    public static class CreateRequest {
        @NotNull(message = "物品ID不能为空")
        private Long itemId;

        @NotBlank(message = "联系方式不能为空")
        private String buyerContact;

        private String message;
    }
}

