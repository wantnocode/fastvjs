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
const POINTS = 60,
  ATTRIBUTES = 3;

export default class EdgeFastProgram extends AbstractEdgeProgram {
  positionLocation: GLint;
  colorLocation: GLint;
  matrixLocation: WebGLUniformLocation;
  // resolutionLocation: WebGLUniformLocation;

  constructor(gl: WebGLRenderingContext) {
    super(gl, vertexShaderSource, fragmentShaderSource, POINTS, ATTRIBUTES);

    // Locations:
    this.positionLocation = gl.getAttribLocation(this.program, "a_position");
    this.colorLocation = gl.getAttribLocation(this.program, "a_color");

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
    // console.log(i)
    // First point
  // console.log(offset)
    /**
     * 生成四阶贝塞尔曲线定点数据
     * @param p0 {Object}   起始点  { x : number, y : number, z : number }
     * @param p1 {Object}   控制点1 { x : number, y : number, z : number }
     * @param p2 {Object}   控制点2 { x : number, y : number, z : number }
     * @param p3 {Object}   终止点  { x : number, y : number, z : number }
     * @param num {Number}  线条精度
     * @param tick {Number} 绘制系数
     * @returns {Array}
     */
    function create3DBezier(p0:any, p1:any, p2:any, p3:any, num:any, tick:any) {
      let pointMum = num || 100;
      let _tick = tick || 1.0;
      let t = _tick / (pointMum - 1);
      let points:any = [];
      for (let i = 0; i < pointMum; i++) {
        let point = getBezierNowPoint(p0, p1, p2, p3, i, t);

        if(i > 1  && i < pointMum && i % 2 === 0){
          // debugger;
          // 首尾相连问题 添加 %3 与后面相连接的3个点 x,y,color
          let index:any = points.length;
          points.push(points[index - 3]);
          points.push(points[index - 2]);
          points.push(points[index - 1]);
          points.push(point.x);
          points.push(point.y);
          points.push(color);
          // points.push(point.x);
          // points.push(point.y);
          // points.push(color);
        }
        points.push(point.x);
        points.push(point.y);

        points.push(color);


      }
      return points;
    }

    /**
     * 四阶贝塞尔曲线公式
     * @param p0
     * @param p1
     * @param p2
     * @param p3
     * @param t
     * @returns {*}
     * @constructor
     */
    function Bezier(p0:any, p1:any, p2:any, p3:any, t:any) {
      let P0, P1, P2, P3;
      P0 = p0 * (Math.pow((1 - t), 1));
      P1 = 1 * p1 * t * (Math.pow((1 - t), 2));
      P2 = 1 * p2 * Math.pow(t, 2) * (1 - t);
      P3 = p3 * Math.pow(t, 2);
      // console.log(P0 + P1 + P2 + P3)
      // return P0 + P1 + P3;
      return P0 + P1 + P2 + P3;
    }

    /**
     * 获取四阶贝塞尔曲线中指定位置的点坐标
     * @param p0
     * @param p1
     * @param p2
     * @param p3
     * @param num
     * @param tick
     * @returns {{x, y, z}}
     */
    function getBezierNowPoint(p0:any, p1:any, p2:any, p3:any, num:any, tick:any) {
      return {
        x : Bezier(p0.x, p1.x, p2.x, p3.x, num * tick),
        y : Bezier(p0.y, p1.y, p2.y, p3.y, num * tick),
        z : Bezier(p0.z, p1.z, p2.z, p3.z, num * tick),
      }
    }
    // console.log(data,x1,y1)
    let bezierPoint = create3DBezier(
      { x : x1,  y : y1,   z : 0 },    // p0
      // { x : (x1 + x2) / 4 + (y2 - y1) / (offset + 2), y : (y1 + y2) / 1.4 + (x1 - x2) / (offset + 4), z : 0 },    // p1
      // { x : (x1 + x2) / 2 + (y2 - y1) / (offset + 4), y : (y1 + y2) / 1.8 + (x1 - x2) / (offset + 4), z : 0 },    // p1

      { x : (x2 + x1) / 2, y : y1, z : 0 },    // p1
      { x : (x1 + x2) / 2 , y :y2, z : 0 },    // p1
      // {x:data.p0.x,y:data.p0.y},
      // {x:data.p1.x,y:data.p1.y},
      // "",
      { x : x2,   y : y2,   z : 0 },    // p3
      POINTS / 2, //n - 1 * 2 + n
      1.0    );
    // bezierPoint.push(bezierPoint[bezierPoint.length-1]);
    // console.log(bezierPoint);
    for(let j = 0; j < bezierPoint.length; j ++){

      array[i++] = bezierPoint[j];
      // array[i++] = bezierPoint[j];
      // i++;
    }
    // console.log(array)
      // array[i++] = bezierPoint[i++];

    // console.log(i)
    // array = bezierPoint;
    // array[i++] = x1;
    // array[i++] = y1;
    // array[i++] = color;
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
    // array[i++] = (x1 + x2) / 2 + (y2 - y1) / (offset + 4);
    // array[i++] = (y1 + y2) / 2 + (x1 - x2) / (offset + 4);
    // array[i++] = color;
    // // 中间起点
    // array[i++] = (x1 + x2) / 2 + (y2 - y1) / (offset + 4);
    // array[i++] = (y1 + y2) / 2 + (x1 - x2) / (offset + 4);
    // array[i++] = color;

    // // Second point
    // array[i++] = x2;
    // array[i++] = y2;
    // array[i] = color;

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
