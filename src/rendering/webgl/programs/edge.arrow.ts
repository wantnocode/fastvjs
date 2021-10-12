/**
 * Sigma.js WebGL Renderer Edge Arrow Program
 * ===========================================
 *
 * Compound program rendering edges as an arrow from the source to the target.
 * @module
 */
import { createEdgeCompoundProgram } from "./common/edge";
import EdgeArrowHeadProgram from "./edge.arrowHead";
import EdgeClampedProgram from "./edge.fast2";  // 直线
// import EdgeClampedProgram from "./edge.clamped";  // 直线
// import EdgeClampedProgram from "./edge.quadraticBezier"; // berzier曲线

const program = createEdgeCompoundProgram([EdgeClampedProgram, EdgeArrowHeadProgram]);

export default program;

