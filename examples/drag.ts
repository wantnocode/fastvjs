import Graph from "graphology";
// import gexf from "graphology-gexf/browser";
// import { NodeKey } from "graphology-types";

import { MultiGraph } from "graphology"; 
import { EdgeKey, NodeKey } from "graphology-types";
// import erdosRenyi from "graphology-generators/random/erdos-renyi";
// import randomLayout from "graphology-layout/random";

import Sigma from "../src/sigma";
import { globalize } from "./utils";
import {nodes,links} from "../data"
import { EdgeAttributes, NodeAttributes } from "../src/types";

import CustomNodeProgram from "./custom-nodes/custom-node-program";

import chroma from "chroma-js";

const container = document.getElementById("container");





/*
@events点击是否同线 
*/
function onSegment (p1, p2, q, index){
    // if x || y 为0 需要考虑
    let k1:any = ((p2.y - p1.y)/(p2.x-p1.x)).toFixed(3);
    let k2:any = ((q.y-p1.y)/(q.x-p1.x)).toFixed(3);

    let diff:number = Math.abs(k2 * 1 - k1 * 1) - (camera.ratio < 0.3 ? camera.ratio * 2 : camera.ratio) * 0.1;

    // space
    if(diff <= Number.EPSILON){
      
       if((p1.x < q.x && p2.x < q.x) 
         || (p1.y < q.y && p2.y < q.y) 
         || (p1.x > q.x && p2.x > q.x) 
         || (p1.y > q.y && p2.y > q.y)){
         return false;
       }
       return true;
      // }
    }
}


const graph = new MultiGraph();

nodes.map(node=>{
// console.log(node.fill)
let node_ = node.attributes;
graph.addNode(node.key,{
    x:node_.x * 1,
    y:node_.y * 1,
    color:node_.fill,
    index:0,
    size:60,
    // label:node_.text,
    icon:node_.icon
  })
})

links.map(link=>{
  if(link.attributes.index < 5){
    graph.addEdge(link.source,link.target,{
      label: link.attributes.label,
      color: link.attributes.color,
      index:link.attributes.index,
      size: 1
    })
  }
})

var color = chroma.random().hex();

graph.nodes().forEach((node) => {
  // let node_attrbutes = graph.getNodeAttributes(node);
  graph.mergeNodeAttributes(node, {
    label: "交易卡号:6229289312301313",
    // size: Math.max(4, Math.random() * 10),
    size: 2,
    // color: "#000",
  });
});
window.addEventListener("message",function(e){
  let data = e.data;
  let type = data.type;
  if(type == 1){

  }
})


// graph.addNode(1,{x:20,y:20,label:"1111111"});
// graph.addNode(2,{x:30,y:0,label:"2222222"});
// // graph.addNode(3,{x:-100,y:50});
// // graph.addNode(4,{x:-200,y:200});
// graph.addEdge(1,2);
// // graph.addEdge(1,2);
// // graph.addEdge(1,2);
// // graph.addEdge(1,2);
// // graph.addEdge(1,2);
// // graph.addEdge(1,2);
// // graph.addEdge(1,2);

// // graph.addNode(1,{x:0,y:0});
// // let data = graph.getNodeAttributes(1)
// // console.log(data)
// graph.nodes().forEach((node) => {
//   graph.mergeNodeAttributes(node, {
//     // label: getRandomName(),
//     label:"11111\n22222",
//     // index:1,
//     size: Math.max(4, Math.random() * 10),
//     color: chroma.random().hex(),
//   });
// });
// graph.edges().forEach((edge,index)=>{
//   // console.log(edge)
//   graph.mergeEdgeAttributes(edge, {
//       // type: 'bezier',
//       size:10,
//       key:index, 
//       index:index,
//       color:"red",
//       label:edge,
      
//   });
// })



// const renderer = new Sigma(graph, container, {
//   nodeReducer,
//   edgeReducer,
//   zIndex: true,
// });

let highlighedNodes = new Set();
let highlighedEdges = new Set();
let selectedNodes = new Set();
let selectedEdges = new Set();


const nodeReducer = (node: NodeKey, data: NodeAttributes) => {
  if (highlighedNodes.has(node)) return { ...data, color: "#f00", zIndex: 1 };
  if (selectedNodes.has(node)) return { ...data, color: "#000", zIndex: 1 };

  return data;
};

