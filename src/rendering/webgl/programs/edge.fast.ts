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

const POINTS = 4,
  ATTRIBUTES = 3;

export default class EdgeFastProgram extends AbstractEdgeProgram {
  positionLocation: GLint;
  colorLocation: GLint;
  matrixLocation: WebGLUniformLocation;
  thicknessLocation: GLint;
  // resolutionLocation: WebGLUniformLocation;

  constructor(gl: WebGLRenderingContext) {
    super(gl, vertexShaderSource, fragmentShaderSource, POINTS, ATTRIBUTES);

    // Locations:
    this.positionLocation = gl.getAttribLocation(this.program, "a_position");
    this.colorLocation = gl.getAttribLocation(this.program, "a_color");
    this.thicknessLocation = gl.getAttribLocation(this.program, "a_thickness");

    // Uniform locations:
    const matrixLocation = gl.getUniformLocation(this.program, "u_matrix");
    if (matrixLocation === null) throw new Error("EdgeFastProgram: error while getting matrixLocation");
    this.matrixLocation = matrixLocation;

    // const resolutionLocation = gl.getUniformLocation(this.program, "u_resolution");
    // if (resolutionLocation === null) throw new Error("EdgeFastProgram: error while getting resolutionLocation");
    // this.resolutionLocation = resolutionLocation;

    this.bind();
  }

  bind(): void {
    const gl = this.gl;

    // Bindings
    gl.enableVertexAttribArray(this.positionLocation);
    gl.enableVertexAttribArray(this.colorLocation);
    gl.enableVertexAttribArray(this.thicknessLocation);

    gl.vertexAttribPointer(
      this.positionLocation,
      2,
      gl.FLOAT,
      false,
      this.attributes * Float32Array.BYTES_PER_ELEMENT,
      0,
    );
    gl.vertexAttribPointer(
      this.colorLocation,
      4,
      gl.UNSIGNED_BYTE,
      true,
      ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT,
      8,
    );
    gl.vertexAttribPointer(this.thicknessLocation, 1, gl.FLOAT, false, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 16);
    //gl.vertexAttribPointer(this.colorLocation, 1, gl.FLOAT, false, this.attributes * Float32Array.BYTES_PER_ELEMENT, 8);
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
    const array = this.array;

    let i = 0;
    if (hidden) {
      for (let l = i + POINTS * ATTRIBUTES; i < l; i++) array[i] = 0;
    }
   // console.log(data)
    const x1 = sourceData.x,
      y1 = sourceData.y,
      x2 = targetData.x,
      y2 = targetData.y,
      color = floatColor(data.color);
    i = POINTS * ATTRIBUTES * offset;

    // First point
    array[i++] = x1;
    array[i++] = y1;
    array[i++] = color;
    // console.log(data.index)

    if(data.index == 0){
      array[i++] = x2;
      array[i++] = y2;
      array[i++] = color;

     
      // middle
      array[i++] = x1;
      array[i++] = y1;
      array[i++] = color;
    }else{
        // array[i++] = (x1 + x2) / 10 + (y2 - y1) / (data.index + 2);
        // array[i++] = (y1 + y2) / 2 + (x1 - x2) / (data.index + 2);
        // array[i++] = color;

        // array[i++] = (x1 + x2) / 10 + (y2 - y1) / (data.index + 2);
        // array[i++] = (y1 + y2) / 2 + (x1 - x2) / (data.index + 2);
        // array[i++] = color;

        // array[i++] = (x1 + x2) / 10 + (y2 - y1) / (data.index + 2);
        // array[i++] = (y1 + y2) / 10 + (x1 - x2) / (data.index + 2);
        // array[i++] = color;

        // array[i++] = (x1 + x2) / 10 + (y2 - y1) / (data.index + 2);
        // array[i++] = (y1 + y2) / 10 + (x1 - x2) / (data.index + 2);
        // array[i++] = color;

       

      if(data.index % 2 == 0){
        array[i++] = (x1 + x2) / 2 + (y2 - y1) / (data.index + 8);
        array[i++] = (y1 + y2) / 2 + (x1 - x2) / (data.index + 8);
        array[i++] = color;
        // middle
        array[i++] = (x1 + x2) / 2 + (y2 - y1) / (data.index + 8);
        array[i++] = (y1 + y2) / 2 + (x1 - x2) / (data.index + 8);
        array[i++] = color;
      }else{
        array[i++] = (x1 + x2) / 2 + (y2 - y1) / -(data.index + 8);
        array[i++] = (y1 + y2) / 2 + (x1 - x2) / -(data.index + 8);
        array[i++] = color;
        // middle
        array[i++] = (x1 + x2) / 2 + (y2 - y1) / -(data.index + 8);
        array[i++] = (y1 + y2) / 2 + (x1 - x2) / -(data.index + 8);
        array[i++] = color;
      }
    }


    // Second point
    array[i++] = x2;
    array[i++] = y2;
    array[i] = color;
  }

  render(params: RenderEdgeParams): void {
    const gl = this.gl;
    const program = this.program;

    gl.useProgram(program);
    // gl.uniform2f(this.resolutionLocation, params.width, params.height);
    gl.uniformMatrix3fv(this.matrixLocation, false, params.matrix);
    gl.drawArrays(gl.LINES, 0, this.array.length / ATTRIBUTES);
  }
}