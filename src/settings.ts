/**
 * Sigma.js Settings
 * =================================
 *
 * The list of settings and some handy functions.
 * @module
 */

import { NodeKey, EdgeKey } from "graphology-types";

import drawLabel from "./rendering/canvas/label";
import drawHover from "./rendering/canvas/hover";
import drawEdgeLabel from "./rendering/canvas/edge-label";
import { EdgeAttributes, NodeAttributes } from "./types";
import RectNodeProgram from "./rendering/webgl/programs/node.rect";
import CircleNodeProgram from "./rendering/webgl/programs/node.fast";
import LineEdgeProgram from "./rendering/webgl/programs/edge";
import FastEdgeProgram from "./rendering/webgl/programs/edge.fast";
import ArrowEdgeProgram from "./rendering/webgl/programs/edge.arrow";
import ArrowBezierEdgeProgram from "./rendering/webgl/programs/edge.arrow.bezier";
// import TriangleEdgeProgram from "./rendering/webgl/programs/edge.triangle";
import ClampEdgeProgram from "./rendering/webgl/programs/edge.clamped";
// import TriangleEdgeProgram from "./rendering/webgl/programs/edge.triangle";
// import BezierEdgeProgram from "./rendering/webgl/programs/edge.quadraticBezier";
import { EdgeProgramConstructor } from "./rendering/webgl/programs/common/edge";
import { NodeProgramConstructor } from "./rendering/webgl/programs/common/node";

export function validateSettings(settings: Settings): void {
  // Label grid cell
  if ( 
    settings.labelGrid &&
    settings.labelGrid.cell &&
    typeof settings.labelGrid.cell === "object" &&
    (!settings.labelGrid.cell.width || !settings.labelGrid.cell.height)
  ) {
    throw new Error("Settings: invalid `labelGrid.cell`. Expecting {width, height}.");
  }
}

/**
 * Sigma.js settings
 * =================================
 */
export interface Settings {
  // Performance
  hideEdgesOnMove: boolean;
  hideLabelsOnMove: boolean;
  renderLabels: boolean;
  renderEdgeLabels: boolean;
  // Component rendering
  defaultNodeColor: string;
  defaultNodeType: string;
  defaultEdgeColor: string;
  defaultEdgeType: string;
  labelFont: string;
  labelSize: number;
  labelWeight: string;
  edgeLabelFont: string;
  edgeLabelSize: number;
  edgeLabelWeight: string;
  // Labels
  labelGrid: {
    cell: { width: number; height: number } | null;
    renderedSizeThreshold: number;
  };
  // Reducers
  nodeReducer: null | ((node: NodeKey, data: NodeAttributes) => NodeAttributes);
  edgeReducer: null | ((edge: EdgeKey, data: EdgeAttributes) => EdgeAttributes);
  // Features
  zIndex: boolean;
  // Renderers
  labelRenderer: typeof drawLabel;
  hoverRenderer: typeof drawHover;
  edgeLabelRenderer: typeof drawEdgeLabel;

  // Program classes
  nodeProgramClasses: { [key: string]: NodeProgramConstructor };
  edgeProgramClasses: { [key: string]: EdgeProgramConstructor };
}

export const DEFAULT_SETTINGS: Settings = {
  // Performance
  hideEdgesOnMove: false,
  hideLabelsOnMove: false,
  renderLabels: true,
  renderEdgeLabels: false,

  // Component rendering
  defaultNodeColor: "#999",
  defaultNodeType: "circle",
  defaultEdgeColor: "#ccc",
  defaultEdgeType: "line",
  labelFont: "Arial",
  labelSize: 14,
  labelWeight: "normal",
  edgeLabelFont: "Arial",
  edgeLabelSize: 10,
  edgeLabelWeight: "normal",

  // Labels
  labelGrid: {
    cell: null,
    renderedSizeThreshold: -Infinity,
  },

  // Reducers
  nodeReducer: null,
  edgeReducer: null,

  // Features
  zIndex: false,

  // Renderers
  labelRenderer: drawLabel,
  hoverRenderer: drawHover, 
  edgeLabelRenderer: drawEdgeLabel,

  // Program classes
  nodeProgramClasses: {
    circle: CircleNodeProgram,
    rect:RectNodeProgram
  },
  edgeProgramClasses: {
    arrow: ArrowEdgeProgram,
    line: LineEdgeProgram,
    // triangles:TriangleEdgeProgram,
    fast:FastEdgeProgram,
    bezier:ArrowBezierEdgeProgram,
  },
};
