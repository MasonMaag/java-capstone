package com.devmountain.hutApp.controllers;

import com.devmountain.hutApp.dtos.ScoreDto;
import com.devmountain.hutApp.services.ScoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/scores")
public class ScoreController {

    @Autowired
    private ScoreService scoreService;

    @GetMapping("/user/{userId}")
    public List<ScoreDto> getScoresByUser(@PathVariable Long userId) {
        return scoreService.getAllScoresByUserId(userId);
    }

    @PostMapping("/user/{userId}")
    public void addScore(@RequestBody ScoreDto scoreDto,@PathVariable Long userId) {
        scoreService.addScore(scoreDto, userId);
    }

    @GetMapping("/{scoreId}")
    public Optional<ScoreDto> getScoreById(@PathVariable Long scoreId) {
        return scoreService.getScoreById(scoreId);
    }
}
