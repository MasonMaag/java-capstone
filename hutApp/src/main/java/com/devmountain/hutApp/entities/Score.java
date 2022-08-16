package com.devmountain.hutApp.entities;

import com.devmountain.hutApp.dtos.ScoreDto;
import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Table(name = "Scores")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Score {
    @Id
    @GeneratedValue
    private Long id;

    @Column
    private Long high;

    @ManyToOne
    @JsonBackReference
    private User user;

    public Score(ScoreDto scoreDto){
        if (scoreDto.getHigh() != null){
            this.high = scoreDto.getHigh();
        }
    }
}
