/**
 * Sigma.js Canvas Renderer Hover Component
 * =========================================
 *
 * Function used by the canvas renderer to display a single node's hovered
 * state.
 * @module
 */
import { Settings } from "../../settings";
import { NodeAttributes, PartialButFor } from "../../types";
import drawNode from "./node";
import drawLabel from "./label";

export default function drawHover(
  context: CanvasRenderingContext2D,
  data: PartialButFor<NodeAttributes, "x" | "y" | "size" | "label" | "color" | "icon">,
  settings: Settings,
): void {
  const size = settings.labelSize,
    font = settings.labelFont,
    weight = settings.labelWeight;
 
  context.font = `${weight} ${size}px ${font}`;

  if(data.label == "")return;
  // Then we draw the label background
  context.beginPath();
  context.fillStyle = "#fff";
  context.shadowOffsetX = 0;
  context.shadowOffsetY = 0;
  context.shadowBlur = 8;
  context.shadowColor = "#000";

  // const textWidth = context.measureText(data.label).width;

  // const x = Math.round(data.x - size / 2 - 2),
  //   y = Math.round(data.y - size / 2 - 2),
  //   w = Math.round(textWidth + size / 2 + data.size + 9),
  //   h = Math.round(size + 4),
  //   e = Math.round(size / 2 + 2);

  // context.moveTo(x, y + e);
  // context.moveTo(x, y + e);
  // context.arcTo(x, y, x + e, y, e);
  // context.lineTo(x + w, y);
  // context.lineTo(x + w, y + h);
  // context.lineTo(x + e, y + h);
  // context.arcTo(x, y + h, x, y + h - e, e);
  // context.lineTo(x, y + e);

  // context.closePath();
  // context.fill();
  const MARGIN = 3;
  
  const textWidth = context.measureText(data.label).width,
      boxWidth = Math.round(textWidth + 9),
      boxHeight = Math.round(size + 2 * MARGIN),
      radious = Math.max(data.size, size / 2) + MARGIN;

    const angleRadian = Math.asin(boxHeight / 2 / radious);
    const xDeltaCoord = Math.sqrt(Math.abs(Math.pow(radious, 2) - Math.pow(boxHeight / 2, 2)));

    context.beginPath();
    // context.moveTo(data.x + xDeltaCoord, data.y + boxHeight / 2);
    // context.lineTo(data.x + radious + boxWidth, data.y + boxHeight / 2);
    // context.lineTo(data.x + radious + boxWidth, data.y - boxHeight / 2);
    // context.lineTo(data.x + xDeltaCoord, data.y - boxHeight / 2);
    // context.arc(data.x, data.y, radious, angleRadian, -angleRadian);
    context.arc(data.x, data.y, radious, 0, Math.PI * 2);
    context.closePath();
    context.fill();

  context.shadowOffsetX = 0;
  context.shadowOffsetY = 0;
  context.shadowBlur = 0;

  // Then we need to draw the node
  
  
  drawNode(context, data);

  // And finally we draw the label
  drawLabel(context, data, settings);
}
