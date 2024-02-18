"use client";

import Videos from "@/components/videos";
import { useAppDispatch, useAppSelector } from "@/feature/hooks";
import { updatePlaylist } from "@/feature/playlistReducer";
import {
  CaretUpDown,
  ClockClockwise,
  ClockCounterClockwise,
  FrameCorners,
  Pause,
  Play,
} from "@phosphor-icons/react";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";

const API_KEY = "tcXk9eyhADKf5DzWUhQnutDiO1YqwLCbJXTrzGadQ80UWa9Doa0Q0dXZ";

export default function Home() {
  const [activeVideo, setActiveVideo] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [progressDrag, setProgressDrag] = useState(false);
  const [showPlayback, setShowPlayback] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [loading, setLoading] = useState(false);

  const playlist = useAppSelector((state) => state.playlist.playlist);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setLoading(true);
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
        dispatch(updatePlaylist(videos));
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();

    const draggedIndex = e.dataTransfer.getData("text/plain");
    const updatedPlaylist = [...playlist];
    const [movedItem] = updatedPlaylist.splice(draggedIndex, 1);
    updatedPlaylist.splice(targetIndex, 0, movedItem);

    dispatch(updatePlaylist(updatedPlaylist));
  };

  const handleMove = (e, index, location) => {
    e.stopPropagation();
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

    dispatch(updatePlaylist(updatedPlaylist));
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

    localStorage.setItem("videoTime", videoRef.current.currentTime);
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
    setLoading(true);
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

        const videos = response.data.videos.map((video) => ({
          id: video.id,
          title: video.user.name,
          thumbnail: video.image,
          video: {
            url: video.video_files[0].link,
            file_type: video.video_files[0].file_type,
          },
        }));
        dispatch(updatePlaylist(videos));
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }
  };

  const handleVideoClick = (vid) => {
    if (activeVideo !== vid) {
      setActiveVideo(vid);
      localStorage.setItem("activeVideo", JSON.stringify(vid));
      setCurrentTime(0);
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    setActiveVideo(JSON.parse(localStorage.getItem("activeVideo")) || null);
  }, []);

  useEffect(() => {
    console.log(videoRef.current);
    if (videoRef.current) {
      setIsPlaying(!videoRef.current.paused);
      videoRef.current.currentTime = localStorage.getItem("videoTime");
    }
  }, [videoRef.current]);

  return (
    <main className="px-4 lg:px-32 pb-4">
      <div>
        <div className="flex justify-between mb-4 maxLg:text-sm maxLg:gap-2">
          <input
            className="bg-white w-full lg:w-1/2 shadow-md p-4 rounded-md border outline-none"
            value={searchValue}
            placeholder="Get your own playlist"
            onChange={handleSearch}
          />
          <button
            className="border border-violet-900 px-4 rounded-md text-black enabled:hover:bg-indigo-900 enabled:hover:text-white whitespace-nowrap disabled:cursor-not-allowed disabled:border-slate-200"
            onClick={() => {
              setActiveVideo(null);
              localStorage.removeItem("activeVideo");
              localStorage.removeItem("videoTime");
            }}
            disabled={!activeVideo}
          >
            Close Player
          </button>
        </div>
        <h1 className="text-violet-900 font-semibold text-sm lg:text-xl mb-4 lg:w-1/2 flex lg:whitespace-nowrap items-center gap-4">
          {searchValue.length < 4
            ? "Watch the most popular videos from Pexels"
            : `Search results for ${searchValue}`}

          <div className="border-b-2 border-violet-900 w-full" />
        </h1>

        <div className="flex flex-col lg:flex-row w-full gap-4">
          <div className="flex flex-col gap-8 lg:w-1/2">
            {loading ? (
              <Image
                alt="loading..."
                src="/assets/loader.gif"
                width={100}
                height={100}
                className="mx-auto"
              />
            ) : playlist?.length === 0 ? (
              <div className="text-center text-violet-900 font-semibold text-sm lg:text-2xl my-auto">
                Try a different search!
              </div>
            ) : (
              playlist?.map((vid, index) => (
                <Videos
                  key={index}
                  vid={vid}
                  index={index}
                  handleVideoClick={handleVideoClick}
                  length={playlist.length}
                  handleMove={handleMove}
                  handleDrop={handleDrop}
                />
              ))
            )}
          </div>

          <div className="lg:w-1/2 h-screen fixed maxLg:bottom-0 maxLg:left-0 maxLg:z-50 lg:sticky customPlayer flex items-end lg:items-center">
            {activeVideo ? (
              <>
                <div className="customVideoControls absolute z-30 flex gap-6 maxLg:bottom-1/4">
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

                <div
                  className="absolute block lg:hidden w-full h-screen bg-black/50"
                  onClick={() => {
                    setActiveVideo(null);
                    localStorage.removeItem("activeVideo");
                    localStorage.removeItem("videoTime");
                  }}
                />

                <video
                  key={activeVideo.url}
                  controls={false}
                  playsInline
                  className="h-1/2 lg:h-full w-full bg-black rounded-md relative"
                  ref={videoRef}
                  onTimeUpdate={handleTimeUpdate}
                  autoPlay
                >
                  <source src={activeVideo.url} type={activeVideo.file_type} />
                </video>

                <div
                  className="absolute flex items-start z-30 w-full h-2 bg-white/50 bottom-8 cursor-pointer progressBar"
                  onClick={handleProgressBarClick}
                  onMouseDown={() => setProgressDrag(true)}
                  onMouseMove={progressDragMove}
                  onMouseUp={() => setProgressDrag(false)}
                >
                  <span className="text-slate-300 flex text xs lg:text-sm absolute left-2 bottom-3">
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

                <div className="customDropdown text-white bg-black/50 rounded-md absolute bottom-12 z-30 right-2 text-xs lg:text-sm p-2 pb-0">
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
                  className="absolute bottom-1 z-30 right-4 fullscreen"
                  onClick={handleFullscreen}
                >
                  <FrameCorners size={24} color="#ffffff" />
                </button>
              </>
            ) : (
              <img
                src="/assets/landing.svg"
                className="w-11/12 mx-auto hidden lg:block"
                alt="Player Landing"
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