const edgeReducer = (edge: EdgeKey, data: EdgeAttributes) => {
  if (highlighedEdges.has(edge)) return { ...data, color: "#f00", zIndex: 1 };
  if (selectedEdges.has(edge)) return { ...data, color: "#f00", zIndex: 1 };

  return data;
};

const renderer = new Sigma(graph, container,{
  defaultEdgeType: "arrow",
  defaultEdgeColor: "#888",
  defaultNodeType:"circle",
  nodeReducer,
  edgeReducer,
  renderEdgeLabels: true,
  // nodeProgramClasses: { circle: CustomNodeProgram },
  // renderNodeLabels: true,
});


renderer.on("clickNode", ({ node, captor, event }) => {
  // console.log("Clicking:", node, captor, event);
  if(selectedNodes.has(node)){
    selectedNodes.delete(node);
  }else{
    selectedNodes.add(node);
  }
  // renderer.refresh();
});
// renderer.on("rightClickNode", ({ node, captor, event }) => {
//   console.log("Right Clicking:", node, captor, event);
//   event.preventDefault();
// });

// renderer.on("downStage", ({ event }) => {
//   console.log("Downing the stage.", event);
// });
 /*
  change 9/16
  完善多边点击
 */
renderer.on("clickStage", ({ event }) => {
  // console.log("Clicking the stage.", event);
    selectedNodes.clear();
    selectedEdges.clear();
    renderer.refresh();
    // 判断是否点击的是边
    graph.edges().forEach(edge=>{
       let from = graph.source(edge);
       let to = graph.target(edge);
        
       // from起点坐标
       let p = renderer.graphToViewport({x:graph.getNodeAttributes(from).x,y:graph.getNodeAttributes(from).y});
       // to终点坐标
       let p1 = renderer.graphToViewport({x:graph.getNodeAttributes(to).x,y:graph.getNodeAttributes(to).y})
       // 事件坐标
       let p_event = event;
       let index = graph.getEdgeAttribute(edge, 'index');
       let isOnLink = false;

       if(index == 0){
         isOnLink = onSegment(p,p1,p_event,index);
         // console.log(isOnLink)
       }else{
         
         if(index % 2 == 0){
            let p_p1 = {
              "x":(p.x + p1.x) / 2 + (p1.y - p.y) / -(index + 8),
              "y":(p.y + p1.y) / 2 + (p.x - p1.x) / -(index + 8),
            };
            
            // isOnLink = onSegment(p,p_p1,p_event,index) 
            isOnLink = onSegment(p,p_p1,p_event,index) || onSegment(p_p1,p1,p_event,index);
          }else{

            // let p_p1 = (p.x + p1.x) / 2 + (p1.y - p.y) / -(index + 8);
            let p_p1 = {
              "x":(p.x + p1.x) / 2 + (p1.y - p.y) / (index + 8),
              "y":(p.y + p1.y) / 2 + (p.x - p1.x) / (index + 8),
            };
            
            // isOnLink = onSegment(p,p_p1,p_event,index);
            // console.log(onSegment(p_p1,p1,p_event,index))
            isOnLink = onSegment(p,p_p1,p_event,index) || onSegment(p_p1,p1,p_event,index);
            // isOnLink = onSegment(p,p_p1,p_event,index) && onSegment(p,p_p1,p_event,index);
          }
       }
       // console.log(onSegment_(p,p1,p_event))
       if(isOnLink){
          selectedEdges.add(edge);
          // console.log(selectedEdges)
          renderer.refresh();
       }
    })
});
// renderer.on("rightClickStage", ({ event }) => {
//   console.log("Right Clicking the stage.", event);
// });

// renderer.on("enterNode", ({ node }) => {
//   // console.log("Entering: ", node);
//   highlighedNodes = new Set(graph.neighbors(node));
//   highlighedNodes.add(node);

//   highlighedEdges = new Set(graph.edges(node));

//   renderer.refresh();
// });

// renderer.on("leaveNode", ({ node }) => {
//   // console.log("Leaving:", node);

//   highlighedNodes.clear();
//   highlighedEdges.clear();

//   renderer.refresh();
// });




/*
  拖拽

 */
