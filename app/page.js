"use client";
import Image from "next/image";
import { useState } from "react";
import Together from "together-ai";

export default function Home() {
  const [imageData, setImageData] = useState(null);
  const [imagePrompt, setImagePrompt] = useState("");
  const [imageSize, setImageSize] = useState({ width: 1024, height: 768 });

  const handleGenerateImage = async () => {
    const together = new Together({
      apiKey:
        "537893c925c5f032ead8ceca5db50765f5b4622d2953cc594b613e63dc73ddeb",
    });

    try {
      const response = await together.images.create({
        model: "black-forest-labs/FLUX.1-schnell",
        prompt: imagePrompt || "some children play cricket in a street",
        width: imageSize.width,
        height: imageSize.height,
        steps: 4,
        n: 1,
        response_format: "b64_json",
      });

      setImageData(response.data[0].b64_json);
    } catch (error) {
      console.error("Error creating image:", error);
    }
  };

  const handleSizeChange = (e) => {
    const value = e.target.value;
    if (value === "1") {
      setImageSize({ width: 576, height: 1024 });
    } else if (value === "2" || value === "") {
      setImageSize({ width: 1024, height: 576 });
    }
  };

  return (
    <>
      <div className="h-screen flex p-2 gap-2 ">
        <div className="w-1/2 border border-white rounded-md flex flex-col justify-center items-center">
          <p className="font-bold text-4xl mb-4">Generate AI Images</p>
          <div className="flex flex-col w-[80%]">
            <textarea
              rows="4"
              cols="40"
              className="bg-gray-500 px-4 py-2"
              placeholder="Enter image prompt..."
              onChange={(e) => setImagePrompt(e.target.value)}
            ></textarea>
            <div className="flex w-full gap-4">
              <select
                name="imageSize"
                onChange={handleSizeChange}
                className="mt-4 w-1/2 text-black"
              >
                <option value="">Select Image Size</option>
                <option value="1">9:16</option>
                <option value="2">16:9</option>
              </select>
              <button
                className="border border-blue-400 py-2 px-6 mt-4 w-1/2"
                onClick={handleGenerateImage} // Trigger image generation
              >
                Generate
              </button>
            </div>
          </div>
        </div>
        <div className="w-1/2 border border-white flex justify-center items-center rounded-md">
          {imageData ? (
            <div className="flex flex-col gap-6">
              <Image
                src={`data:image/png;base64,${imageData}`}
                height={imageSize.height / 2} // Dynamically set based on size
                width={imageSize.width / 2}
                alt="Generated AI image"
                className="border border-blue-100 rounded-md"
              />
              <button
                className="border border-lime-400 py-2 px-6"
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = `data:image/png;base64,${imageData}`;
                  link.download = "generated_image.png";
                  link.click();
                }}
              >
                Download
              </button>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </>
  );
}
