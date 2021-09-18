/**
 * Sigma.js Canvas Renderer Label Component
 * =========================================
 *
 * Function used by the canvas renderer to display a single node's label.
 * @module
 */
import { Settings } from "../../settings";
import { NodeAttributes, PartialButFor } from "../../types";

// var img = new Image();   // 创建img元素
// img.src = "https://sf6-ttcdn-tos.pstatp.com/img/user-avatar/b67f2c7290f5cd5dac9d322b8af250ab~300x300.image";
// img.src = "http://localhost:8000/account.svg";

export default function drawLabel(
  context: CanvasRenderingContext2D,
  data: PartialButFor<NodeAttributes, "x" | "y" | "size" | "label" | "color" | "icon" >,
  settings: Settings,
  // icon:any
): void {
  const size = settings.labelSize,
    font = settings.labelFont,
    weight = settings.labelWeight;
    context.fillStyle = "#000";
    context.font = `${weight} ${size}px ${font}`;

  // if(data.sizeRatio < 0.3){
      // 左侧
      // context.fillText(data.label, data.x + data.size + 3, data.y + size / 3);
      // 下
      // context.fillText(data.label, data.x, data.y + (size / 3 / data.sizeRatio));

      context.fillText(data.label, data.x - data.label.length / 2 - data.size, data.y + data.size + 12);

      if(data.icon != undefined){
        let img = new Image();
        img.src = "./img/icon/" + data.icon + ".svg";
        context.drawImage(img,  data.x - data.size/2 , data.y - data.size/2 ,data.size ,data.size)
      }
  // }
}
