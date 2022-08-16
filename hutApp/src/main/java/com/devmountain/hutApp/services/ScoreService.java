package com.devmountain.hutApp.services;

import com.devmountain.hutApp.dtos.ScoreDto;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

public interface ScoreService {
    @Transactional
    void addScore(ScoreDto scoreDto, Long userId);

    List<ScoreDto> getAllScoresByUserId(Long userId);

    Optional<ScoreDto> getScoreById(Long scoreId);
}
