package com.example.marketplace.dto;



import lombok.Data;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ItemDTO {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private String username;
    private LocalDateTime createTime;

    @Data
    public static class CreateRequest {
        @NotBlank(message = "物品名称不能为空")
        private String name;

        private String description;

        @NotNull(message = "价格不能为空")
        @DecimalMin(value = "0.01", message = "价格必须大于0")
        private BigDecimal price;
    }
}

