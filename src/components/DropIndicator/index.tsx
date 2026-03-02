import type { Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import styles from "./DropIndicator.module.css";

interface DropIndicatorProps {
  edge: Edge;
  gap?: string;
}

export const DropIndicator = ({ edge, gap = "0px" }: DropIndicatorProps) => {
  const isHorizontal = edge === "left" || edge === "right";
  const distanceFromEdge = `calc(-1px - ${gap} / 2)`;

  const style: React.CSSProperties = isHorizontal
    ? {
        top: 0,
        bottom: 0,
        width: "2px",
        ...(edge === "left"
          ? { left: distanceFromEdge }
          : { right: distanceFromEdge }),
      }
    : {
        left: 0,
        right: 0,
        height: "2px",
        ...(edge === "top"
          ? { top: distanceFromEdge }
          : { bottom: distanceFromEdge }),
      };

  return <div className={styles.indicator} style={style} />;
}
