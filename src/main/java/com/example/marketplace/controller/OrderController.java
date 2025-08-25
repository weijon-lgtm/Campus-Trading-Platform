package com.example.marketplace.controller;



import com.example.marketplace.dto.OrderDTO;
import com.example.marketplace.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {
    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<?> createOrder(@Valid @RequestBody OrderDTO.CreateRequest request,
                                         @RequestHeader("X-Username") String username) {
        try {
            OrderDTO order = orderService.createOrder(request, username);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/my-orders")
    public ResponseEntity<List<OrderDTO>> getMyOrders(@RequestHeader("X-Username") String username) {
        return ResponseEntity.ok(orderService.getMyOrders(username));
    }

    @GetMapping("/my-selling")
    public ResponseEntity<List<OrderDTO>> getMySellingOrders(@RequestHeader("X-Username") String username) {
        return ResponseEntity.ok(orderService.getMySellingOrders(username));
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<?> acceptOrder(@PathVariable Long id,
                                         @RequestHeader("X-Username") String username) {
        try {
            OrderDTO order = orderService.acceptOrder(id, username);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
