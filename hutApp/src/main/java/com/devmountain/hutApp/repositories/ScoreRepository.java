package com.devmountain.hutApp.repositories;

import com.devmountain.hutApp.entities.Score;
import com.devmountain.hutApp.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ScoreRepository extends JpaRepository<Score, Long> {

    List<Score> findAllByUserEquals(User user);
}
