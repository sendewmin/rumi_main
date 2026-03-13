package com.rumi.rumi_backend_v2.controller;


import com.rumi.rumi_backend_v2.dto.RoomImageDto;
import com.rumi.rumi_backend_v2.repo.RoomRepo;
import com.rumi.rumi_backend_v2.service.RoomImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController  //here we register the class as api endpoint
@RequestMapping(path = "/api/rooms")  //the parent endpoint is /api/rooms
@RequiredArgsConstructor
public class RoomImageController {

    private final RoomImageService roomImageService;


    @PostMapping(path = "/{room_id}/images")  //here the psot mapping url is room id/ image
    //here we take the room_id as Path Param and store it in the room_id variable
    public ResponseEntity<?> uploadImages(@PathVariable("room_id") long roomId, @RequestParam("image")List<MultipartFile> images){
        try{
            roomImageService.uploadRoomImages(roomId,images);
            System.out.println("Controller: "+roomId);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "Room Image Added"));
        }
        catch(RuntimeException e){
            if (e.getMessage().contains("Room not found")) {
                System.out.println("Controller: "+e.getMessage());
                System.out.println(ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Room not found")));
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Room not found"));
            }
            System.out.println("Controller: "+e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Internal server error"));
        }

        catch (Exception e) {
            System.out.println("Controller: "+e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Image upload failed"));
        }

    }



    // This is a GET request
    @GetMapping(path = "/{room_id}/images")  //Here this is the Get url
    public ResponseEntity<?> fetchImages(@PathVariable("room_id") long room_id){
        try{
            //List<RoomImageDto> roomImageDtos = roomImageService.fetchRoomImages(room_id);
            return new ResponseEntity<>("Room images fetch for "+room_id, HttpStatus.CREATED);
        }
        catch (Exception e) {
            System.out.println("Controller: "+e.getMessage());
            return new ResponseEntity<>("Image Fetch Failed", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

}
