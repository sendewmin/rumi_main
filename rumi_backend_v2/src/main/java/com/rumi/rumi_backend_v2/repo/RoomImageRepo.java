package com.rumi.rumi_backend_v2.repo;

import com.rumi.rumi_backend_v2.entity.RoomImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoomImageRepo extends JpaRepository<RoomImage,Long> {
    List<RoomImage> findImagesByRoomId(Long roomId);


}
