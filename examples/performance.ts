import { UndirectedGraph } from "graphology";
import erdosRenyi from "graphology-generators/random/erdos-renyi";
import randomLayout from "graphology-layout/random";
import chroma from "chroma-js";

import { getRandomName, globalize } from "./utils";
import Sigma from "../src/sigma";

const container = document.getElementById("container");

const graph = erdosRenyi.sparse(UndirectedGraph, {
  order: 100 * 1000,
  probability: 0.000001,
});
randomLayout.assign(graph);

graph.nodes().forEach((node) => {
  graph.mergeNodeAttributes(node, {
    label: getRandomName(),
    size: Math.max(4, Math.random() * 10),
    color: chroma.random().hex(),
  });
});

graph.edges().forEach((edge) => {
  graph.setEdgeAttribute(edge, "color", "#ccc");
});

const renderer = new Sigma(graph, container, {
  renderLabels: true,
  defaultEdgeType: "arrow",
});

globalize({ graph, renderer });
