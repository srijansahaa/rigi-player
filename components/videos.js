import { CaretDown, CaretUp, List } from "@phosphor-icons/react";
import Image from "next/image";
import React from "react";

const Videos = (props) => {
  const { vid, handleVideoClick, index, length, handleMove, handleDrop } =
    props;
  return (
    <div
      index={vid.id}
      className="flex items-center justify-between shadow-md hover:shadown-lg p-4 rounded-md border active:shadow-lg hover:bg-gradient-to-r from-indigo-100 cursor-pointer"
      onClick={() => handleVideoClick(vid.video)}
    >
      <div
        className="flex items-center gap-4 cursor-pointer maxLg:text-sm"
        onClick={() => handleVideoClick(vid.video)}
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
          <button onClick={(e) => handleMove(e, index, "up")}>
            <CaretUp size={24} color="#8c8c8c" />
          </button>
        )}
        {index !== length - 1 && (
          <button onClick={(e) => handleMove(e, index, "down")}>
            <CaretDown size={24} color="#8c8c8c" />
          </button>
        )}
        <button
          className="cursor-grab"
          draggable
          onDragStart={(e) => e.dataTransfer.setData("text/plain", index)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop(e, index)}
        >
          <List size={28} color="#8c8c8c" />
        </button>
      </div>
    </div>
  );
};

export default Videos;