// import { UndirectedGraph } from "graphology";
import { MultiGraph } from "graphology"; 
import erdosRenyi from "graphology-generators/random/erdos-renyi";
import randomLayout from "graphology-layout/random";
import chroma from "chroma-js";

import { getRandomName, globalize } from "./utils";
import Sigma from "../src/sigma";

const container = document.getElementById("container");

// const graph = erdosRenyi(UndirectedGraph, { order:2, probability: 1});
// randomLayout.assign(graph); 
const graph = new MultiGraph();
graph.addNode(1,{x:20,y:0,label:"1111111"});
graph.addNode(2,{x:200,y:50,label:"2222222"});
// graph.addNode(3,{x:-100,y:50});
// graph.addNode(4,{x:-200,y:200});
graph.addEdge(1,2);
// graph.addEdge(1,2);
// graph.addEdge(1,2);
// graph.addEdge(1,2);
// graph.addEdge(1,2);
// graph.addEdge(1,2);
// graph.addEdge(1,2);
// graph.addEdge(1,2);
// graph.addEdge(1,2);

// graph.addNode(1,{x:0,y:0});
// let data = graph.getNodeAttributes(1)
// console.log(data)
graph.nodes().forEach((node) => {
  graph.mergeNodeAttributes(node, {
    // label: getRandomName(),
    label:"11111\n22222",
    // index:1,
    size: Math.max(4, Math.random() * 10),
    color: chroma.random().hex(),
  });
});
graph.edges().forEach((edge,index)=>{
  // console.log(edge)
	graph.mergeEdgeAttributes(edge, {
	    // type: 'bezier',
      key:index, 
      index:index,
      color:"red",
      label:edge,
	    
	});
})

// type: 'curve'
// const renderer = new Sigma(graph, container);

const renderer = new Sigma(graph, container,{
  defaultEdgeType: "fast",
  // defaultEdgeColor: "#888",
  // nodeReducer,
  // edgeReducer,
  renderEdgeLabels: true,
  // renderNodeLabels: false,
});
globalize({ graph, renderer });
