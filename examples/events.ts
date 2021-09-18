import { UndirectedGraph } from "graphology";
import erdosRenyi from "graphology-generators/random/erdos-renyi";
import randomLayout from "graphology-layout/random";
import chroma from "chroma-js";
import { EdgeKey, NodeKey } from "graphology-types";

import Sigma from "../src/sigma";
import { getRandomName, globalize } from "./utils";
import { EdgeAttributes, NodeAttributes } from "../src/types";

const container = document.getElementById("container");

const graph = erdosRenyi.sparse(UndirectedGraph, {
  order: 2,
  probability: 1,
});
randomLayout.assign(graph);

graph.nodes().forEach((node) => {
  graph.mergeNodeAttributes(node, {
    label: getRandomName(),
    size: Math.max(4, Math.random() * 10),
    color: chroma.random().hex(),
    zIndex: 0,
  });
});

graph.edges().forEach((edge) =>
  graph.mergeEdgeAttributes(edge, {
    color: "#ccc",
    zIndex: 0,
    size:1
  }),
);

let highlighedNodes = new Set();
let highlighedEdges = new Set();

let selectedEdges = new Set();

const nodeReducer = (node: NodeKey, data: NodeAttributes) => {
  if (highlighedNodes.has(node)) return { ...data, color: "#f00", zIndex: 1 };

  return data;
};
 
const edgeReducer = (edge: EdgeKey, data: EdgeAttributes) => {
  if (highlighedEdges.has(edge)) return { ...data, color: "#f00", zIndex: 1 };
  if (selectedEdges.has(edge)) return { ...data, color: "#000", zIndex: 1 };
  return data;
};

const renderer = new Sigma(graph, container, {
  nodeReducer,
  edgeReducer,
  zIndex: true,
  defaultEdgeType: "arrow",
});

renderer.on("clickNode", ({ node, captor, event }) => {
  console.log("Clicking:", node, captor, event);
});
renderer.on("rightClickNode", ({ node, captor, event }) => {
  console.log("Right Clicking:", node, captor, event);
  event.preventDefault();
});
/*
@events点击是否同线
*/
function onSegment (p1, p2, q){
    // if x || y 为0 需要考虑
    let k1:any = ((p2.y - p1.y)/(p2.x-p1.x)).toFixed(3)
    let k2:any = ((q.y-p1.y)/(q.x-p1.x)).toFixed(3)
    let error:any = Math.abs(k2 * 1 - k1 *1)
    // console.log(error)
    if (error - 0.1 <= Number.EPSILON) {
      return true
    } else {
      return false
    }
}
renderer.on("downStage", ({ event }) => {
  console.log("Downing the stage.", event);
});
renderer.on("clickStage", ({ event }) => {
  selectedEdges.clear();
  renderer.refresh();
  // console.log(selectedEdges)
  graph.edges().forEach(edge=>{
     let from = graph.source(edge);
     let to = graph.target(edge);
    
     let p = renderer.graphToViewport({x:graph.getNodeAttributes(from).x,y:graph.getNodeAttributes(from).y});
     let p1 = renderer.graphToViewport({x:graph.getNodeAttributes(to).x,y:graph.getNodeAttributes(to).y})
     var p2 = event;
     var isOnLink = onSegment(p,p1,p2);
     if(isOnLink){
        selectedEdges.add(edge);
        // console.log(selectedEdges)
        renderer.refresh();
     }
  })

  // console.log("Clicking the stage.", event);
});
renderer.on("rightClickStage", ({ event }) => {
  console.log("Right Clicking the stage.", event);
});

renderer.on("enterNode", ({ node }) => {
  console.log("Entering: ", node);
  highlighedNodes = new Set(graph.neighbors(node));
  highlighedNodes.add(node);

  highlighedEdges = new Set(graph.edges(node));

  renderer.refresh();
});

renderer.on("leaveNode", ({ node }) => {
  console.log("Leaving:", node);

  highlighedNodes.clear();
  highlighedEdges.clear();

  renderer.refresh();
});

globalize({ graph, renderer });
