import React, {useRef, useState} from "react";
import {Box} from "@material-ui/core";
import {Media} from "./Media";
import IconButton from "@material-ui/core/IconButton";
import PlayCircleFilledWhiteIcon from '@material-ui/icons/PlayCircleFilledWhite';
import CancelIcon from '@material-ui/icons/Cancel';

export default function MediaWrapper({ media, onDelete }) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef();

  function togglePlay() {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.pause();
        setPlaying(false);
      } else {
        videoRef.current.play();
        setPlaying(true);
      }
    }
  }

  const style = {
    delete: {
      position: "absolute",
      bottom: 0,
      right: 0
    },
    play: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)"
    }
  }

  console.log(media.url);

  if (media.mimeType.startsWith("video")) {
    return (
      <Box sx={{ position: "relative"}}>
        <Box onClick={togglePlay}>
          <Media data={media} loop mediaRef={videoRef}/>
        </Box>
        {!playing &&
          <IconButton sx={style.play} onClick={togglePlay}>
            <PlayCircleFilledWhiteIcon style={{ color: "white"}} fontSize={"large"}/>
          </IconButton>
        }
      </Box>
    )
  }
  return (
    <Box sx={{ position: "relative"}}>
      <Media data={media} />
      {media?.url && !!onDelete &&
        <IconButton onClick={onDelete} sx={style.delete}>
          <CancelIcon style={{ color: "red"}} />
        </IconButton>
      }
    </Box>
  )
}
