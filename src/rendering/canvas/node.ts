/**
 * Sigma.js Canvas Renderer Node Component
 * ========================================
 *
 * Function used by the canvas renderer to display a single node.
 * @module
 */
import { NodeAttributes, PartialButFor } from "../../types";


const PI_TIMES_2 = Math.PI * 2;

export default function drawNode(
  context: CanvasRenderingContext2D,
  data: PartialButFor<NodeAttributes, "x" | "y" | "size" | "color" >,
): void {
  context.fillStyle = data.color;
  context.beginPath();
  context.arc(data.x, data.y, data.size, 0, PI_TIMES_2, true);
  // console.log(data)
  context.closePath();
  context.fill();
  // if(data.key.split("_")[1] == "account"){
  // 	context.drawImage(img,  data.x - data.size/2 , data.y - data.size/2 ,data.size ,data.size )
  // }else{
  // 	context.drawImage(img_ip,  data.x - data.size/2 , data.y - data.size/2 ,data.size ,data.size )
  // }
  if(data.icon != undefined){
    let img = new Image();
    img.src = "./img/icon/" + data.icon + ".svg";
    context.drawImage(img,  data.x - data.size/2 , data.y - data.size/2 ,data.size ,data.size )
  }

}
  