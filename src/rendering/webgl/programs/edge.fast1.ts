/**
 * Sigma.js WebGL Renderer Fast Edge Program
 * ==========================================
 *
 * Program rendering edges using GL_LINES which is presumably very fast but
 * won't render thickness correctly on some GPUs and has some quirks.
 * @module
 */
import { EdgeAttributes, NodeAttributes } from "../../../types";
import { floatColor } from "../../../utils";
import vertexShaderSource from "../shaders/edge.fast.vert.glsl";
import fragmentShaderSource from "../shaders/edge.fast.frag.glsl";
import { AbstractEdgeProgram, RenderEdgeParams } from "./common/edge";

// const POINTS = 2,
// const POINTS= 4,
const POINTS = 20,
  ATTRIBUTES = 3;

export default class EdgeFastProgram extends AbstractEdgeProgram {
  positionLocation: GLint;
  colorLocation: GLint;
  matrixLocation: WebGLUniformLocation;
  resolutionLocation: WebGLUniformLocation;

  constructor(gl: WebGLRenderingContext) {
    super(gl, vertexShaderSource, fragmentShaderSource, POINTS, ATTRIBUTES);

    // Locations:
    this.positionLocation = gl.getAttribLocation(this.program, "a_position");
    this.colorLocation = gl.getAttribLocation(this.program, "a_color");

    // Uniform locations:
    const matrixLocation = gl.getUniformLocation(this.program, "u_matrix");
    if (matrixLocation === null) throw new Error("EdgeFastProgram: error while getting matrixLocation");
    this.matrixLocation = matrixLocation;

    const resolutionLocation = gl.getUniformLocation(this.program, "u_resolution");
    if (resolutionLocation === null) throw new Error("EdgeFastProgram: error while getting resolutionLocation");
    this.resolutionLocation = resolutionLocation;

    this.bind();
  }

  bind(): void {
    const gl = this.gl;

    // Bindings
    gl.enableVertexAttribArray(this.positionLocation);
    gl.enableVertexAttribArray(this.colorLocation);
    // console.log(this.attributes)
    // console.log(Float32Array.BYTES_PER_ELEMENT)
    gl.vertexAttribPointer(
      this.positionLocation,
      2,
      gl.FLOAT,
      false,
      this.attributes * Float32Array.BYTES_PER_ELEMENT,
      0,
    );
    // 最后为每次字节偏移量 8 2个单位
    gl.vertexAttribPointer(this.colorLocation, 1, gl.FLOAT, false, this.attributes * Float32Array.BYTES_PER_ELEMENT, 8);
  }

  computeIndices(): void {
    //nothing to do
  }

  process(
    sourceData: NodeAttributes,
    targetData: NodeAttributes,
    data: EdgeAttributes,
    hidden: boolean,
    offset: number,
  ): void {
    // this.array = new Float32Array(60);
    const array = this.array;
    let i = 0;
    // console.log(i + POINTS * ATTRIBUTES)
    // console.log(array)
    if (hidden) {
      for (let l = i + POINTS * ATTRIBUTES; i < l; i++) array[i] = 0;
    }

    const x1 = sourceData.x,
      y1 = sourceData.y,
      x2 = targetData.x,
      y2 = targetData.y,
      color = floatColor(data.color);
    // console.log(data.color)

    i = POINTS * ATTRIBUTES * offset;
    if(i > 0){
      i = i + (POINTS  -1)  * ATTRIBUTES * 2;
    }
    

    // console.log(array)
    // array = bezierPoint;
    array[i++] = x1;
    array[i++] = y1;
    array[i++] = color;
    // for(let i = 0; i < bezierPoint.length; i++){

    // }
//     function onebsr(t, a1, a2) {
//     return a1 + (a2 - a1) * t;
// }

    // if(//只有一条){
    //   array[i++] = x1;
    //   array[i++] = y1;
    //   array[i++] = color;

    //   array[i++] = x1;
    //   array[i++] = y1;
    //   array[i++] = color;
    // }else{

    // }
    // 中间节点  多条边
    // console.log(x1,x2,y1,y2)
    array[i++] = (x1 + x2) / 2 + (y2 - y1) / (offset + 4);
    array[i++] = (y1 + y2) / 2 + (x1 - x2) / (offset + 4);
    array[i++] = color;
    // 中间起点
    array[i++] = (x1 + x2) / 2 + (y2 - y1) / (offset + 4);
    array[i++] = (y1 + y2) / 2 + (x1 - x2) / (offset + 4);
    array[i++] = color;

    // Second point
    array[i++] = x2;
    array[i++] = y2;
    array[i] = color;

  }

  render(params: RenderEdgeParams): void {
    const gl = this.gl;
    const program = this.program;
    // console.log(this.array.length / ATTRIBUTES)
    gl.useProgram(program);
    // gl.uniform2f(this.resolutionLocation, params.width, params.height);
    gl.uniformMatrix3fv(this.matrixLocation, false, params.matrix);
    gl.drawArrays(gl.LINES, 0, this.array.length / ATTRIBUTES);
    // gl.drawArrays(gl.LINE_STRIP, 0, this.array.length / ATTRIBUTES);  
  }
}
