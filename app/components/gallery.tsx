"use client";

import { useApi } from "@/hooks/useApi";
import { Frame } from "./frame";
import { useEffect, useState } from "react";
import { stompApi } from "@/api/stompApi";
import { Role } from "@/types/role";
import { useGame } from "@/hooks/useGame";
import { HighlightedImage } from "@/types/highlightedImage";

export const Gallery = () => {
  const apiService = useApi();
  const gameApi = useGame();
  const roomCode = stompApi.getCode();
  const [role, setRole] = useState<string | null>(null);
  const [highlightedImage, setHighlightedImage] = useState<number | null>(null);
  const [imageList, setImageList] = useState<(string | null)[]>(
    Array(9).fill(null),
  );

  const handleImageClick = (index: number) => {
    console.log("Image clicked:", index);
  };

  /**
   * Register handlers in game api and fetch images.
   */
  useEffect(() => {
    /**
     * Handles receptions of changed game role.
     */
    const handleRole = (data: Role) => {
      setRole(data.playerRole);
    };

    /**
     * Request broadcasting of role.
     */
    const requestRole = async () => {
      gameApi.requestRole();
    };

    /**
     * Handles reception of the highlighted image
     */
    const handleHighlightedImage = (data: HighlightedImage) => {
      console.warn(data.index);
      if (data.index >= 0) {
        setHighlightedImage(data.index);
      }
    };

    /**
     * Request broadcasting of the highlighted image.
     */
    const requestHighlightedImage = async () => {
      gameApi.requestHighlightedImage();
    };

    /**
     * Fetch all 9 images and store them in a list.
     */
    const fetchImages = async () => {
      const newImageList: (string | null)[] = [...imageList];

      await Promise.all(
        Array.from({ length: 9 }, async (_, i) => {
          try {
            const blob = await apiService.get<Blob>(
              `/image/${roomCode}/${i}`,
              false,
            );
            newImageList[i] = URL.createObjectURL(blob);
          } catch (err) {
            console.error(`Failed to load image at index ${i}`, err);
            newImageList[i] = null;
          }
        }),
      );

      setImageList(newImageList);
    };

    gameApi.onRole(handleRole);
    gameApi.onHighlightedImage(handleHighlightedImage);
    requestRole();
    requestHighlightedImage();
    fetchImages();
  }, [gameApi, apiService, imageList, roomCode]);

  return (
    <Frame className="gallery">
      <div className="image-grid ">
        {imageList.map((url, index) => (
          <div
            key={index}
            className={`image-container ${
              role === "innocent" && highlightedImage === index
                ? "highlight"
                : ""
            }`}
          >
            {url && (
              <img
                src={url}
                alt={`Image ${index}`}
                className="image"
                onClick={() => handleImageClick(index)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleImageClick(index);
                  }
                }}
                tabIndex={0}
              />
            )}
          </div>
        ))}
      </div>
    </Frame>
  );
};
