import { MultiGraph } from "graphology";
import circularLayout from "graphology-layout/circular";
import randomLayout from "graphology-layout/random";
import { scaleLinear } from "d3-scale";
import { extent } from "simple-statistics";

import Sigma from "../src/sigma";
import { animateNodes } from "../src/utils/animate";
import { PlainObject } from "../src/types";

// import miserables from "./resources/les-json";

import {nodes,links} from "../data"

const graph = new MultiGraph();

// Prepare data:
const nodeSizeExtent = extent(nodes.map((n) => n.size));
const xExtent = extent(nodes.map((n) => n.x));
const yExtent = extent(nodes.map((n) => n.y));

const nodeSizeScale = scaleLinear().domain(nodeSizeExtent).range([3, 15]);
const xScale = scaleLinear().domain(xExtent).range([0, 1]);
const yScale = scaleLinear().domain(yExtent).range([0, 1]);

nodes.forEach((node) => {
  node.size = 2;
  // node.color = "blue";
  node.x = xScale(node.x) as number;
  node.y = yScale(node.y) as number;
});

nodes.forEach((node, i) => {
  // node.color = "red";
  graph.addNode(node.key, {color:"#0366D6",x:node.x,y:node.y});
});

links.forEach((edge) => {
  graph.addEdge(edge.from, edge.to, { color: "#ccc" });
});

const container = document.getElementById("container");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const renderer = new Sigma(graph, container);

const initial: PlainObject<{ x: number; y: number }> = {};

nodes.forEach((node: { size: number; x: number; y: number }, i) => {
  initial[i] = {
    x: node.x,
    y: node.y,
  };
});

const random_ = randomLayout(graph);

// const circle = circularLayout(graph);

let state = false;
// let state = 0;
function loop() {
  const  l = state ? initial : random_;
  // var l;
  // if(state == 0){
      // l = initial;
     // state++;
  // }else if(state == 1){
      // l = random_;
     // state++;
  // }else if(state == 2){
     // l = circle;
    // state = 0;
  // }

  animateNodes(graph, l, { duration: 1500 }, () => {
    state = !state;
    loop();
  });
}

loop();
