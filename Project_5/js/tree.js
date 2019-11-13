/** Class implementing the tree view. */
class Tree {
    /**
     * Creates a Tree Object
     */
    constructor() {

    }

    /**
     * Creates a node/edge structure and renders a tree layout based on the input data
     *
     * @param treeData an array of objects that contain parent/child information.
     */
    createTree(treeData) {

        // ******* TODO: PART VI *******


        //Create a tree and give it a size() of 800 by 300.
        this.treeData = treeData;


        let treeMap = d3.tree().size([800, 300]);

        //Create a root for the tree using d3.stratify();
        treeData.forEach(function(d){
            d.name = d.id;
        });

        let tree = d3.stratify()
        .id(function(d,i) { return i; })
            .parentId(d => d.ParentGame)(treeData);

        let root = d3.hierarchy(tree, d => d.children);

            let nodeData = treeMap(root);

            let nodes = nodeData.descendants();

            nodes.forEach(function(d){ d.y = d.depth * 80 + 80; });


            let node = d3.select('#tree').selectAll('g')
                .data(nodes, d => d.id);

            let nodeNew = node.enter().append('g')
                .attr('class', function(d){
                  let z=d.data;
                    return z.data.Wins === "1" ? "winner" : "loser";
                })
                .classed('node', true)
                .attr("transform", d => "translate(" + d.y + "," + d.x + ")")

            nodeNew.append('circle').attr('r', 5);

            nodeNew.append('text')
                .attr("dy", ".35em")
                .attr("x", d => d.children || d._children ? -10 : 10)
                .attr("text-anchor", d => d.children || d._children ? "end" : "start")
                .text(d => d.data.data.Team) .attr("class", function(d){
                    return d.data.data.Team + d.data.data.Opponent;
                });;



            let link = d3.select("#tree").selectAll('path.link')
                .data(nodeData.descendants().slice(1), d => d.id);

            let linkNew = link.enter().insert('path', "g")
                .attr("class", function (d) {
                  let z=d.data;
                    return z.data.Team + z.data.Opponent;
               })
                .classed("link", true);

            let newlink = linkNew.merge(link);

            newlink.transition()
                .attr('d', function (d) {
                  let p=d;
                  let q=d.parent;
                  let path = `M ${p.y} ${p.x}
                  C ${(p.y + q.y) / 2} ${p.x},
                  ${(p.y + q.y) / 2} ${q.x},
                  ${q.y} ${q.x}`;

                  return path;
                });

    }

    /**
     * Updates the highlighting in the tree based on the selected team.
     * Highlights the appropriate team nodes and labels.
     *
     * @param row a string specifying which team was selected in the table.
     */
     updateTree(row) {
           // ******* TODO: PART VII *******
           this.clearTree();
            let a=row.key+row.value.Opponent;
            let b=row.value.Opponent+row.key;
            if(row.value.type === "aggregate"){
              this.treeData.forEach(function(d){
                  if(d.Team === row.key){
                      if(d.Wins === "1"){
                          d3.selectAll("path."+(row.key+d.Opponent)).classed("selected", true);
                      }
                      d3.select(".node text."+(row.key+d.Opponent)).classed("selectedLabel", true);
                  }
              })
           }
           else{
             d3.selectAll("path."+(a));
             d3.selectAll("path."+(b));
             d3.select(".node text."+(a));
             d3.select(".node text."+(b));
           }


       }


    /**
     * Removes all highlighting from the tree.
     */
    clearTree() {
        // ******* TODO: PART VII *******

        // You only need two lines of code for this! No loops!
        d3.selectAll(".link").classed("selected", false);
        d3.selectAll(".node text").classed("selectedLabel", false);
    }
}
