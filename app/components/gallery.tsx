"use client";

import { useApi } from "@/hooks/useApi";
import { Frame } from "./frame";
import { useEffect, useState } from "react";
import { stompApi } from "@/api/stompApi";
import { Role } from "@/types/role";
import { HighlightedImage } from "@/types/highlightedImage";
import { Button } from "./Button";
import { useGame } from "@/hooks/useGame";
import { GamePhase } from "@/types/gamePhase";
import { useErrorBar } from "@/context/ErrorBarContext";

type Props = {
  role: Role;
  highlightedImage: HighlightedImage;
  phase: GamePhase;
};

export const Gallery = (
  { role, highlightedImage, phase }: Props,
) => {
  const apiService = useApi();
  const gameApi = useGame();
  const { showError } = useErrorBar();
  const [imageList, setImageList] = useState<(string | null)[]>(
    Array(9).fill(null),
  );
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const handleImageClick = (index: number) => {
    if (role.playerRole === "spy") {
      setSelectedIndex((prevIndex) => (prevIndex === index ? null : index));
    }
  };

  useEffect(() => {
    const fetchImages = async () => {
      setImagesLoaded(false);
      const newImageList: (string | null)[] = Array(9).fill(null);

      await Promise.all(
        Array.from({ length: 9 }, async (_, i) => {
          try {
            const blob = await apiService.get<Blob>(
              `/image/${stompApi.getCode()}/${i}`,
            );
            newImageList[i] = URL.createObjectURL(blob);
          } catch (err) {
            console.error(`Failed to load image at index ${i}`, err);
            newImageList[i] = null;
          }
        }),
      );

      setImageList(newImageList);
      setImagesLoaded(true);
    };

    fetchImages();
  }, [apiService]);

  return (
    <Frame className="gallery">
      <div className="image-grid">
        {imageList.map((url, index) => {
          const isInnocentHighlight = imagesLoaded &&
            highlightedImage.index >= 0 &&
            role.playerRole === "innocent" &&
            highlightedImage.index === index;

          const isSpySelected = role.playerRole === "spy" &&
            selectedIndex === index;

          return (
            <div
              key={index}
              className={`image-container ${isInnocentHighlight || isSpySelected ? "highlight" : ""
                }`}
            >
              {url && (
                <>
                  <img
                    src={url}
                    alt={`Image ${index}`}
                    className="image"
                    onClick={() => handleImageClick(index)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleImageClick(index);
                    }}
                    tabIndex={0}
                  />
                  {isSpySelected && (
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <Button
                        onClick={() => {
                          if (phase == GamePhase.GAME) {
                            gameApi.sendGuess(index);
                          } else {
                            showError("Cannot guess during voting!", 2000);
                          }
                        }}
                      >
                        Guess
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </Frame>
  );
};
