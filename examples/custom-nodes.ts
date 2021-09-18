import { UndirectedGraph } from "graphology";
import erdosRenyi from "graphology-generators/random/erdos-renyi";
import randomLayout from "graphology-layout/random";
import chroma from "chroma-js";

import { getRandomName, globalize } from "./utils";
import Sigma from "../src/sigma";
import CustomNodeProgram from "./custom-nodes/custom-node-program";

const container = document.getElementById("container");

const graph = erdosRenyi(UndirectedGraph, { order: 100, probability: 0.2 });
randomLayout.assign(graph);

graph.nodes().forEach((node) => {
  graph.mergeNodeAttributes(node, {
    label: getRandomName(),
    size: Math.max(4, Math.random() * 10),
    color: chroma.random().hex(),
  });
});

graph.nodes().forEach((node) => {
  graph.mergeNodeAttributes(node, {
    label: "交易卡号:6229289312301313\n1111",
    // size: Math.max(4, Math.random() * 10),
    // size: 1,
    // color: color,
  });
});
const renderer = new Sigma(graph, container, {
  nodeProgramClasses: { circle: CustomNodeProgram },
});

globalize({ graph, renderer });
