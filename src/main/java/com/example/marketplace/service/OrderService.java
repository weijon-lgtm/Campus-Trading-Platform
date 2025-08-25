package com.example.marketplace.service;



import com.example.marketplace.dto.OrderDTO;
import com.example.marketplace.entity.*;
import com.example.marketplace.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ItemRepository itemRepository;

    public OrderDTO createOrder(OrderDTO.CreateRequest request, String username) {
        User buyer = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("用户不存在"));

        Item item = itemRepository.findById(request.getItemId())
                .orElseThrow(() -> new RuntimeException("物品不存在"));

        // 检查是否是自己的物品
        if (item.getUser().getId().equals(buyer.getId())) {
            throw new RuntimeException("不能购买自己的物品");
        }

        // 检查物品是否已售出
        if (item.getStatus() == ItemStatus.SOLD) {
            throw new RuntimeException("该物品已售出");
        }

        Order order = new Order();
        order.setBuyer(buyer);
        order.setItem(item);
        order.setPrice(item.getPrice());
        order.setBuyerContact(request.getBuyerContact());
        order.setMessage(request.getMessage());

        order = orderRepository.save(order);
        return convertToDTO(order);
    }

    public List<OrderDTO> getMyOrders(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("用户不存在"));

        return orderRepository.findByBuyerIdOrderByCreateTimeDesc(user.getId())
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<OrderDTO> getMySellingOrders(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("用户不存在"));

        return orderRepository.findByItemUserIdOrderByCreateTimeDesc(user.getId())
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public OrderDTO acceptOrder(Long orderId, String username) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("订单不存在"));

        // 验证是否是卖家
        if (!order.getItem().getUser().getUsername().equals(username)) {
            throw new RuntimeException("无权操作此订单");
        }

        order.setStatus(OrderStatus.ACCEPTED);
        // 将物品标记为已售出
        order.getItem().setStatus(ItemStatus.SOLD);

        order = orderRepository.save(order);
        return convertToDTO(order);
    }

    private OrderDTO convertToDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setItemId(order.getItem().getId());
        dto.setItemName(order.getItem().getName());
        dto.setPrice(order.getPrice());
        dto.setBuyerUsername(order.getBuyer().getUsername());
        dto.setSellerUsername(order.getItem().getUser().getUsername());
        dto.setStatus(order.getStatus().toString());
        dto.setBuyerContact(order.getBuyerContact());
        dto.setMessage(order.getMessage());
        dto.setCreateTime(order.getCreateTime());
        return dto;
    }
}
