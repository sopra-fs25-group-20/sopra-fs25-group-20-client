"use client";

import { useApi } from "@/hooks/useApi";
import { Frame } from "./frame";
import { useEffect, useState } from "react";
import { stompApi } from "@/api/stompApi";

export const Gallery = () => {
  const apiService = useApi();
  const roomCode = stompApi.getCode();
  const [imageList, setImageList] = useState<(string | null)[]>(Array(9).fill(null));

  useEffect(() => {
    const fetchImages = async () => {
      const newImageList: (string | null)[] = [...imageList];

      await Promise.all(
        Array.from({ length: 9 }, async (_, i) => {
          try {
            const blob = await apiService.get<Blob>(`/image/${roomCode}/${i}`, false);
            newImageList[i] = URL.createObjectURL(blob);
          } catch (err) {
            console.error(`Failed to load image at index ${i}`, err);
            newImageList[i] = null;
          }
        })
      );

      setImageList(newImageList);
    };

    if (roomCode) {
      fetchImages();
    }
  }, [apiService, roomCode]);

  const handleImageClick = (index: number) => {
    console.log("Image clicked:", index);
  };

  return (
    <Frame className="gallery">
      <div className="image-grid ">
        {imageList.map((url, index) => (
          <div key={index} className="image-container">
            {url && (
              <img
                src={url}
                alt={`Image ${index}`}
                className="image"
                onClick={() => handleImageClick(index)}
              />
            )}
          </div>
        ))}
      </div>
    </Frame>
  );
};
