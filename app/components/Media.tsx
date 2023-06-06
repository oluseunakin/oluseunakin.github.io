import { useEffect, useRef, useState } from "react";

export const Media = (props: { sources: string[] }) => {
  const { sources } = props;
  const [media, setMedia] = useState<HTMLDivElement[]>();
  const mediaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const media = Array.from(
      mediaRef.current!.querySelectorAll<HTMLDivElement>(".dpics")
    );
    setMedia(media);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (media) {
        const length = media.length;
        let nm = Array<HTMLDivElement>();
        media.forEach((md, i) => {
          let oldX = md.style.translate;
          oldX = oldX ? oldX.slice(0, oldX.indexOf("p")) : "0";
          const x = Number(oldX);
          const clientWidth = md.clientWidth;
          if (i === length - 1) {
            md.style.translate = `${-i * clientWidth + x - 20}px`;
            i = 0;
          } else {
            md.style.translate = `${clientWidth + x + 10}px`;
            i++;
          }
          nm[i] = md;
        });
        setMedia(nm);
      }
    }, 7000);
    return () => {
      clearTimeout(timeout);
    };
  }, [media]);
  return (
    <div ref={mediaRef} className="pics">
      {sources.map((file: string, i: number) => (
        <div key={i} className="dpics">
          <img src={file} alt="Images from my project" />
        </div>
      ))}
    </div>
  );
};
