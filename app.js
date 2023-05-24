document.addEventListener('DOMContentLoaded', () => {  

    const grid = document.getElementById('grid')
    const newBtn = document.getElementById("newBtn")
    newBtn.addEventListener("click", (e) => {
        location.reload()
    })
    let rows = 6
    let cols = 6
    let gameover = false    
    let squares = []
    let noClick = 0
    grid.style.height = rows * 45  + "px"
    grid.style.width = cols * 45 + "px"
    // Create a rows x cols matrix filled with zeros
    const matrix = []; //adjMatrix
    // init matrix
    for (let i = 0; i < rows; i++) {
        matrix[i] = new Array(cols).fill(0);
    }

    let isPlayer1 = true
    let title = document.getElementById("title")
    let turn = document.getElementById("turn")

    // create node
    class Node {
        constructor(nodeid, neighbors) {
            this.nodeid = nodeid;
            this.atom = 0;
            this.color = "";
            this.neighbors = neighbors;
        }
    }
    
    // create graph
    class Graph {
        constructor() {
           this.nodes = [];
        }
        
        // add node to the graph
        addNode(Node) {
            this.nodes.push(Node);
        }

        getNodeById(nodeid) {
            return this.nodes[nodeid - 1];
          }
    }
    
    // defining neighbours (edges)
    const neighbor_matrix = {
        1: [2, 7],
        2: [1, 3, 8],
        3: [2, 4, 9],
        4: [3, 5, 10],
        5: [4, 6, 11],
        6: [5, 12],
        7: [1, 8, 13],
        8: [2, 7, 9, 14],
        9: [3, 8, 10, 15],
        10: [4, 9, 11, 16],
        11: [5, 10, 12, 17],
        12: [6, 11, 18],
        13: [7, 14, 19],
        14: [8, 13, 15, 20],
        15: [9, 14, 16, 21],
        16: [10, 15, 17, 22],
        17: [11, 16, 18, 23],
        18: [12, 17, 24],
        19: [13, 20, 25],
        20: [14, 19, 21, 26],
        21: [15, 20, 22, 27],
        22: [16, 21, 23, 28],
        23: [17, 22, 24, 29],
        24: [18, 23, 30],
        25: [19, 26, 31],
        26: [20, 25, 27, 32],
        27: [21, 26, 28, 33],
        28: [22, 27, 29, 34],
        29: [23, 28, 30, 35],
        30: [24, 29, 36],
        31: [25, 32],
        32: [26, 31, 33],
        33: [27, 32, 34],
        34: [28, 33, 35],
        35: [29, 34, 36],
        36: [30, 35]
      };
    
    let graph = new Graph();
    
    // poulate nodes
    for (let i = 1; i <= 36; i++) {
        let n = new Node(i, neighbor_matrix[i]);
        graph.addNode(n);
    }


    
    // create grid
    function createBoard () {
        for(let i = 0; i < rows*cols; i++) {
            const square = document.createElement('div')
            square.setAttribute('id', i)
            square.setAttribute('class', "cell")
            // square.innerText = 0
            grid.appendChild(square)    
            //normal click
            if(!gameover) {
                square.addEventListener('click', (e) => {

                    click(e.target, i, false);
            
                })
                squares.push(square)
            }
            
        }  
    }
    function changeTitleColor(){
        let title = document.getElementById("title")
        let turn = document.getElementById("turn")
        if(isPlayer1){
            title.style.color = "blue";
            turn.style.color = "blue";
            turn.innerText = "Blue Turn"
        }else{
            title.style.color = "red"
            turn.style.color = "red";
            turn.innerText = "Red Turn"
        }
    }
    changeTitleColor()
    // function to click the squares
    // change atom number
    const click = (e, id, rec) => {
        
        if((rec || graph.nodes[id].color == "" ||(isPlayer1 && graph.nodes[id].color === "blue") || (!isPlayer1 && graph.nodes[id].color === "red"))){
            graph.nodes[id].atom = graph.nodes[id].atom + 1;
            if(graph.nodes[id].atom == graph.nodes[id].neighbors.length){
                graph.nodes[id].atom = 0;
                graph.nodes[id].color = "";
                e.style.backgroundColor = "black";
                e.innerText = graph.nodes[id].atom
                e.style.color = "black";
                for(let j = 0; j<graph.nodes[id].neighbors.length; j++){
                    let n = graph.nodes[id].neighbors[j]
                    const ele = document.getElementById(n-1);
                    click(ele, n-1, true);
                }
            }else{
                graph.nodes[id].color = isPlayer1 ? "blue" : "red";
                e.style.backgroundColor = graph.nodes[id].color;
                e.innerText = graph.nodes[id].atom
                e.style.color = "white";    
            }
            if(!rec){
                isPlayer1 = !isPlayer1;
                if(gameover){
                    return
                }
                changeTitleColor();
                noClick++;
            }
        }
        if(gameover){
            return ;
        } 
        if(noClick >= 2 ){
            BFS(1);
        }

            
    }
    createBoard()

    class Queue {
        constructor() {
          this.items = [];
        }
        
        enqueue(item) {
          this.items.push(item);
        }
        
        dequeue() {
          if (this.isEmpty()) {
            return null;
          }
          return this.items.shift();
        }
        
        isEmpty() {
          return this.items.length === 0;
        }
      }
    
    // BFS function
    function BFS(startNodeid) {
        if(gameover) return;
        let explored = new Set();
        let queue = new Queue();
      
        // mark start node as explored and add to queue
        let startNode = graph.getNodeById(startNodeid);
        explored.add(startNodeid);
        queue.enqueue(startNodeid);
        let p1 = false
        let p2 = false
        while (!queue.isEmpty()) {
          // dequeue the first node from queue
          let currentNodeid = queue.dequeue();
          let currentNode = graph.getNodeById(currentNodeid);
      
          // process the current node
            //   console.log("Visited node: ", currentNodeid);
            //   console.log(graph.getNodeById(currentNodeid))
            if(graph.getNodeById(currentNodeid).color == "blue"){
                p1 = true;
            }
            if(graph.getNodeById(currentNodeid).color == "red"){
                p2 = true;
            }
            if(p1 == true && p2 == true){
                return;
            }
            
          // loop through the neighbors of the current node
          for (let i = 0; i < currentNode.neighbors.length; i++) {
            let neighborNodeid = currentNode.neighbors[i];
      
            // if neighbor has not been explored, mark as explored and add to queue
            if (!explored.has(neighborNodeid)) {
              explored.add(neighborNodeid);
              queue.enqueue(neighborNodeid);
            }
          }
        }
        if (p1 == false || p2 == false){
            gameover = true
            // console.log(p1, p2)
            if(!isPlayer1){
                turn.style.color = "red"
                turn.innerText = "Game Over, Red is Winner"
            }else if(isPlayer1){
                turn.style.color = "blue"
                turn.innerText = "Game Over, Blue is Winner"
            }
            gameover = true
            let cells = document.getElementsByClassName("cell")
            // console.log(cells[0])
            for(let i=0; i<cells.length; i++){
                cells[i].style.cursor = "not-allowed"
            }
            return
        }
      }
      
      // test BFS function
    //   BFS(1);
      
})