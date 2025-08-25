package com.example.marketplace.controller;



import com.example.marketplace.dto.ItemDTO;
import com.example.marketplace.service.ItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/items")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ItemController {
    private final ItemService itemService;

    @PostMapping
    public ResponseEntity<?> createItem(@Valid @RequestBody ItemDTO.CreateRequest request,
                                        @RequestHeader("X-Username") String username) {
        try {
            ItemDTO item = itemService.createItem(request, username);
            return ResponseEntity.ok(item);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<ItemDTO>> getAllItems() {
        return ResponseEntity.ok(itemService.getAllItems());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getItemById(@PathVariable Long id) {
        try {
            ItemDTO item = itemService.getItemById(id);
            return ResponseEntity.ok(item);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<ItemDTO>> searchItems(@RequestParam String keyword) {
        return ResponseEntity.ok(itemService.searchItems(keyword));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteItem(@PathVariable Long id,
                                        @RequestHeader("X-Username") String username) {
        try {
            itemService.deleteItem(id, username);
            return ResponseEntity.ok("删除成功");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
