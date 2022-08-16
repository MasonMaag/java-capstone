package com.devmountain.hutApp.services;

import com.devmountain.hutApp.dtos.ScoreDto;
import com.devmountain.hutApp.entities.Score;
import com.devmountain.hutApp.entities.User;
import com.devmountain.hutApp.repositories.ScoreRepository;
import com.devmountain.hutApp.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ScoreServiceImpl implements ScoreService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ScoreRepository scoreRepository;

    @Override
    @Transactional
    public void addScore(ScoreDto scoreDto, Long userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        Score score = new Score(scoreDto);
        userOptional.ifPresent(score::setUser);
        scoreRepository.saveAndFlush(score);
    }
    @Override
    public List<ScoreDto> getAllScoresByUserId(Long userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()){
            List<Score> scoreList = scoreRepository.findAllByUserEquals(userOptional.get());
            return scoreList.stream().map(score -> new ScoreDto(score)).collect(Collectors.toList());
        }
        return Collections.emptyList();
        }

    @Override
    public Optional<ScoreDto> getScoreById(Long scoreId) {
        Optional<Score> scoreOptional = scoreRepository.findById(scoreId);
        if (scoreOptional.isPresent()){
            return Optional.of(new ScoreDto(scoreOptional.get()));
        }
        return Optional.empty();
    }
}
