"use client";

import { useEffect, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { useApi } from "@/hooks/useApi";

export default function ImagePage() {
  const apiService = useApi();
  const [darkMode, setDarkMode] = useState(false);
  const [imageList, setImageList] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const blobs = await Promise.all(
          Array.from({ length: 9 }, () => apiService.get<Blob>("/image", false))
        );
        const urls = blobs.map((blob) => URL.createObjectURL(blob as any));
        setImageList(urls);
      } catch (err) {
        console.error("Failed to load images", err);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [apiService]);

  const handleImageError = async (index: number) => {
    try {
      const newBlob = await apiService.get<Blob>("/image", false);
      const newUrl = URL.createObjectURL(newBlob as any);
      setImageList((prev) => {
        const updated = [...prev];
        updated[index] = newUrl;
        return updated;
      });
    } catch (e) {
      console.error("Failed to reload image", e);
    }
  };

  if (loading) {
    return <div style={{ textAlign: "center", marginTop: "2rem" }}>Loading images...</div>;
  }

  return (
    <div className="page-wrapper">
      <AppHeader onToggleTheme={() => setDarkMode((prev) => !prev)} />
      <div className="game-layout-container">
        <div className="left-panel" style={{ flex: 1 }}></div>
        <div className="right-panel">
          <div className="image-gallery">
            <div className="image-grid">
              {imageList.map((src, index) => (
                <div
                  key={index}
                  className={`image-container ${selectedIndex === index ? "highlighted" : ""}`}
                  onClick={() => setSelectedIndex(index)}
                >
                  <img
                    src={src}
                    alt={`Street view ${index + 1}`}
                    className="image"
                    onError={() => handleImageError(index)}
                    onLoad={(e) => {
                      const img = e.currentTarget;
                      if (img.naturalWidth <= 128 || img.naturalHeight <= 128) {
                        handleImageError(index);
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
