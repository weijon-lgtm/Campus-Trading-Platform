package com.example.marketplace.repository;



import com.example.marketplace.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByBuyerIdOrderByCreateTimeDesc(Long buyerId);
    List<Order> findByItemUserIdOrderByCreateTimeDesc(Long sellerId);
    List<Order> findByItemId(Long itemId);
}
