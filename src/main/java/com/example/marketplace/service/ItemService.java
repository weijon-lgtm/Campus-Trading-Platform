package com.example.marketplace.service;



import com.example.marketplace.dto.ItemDTO;
import com.example.marketplace.entity.Item;
import com.example.marketplace.entity.User;
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
public class ItemService {
    private final ItemRepository itemRepository;
    private final UserRepository userRepository;

    public ItemDTO createItem(ItemDTO.CreateRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("用户不存在"));

        Item item = new Item();
        item.setName(request.getName());
        item.setDescription(request.getDescription());
        item.setPrice(request.getPrice());
        item.setUser(user);

        item = itemRepository.save(item);
        return convertToDTO(item);
    }

    public List<ItemDTO> getAllItems() {
        return itemRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ItemDTO getItemById(Long id) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("物品不存在"));
        return convertToDTO(item);
    }

    public List<ItemDTO> searchItems(String keyword) {
        return itemRepository.searchItems(keyword).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public void deleteItem(Long id, String username) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("物品不存在"));

        if (!item.getUser().getUsername().equals(username)) {
            throw new RuntimeException("无权删除该物品");
        }

        itemRepository.delete(item);
    }

    private ItemDTO convertToDTO(Item item) {
        ItemDTO dto = new ItemDTO();
        dto.setId(item.getId());
        dto.setName(item.getName());
        dto.setDescription(item.getDescription());
        dto.setPrice(item.getPrice());
        dto.setUsername(item.getUser().getUsername());
        dto.setCreateTime(item.getCreateTime());
        return dto;
    }
}
