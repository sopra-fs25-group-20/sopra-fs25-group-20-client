"use client";

import { useApi } from "@/hooks/useApi";
import { Frame } from "./frame";
import { useEffect, useState } from "react";
import { stompApi } from "@/api/stompApi";
import { Role } from "@/types/role";
import { HighlightedImage } from "@/types/highlightedImage";

type Props = {
  role: Role;
  highlightedImage: HighlightedImage;
  selectedIndex: number | null;
  onSelectImage: (index: number) => void;
};

export const Gallery = (
  { role, highlightedImage, selectedIndex, onSelectImage }: Props,
) => {
  const apiService = useApi();
  const [imageList, setImageList] = useState<(string | null)[]>(
    Array(9).fill(null),
  );

  const handleImageClick = (index: number) => {
    onSelectImage(index);
  };

  useEffect(() => {
    /**
     * Fetch all 9 images and store them in a list.
     */
    const fetchImages = async () => {
      const newImageList: (string | null)[] = Array(9).fill(null);

      await Promise.all(
        Array.from({ length: 9 }, async (_, i) => {
          try {
            const blob = await apiService.get<Blob>(
              `/image/${stompApi.getCode()}/${i}`,
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

    fetchImages();
  }, [apiService]);

  return (
    <Frame className="gallery">
      <div className="image-grid ">
        {imageList.map((url, index) => (
          <div
            key={index}
            className={`image-container ${
              highlightedImage.index >= 0 && role.playerRole === "innocent" &&
                highlightedImage.index === index
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
