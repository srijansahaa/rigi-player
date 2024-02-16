"use client";

import {
  CaretDown,
  CaretUp,
  CaretUpDown,
  ClockClockwise,
  ClockCounterClockwise,
  FrameCorners,
  List,
  Pause,
  Play,
} from "@phosphor-icons/react";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";

const API_KEY = "tcXk9eyhADKf5DzWUhQnutDiO1YqwLCbJXTrzGadQ80UWa9Doa0Q0dXZ";

export default function Home() {
  const [playlist, setPlaylist] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [progressDrag, setProgressDrag] = useState(false);
  const [showPlayback, setShowPlayback] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://api.pexels.com/videos/popular?per_page=10&min_duration=30",
          {
            headers: {
              Authorization: API_KEY,
            },
          }
        );

        const videos = response.data.videos.map((video) => ({
          id: video.id,
          title: video.user.name,
          thumbnail: video.image,
          video: {
            url: video.video_files[0].link,
            file_type: video.video_files[0].file_type,
          },
        }));
        setPlaylist(videos);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("text/plain", index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();

    const draggedIndex = e.dataTransfer.getData("text/plain");
    const updatedPlaylist = [...playlist];
    const [movedItem] = updatedPlaylist.splice(draggedIndex, 1);
    updatedPlaylist.splice(targetIndex, 0, movedItem);

    setPlaylist(updatedPlaylist);
  };

  const handleMove = (index, location) => {
    console.log("cdscds");
    const updatedPlaylist = [...playlist];
    if (
      (location === "up" && index === 0) ||
      (location === "down" && index === playlist.length - 1)
    ) {
      return;
    }
    const targetIndex = location === "up" ? index - 1 : index + 1;
    [updatedPlaylist[index], updatedPlaylist[targetIndex]] = [
      updatedPlaylist[targetIndex],
      updatedPlaylist[index],
    ];

    setPlaylist(updatedPlaylist);
  };

  const togglePlayPause = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleRewind = () => {
    if (videoRef.current) {
      videoRef.current.currentTime -= 10;
    }
  };

  const toggleFastForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime += 10;
    }
  };

  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime);
    if (videoRef.current.currentTime === videoRef.current.duration)
      setIsPlaying(false);
  };

  const handleProgressBarClick = (e) => {
    if (videoRef.current) {
      const progressBar = e.target;
      const clickedTime =
        (e.nativeEvent.offsetX / progressBar.offsetWidth) *
        videoRef.current.duration;
      videoRef.current.currentTime = clickedTime;
      setCurrentTime(clickedTime);
    }
  };

  const progressDragMove = (e) => {
    if (progressDrag && videoRef.current) {
      const progressBar = e.target;
      const draggedTime =
        (e.nativeEvent.offsetX / progressBar.offsetWidth) *
        videoRef.current.duration;
      setCurrentTime(draggedTime);
    }
  };

  const handlePlaybackSpeed = (newSpeed) => {
    setPlaybackSpeed(newSpeed);
    if (videoRef.current) {
      videoRef.current.playbackRate = newSpeed;
    }
    setShowPlayback(false);
  };

  const speedConfigs = [0.5, 0.75, 1, 1.25, 1.75, 2];

  const handleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoRef.current.requestFullscreen().catch((err) => {
        console.error(err);
      });
    }
  };

  const handleSearch = async (e) => {
    setSearchValue(e.target.value);
    if (e.target.value.length > 2) {
      try {
        const response = await axios.get(
          `https://api.pexels.com/videos/search?query=${e.target.value}&per_page=10&min_duration=30`,
          {
            headers: {
              Authorization: API_KEY,
            },
          }
        );

        console.log(response);

        const videos = response.data.videos.map((video) => ({
          id: video.id,
          title: video.user.name,
          thumbnail: video.image,
          video: {
            url: video.video_files[0].link,
            file_type: video.video_files[0].file_type,
          },
        }));
        setPlaylist(videos);
      } catch (err) {
        console.error(err);
      }
    }
  };
  console.log(playlist);
  return (
    <main className="px-32">
      <div>
        <div>
          <input
            className="bg-white w-1/2 shadow-md p-4 rounded-md border outline-none mb-4"
            value={searchValue}
            placeholder="Search your own playlist"
            onChange={handleSearch}
          />
        </div>
        <h1 className="text-violet-900 font-semibold text-xl mb-4">
          Watch the most popular videos from Pexels
        </h1>

        <div className="flex w-full gap-4">
          <div className="flex flex-col gap-8 w-1/2">
            {playlist.length === 0 ? (
              <div className="text-center text-violet-900 font-semibold text-2xl my-auto">Try a different search!</div>
            ) : (
              playlist.map((vid, index) => (
                <div
                  key={vid.id}
                  className="flex items-center justify-between shadow-md hover:shadown-lg p-4 rounded-md border active:shadow-lg"
                >
                  <div
                    className="flex items-center gap-4 cursor-pointer"
                    onClick={() => {
                      if (activeVideo !== vid.video) {
                        setActiveVideo(vid.video);
                        setCurrentTime(0);
                        setIsPlaying(true);
                      }
                    }}
                  >
                    <Image
                      src={vid.thumbnail}
                      width={40}
                      height={40}
                      alt={vid.title}
                      className="rounded-full w-12 h-12"
                    />
                    {vid.title}
                  </div>

                  <div className="flex items-center gap-2">
                    {index !== 0 && (
                      <button onClick={() => handleMove(index, "up")}>
                        <CaretUp size={24} color="#8c8c8c" />
                      </button>
                    )}
                    {index !== playlist.length - 1 && (
                      <button onClick={() => handleMove(index, "down")}>
                        <CaretDown size={24} color="#8c8c8c" />
                      </button>
                    )}
                    <button
                      className="cursor-grab"
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, index)}
                    >
                      <List size={28} color="#8c8c8c" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="w-1/2 h-screen sticky customPlayer flex items-center">
            {activeVideo ? (
              <>
                <div className="customVideoControls absolute z-30 flex gap-6">
                  <button
                    className="bg-white/50 rounded-full p-2"
                    onClick={toggleRewind}
                  >
                    <ClockCounterClockwise
                      size={32}
                      color="#4c1d95"
                      weight="fill"
                    />
                  </button>
                  <button
                    className="bg-white/50 rounded-full p-2"
                    onClick={togglePlayPause}
                  >
                    {isPlaying ? (
                      <Pause size={40} color="#4c1d95" weight="fill" />
                    ) : (
                      <Play size={40} color="#4c1d95" weight="fill" />
                    )}
                  </button>
                  <button
                    className="bg-white/50 rounded-full p-2"
                    onClick={toggleFastForward}
                  >
                    <ClockClockwise size={32} color="#4c1d95" weight="fill" />
                  </button>
                </div>

                <video
                  key={activeVideo.url}
                  controls={false}
                  playsInline
                  className="h-full w-full bg-black rounded-md relative"
                  ref={videoRef}
                  onTimeUpdate={handleTimeUpdate}
                  autoPlay
                >
                  <source src={activeVideo.url} type={activeVideo.file_type} />
                </video>

                <div
                  className="absolute flex items-start z-30 w-full h-2 bg-white/50 bottom-8 cursor-pointer"
                  onClick={handleProgressBarClick}
                  onMouseDown={() => setProgressDrag(true)}
                  onMouseMove={progressDragMove}
                  onMouseUp={() => setProgressDrag(true)}
                >
                  <span className="text-slate-300 flex text-sm absolute left-2 bottom-3">
                    <b className="text-white">
                      {Math.round(currentTime) || "00"}:00 /&nbsp;
                    </b>
                    {Math.round(videoRef.current?.duration) || "00"}:00
                  </span>

                  <div
                    className="h-full bg-violet-900 progressBarInner"
                    style={{
                      width: `${
                        (currentTime / videoRef.current?.duration) * 100 || 0
                      }%`,
                    }}
                  ></div>
                </div>

                <div className="customDropdown text-white bg-black/50 rounded-md absolute bottom-12 z-30 right-2 text-sm p-2 pb-0">
                  <label
                    className="flex gap-4 font-bold cursor-pointer"
                    onClick={() => setShowPlayback(!showPlayback)}
                  >
                    Playback Speed <CaretUpDown size={20} color="#ffffff" />
                  </label>
                  {showPlayback && (
                    <ul className=" flex flex-col gap-4 border-t mt-2 py-2">
                      {speedConfigs.map((speed, index) => (
                        <li
                          onClick={() => handlePlaybackSpeed(parseFloat(speed))}
                          key={index}
                          className={`cursor-pointer ${
                            playbackSpeed === speed ? "font-bold" : "font-light"
                          }`}
                        >
                          {speed !== 1 ? `${speed}x` : "Normal"}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <button
                  className="absolute bottom-1 z-30 right-4"
                  onClick={handleFullscreen}
                >
                  <FrameCorners size={24} color="#ffffff" />
                </button>
              </>
            ) : (
              <img
                src="/assets/landing.svg"
                className="w-11/12 mx-auto"
                alt="Player Landing"
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
