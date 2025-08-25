package com.example.marketplace.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "items")
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private BigDecimal price;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL)
    private List<Comment> comments;

    private LocalDateTime createTime;

    // 使用独立的枚举类，不是内部枚举
    @Enumerated(EnumType.STRING)
    private ItemStatus status = ItemStatus.AVAILABLE;

    // 重要：删除了内部枚举定义！
    // 之前的这部分代码需要完全删除：
    // enum ItemStatus {
    //     AVAILABLE,  // 可售
    //     SOLD       // 已售出
    // }

    @PrePersist
    protected void onCreate() {
        createTime = LocalDateTime.now();
    }
}