const camera = renderer.getCamera();
// console.log(camera.ratio)

const captor = renderer.getMouseCaptor();

// State  目前只允许单节点拖拽问题 修改为数组 遍历。。性能问题
let draggedNode: NodeKey | null = null,
  dragging = false;

renderer.on("downNode", (e) => {
  dragging = true;
  draggedNode = e.node;
  camera.disable();
  isFrameSelection = false;
});

var timer = null;
var isFrameSelection = false;
captor.on("mouseup", () => {
  dragging = false;
  draggedNode = null;
  camera.enable();
  clearTimeout(timer)
  if(isFrameSelection){
    if(Math.abs(selection_w) > 0 || Math.abs(selection_h) > 0){
      // 判断是否框选
      // if(selection_w < 0 && selection_h < 0) {

      // }
      var x1 = selection_w + down_x;
      var y1 = selection_h + down_y;
      // console.log(pos.x < down_x && pos.x > x1 && pos.y > y1 && pos.y < down_y)
      graph.nodes().forEach(node=>{
        let pos = renderer.graphToViewport({x:graph.getNodeAttributes(node).x,y:graph.getNodeAttributes(node).y})
        // if(pos.x > down_x && pos.x < x1 && pos.y > down_y && pos.y < y1){
        // console.log(down_x,down_y,x1,y1)
        // }
        if(pos.x > down_x && pos.x < x1 && pos.y > down_y && pos.y < y1){
          // 右下方向 x + y +
          selectedNodes.add(node)
          // renderer.refresh();
        }
        if(pos.x > down_x && pos.x < x1 && pos.y > y1 && pos.y < down_y){
          // 右上方向 x + y-
          selectedNodes.add(node)
          // renderer.refresh();
        }
        if(pos.x < down_x && pos.x > x1 && pos.y > down_y && pos.y < y1){
          // 右上方向 x + y-
          selectedNodes.add(node)
          // renderer.refresh();
        }
        // console.log(pos.x < down_x && pos.x > x1 && pos.y > y1 && pos.y < down_y)
        if(pos.x < down_x && pos.x > x1 && pos.y > y1 && pos.y < down_y){
          // 左上角方向
          selectedNodes.add(node)
          // renderer.refresh();
        }
      })

      links.map(link=>{
        // console.log(link)
        if(selectedNodes.has(link.from) &&selectedNodes.has(link.to)){
          selectedEdges.add(link.id);
        }
      })
      // console.log(selectedEdges)
      renderer.refresh();
       
    }
    isFrameSelection = false;
    let canvas = document.querySelector("canvas");
    renderer.getCanvasContexts().mouse.clearRect(0,0,canvas.width,canvas.height);
  }
});

var down_x,down_y,selection_w,selection_h;
function draw(ctx,down_x,down_y,w,h){
  // console.log(down_x,down_y,w,h)
    let canvas = document.querySelector("canvas");
    ctx.strokeStyle = "#f00";
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.strokeRect(down_x,down_y,w,h);
}
captor.on("mousemove", (e) => {

  if (!dragging || !draggedNode){

      if(isFrameSelection){
          // 是否可以拖拽
         selection_w = e.x - down_x;
         selection_h = e.y - down_y;
        draw(renderer.getCanvasContexts().mouse,down_x,down_y,selection_w,selection_h);
      }
      return;
  } 

  // Get new position of node

  // graph.setNodeAttribute(draggedNode, "x", pos.x);
  // graph.setNodeAttribute(draggedNode, "y", pos.y);
  setTimeout(function(){
    window.requestAnimationFrame(function(){
    // console.log(e)
    if(!draggedNode) return;
    isFrameSelection = false;
    const pos = renderer.viewportToGraph(e);
    graph.setNodeAttribute(draggedNode, "x", pos.x);
    graph.setNodeAttribute(draggedNode, "y", pos.y);
  })
  })
});



captor.on("mousedown", (event) => {
   // 判断是否框选 可进行边遍历 然后拿已选中的点进行判断。
  // down_x = event.x;
  // down_y = event.y;
  timer = setTimeout(function(){
    camera.disable();
    isFrameSelection = true;
    // if(down_x ==)
    down_x = event.x;
    down_y = event.y;
    
  },300)
});

globalize({ graph, renderer });
