package com.example.marketplace.repository;


import com.example.marketplace.entity.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface ItemRepository extends JpaRepository<Item, Long> {
    List<Item> findByUserIdOrderByCreateTimeDesc(Long userId);

    @Query("SELECT i FROM Item i WHERE i.name LIKE %?1% OR i.description LIKE %?1%")
    List<Item> searchItems(String keyword);
}

