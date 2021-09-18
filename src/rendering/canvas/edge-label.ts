/**
 * Sigma.js Canvas Renderer Edge Label Component
 * =============================================
 *
 * Function used by the canvas renderer to display a single edge's label.
 * @module
 */
import { Settings } from "../../settings";
import { EdgeAttributes, NodeAttributes, PartialButFor } from "../../types";

export default function drawEdgeLabel(
  context: CanvasRenderingContext2D,
  edgeData: PartialButFor<EdgeAttributes, "label" | "color" | "size" | "index">,
  sourceData: PartialButFor<NodeAttributes, "x" | "y">,
  targetData: PartialButFor<NodeAttributes, "x" | "y">,
  settings: Settings,
): void {
  const size = settings.edgeLabelSize,
    font = settings.edgeLabelFont,
    weight = settings.edgeLabelWeight,
    label = edgeData.label;

  context.fillStyle = edgeData.color;
  context.font = `${weight} ${size}px ${font}`;
  const textWidth = context.measureText(label).width;
  // console.log(edgeData)
  if(edgeData.index == 0){
    var cx = (sourceData.x + targetData.x) / 2;
    var cy = (sourceData.y + targetData.y) / 2;
  }else{

    if(edgeData.index % 2 == 0){
      var cx = (sourceData.x + targetData.x) / 2 + (targetData.y - sourceData.y) / (edgeData.index + 9);
      var cy = (sourceData.y + targetData.y) / 2 + (sourceData.x - targetData.x) / (edgeData.index + 9);
    }else{
      var cx = (sourceData.x + targetData.x) / 2 + (targetData.y - sourceData.y) / -(edgeData.index + 9);
      var cy = (sourceData.y + targetData.y) / 2 + (sourceData.x - targetData.x) / -(edgeData.index + 9);
    }
  }
  // array[i++] = (x1 + x2) / 2 + (y2 - y1) / (data.index + 4);
    // array[i++] = (y1 + y2) / 2 + (x1 - x2) / (data.index + 4);
  const dx = targetData.x - sourceData.x;
  const dy = targetData.y - sourceData.y;
  const d = Math.sqrt(dx * dx + dy * dy);

  let angle;
  if (dx > 0) {
    if (dy > 0) angle = Math.acos(dx / d);
    else angle = Math.asin(dy / d);
  } else {
    if (dy > 0) angle = Math.acos(dx / d) + Math.PI;
    else angle = Math.asin(dx / d) + Math.PI / 2;
  }

  context.save();
  context.translate(cx, cy);
  // context.translate(
  //           Math.abs((sourceData.x + targetData.x) / 2 + (targetData.y - sourceData.y) / 4), 
  //           Math.abs((sourceData.y + targetData.y) / 2 + (sourceData.x - targetData.x) / 4)
  // );
  context.rotate(angle);

  context.fillText(label, -textWidth / 2, edgeData.size + size);

  context.restore();
}
