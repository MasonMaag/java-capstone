package com.devmountain.hutApp.dtos;

import com.devmountain.hutApp.entities.Score;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ScoreDto implements Serializable {
    private Long id;
    private Long high;
    private UserDto userDto;

    public ScoreDto(Score score) {
        if (score.getId() != null) {
            this.id = score.getId();
        }
        if (score.getHigh() != null){
            this.high = score.getHigh();
        }
    }
}
