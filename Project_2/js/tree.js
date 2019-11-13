/** Class representing a Tree. */
class Tree {
    /**
     * Creates a Tree Object
     * Populates a single attribute that contains a list (array) of Node objects to be used by the other functions in this class
     * note: Node objects will have a name, parentNode, parentName, children, level, and position
     * @param {json[]} json - array of json objects with name and parent fields
     */

    constructor(json) {

      this.list=[];
      this.rootnode=null;
        for(let i=0; i< json.length; i++)
          {
            let Nobj= new Node();
            this.list[i]=Nobj;
            Nobj.name= json[i].name;
            Nobj.parentName=json[i].parent;
            if(Nobj.parentName=='root')
                this.rootnode=Nobj;
            }


}

    /**
     * Function that builds a tree from a list of nodes with parent refs
     */
    buildTree() {
        // note: in this function you will assign positions and levels by making calls to assignPosition() and assignLevel()


        for (let j = 0; j < this.list.length; j++) {

            for (let k = j+1; k < this.list.length; k++) {
                    if(this.list[k].parentName== this.list[j].name)
                        {
                          this.list[j].addChild(this.list[k]);    //Adding child nodes to each node
                        this.list[k].parentNode= this.list[j];    //Adding Parent node Reference
                        }
                }

            }
              this.assignLevel(this.rootnode,0);
              this.assignPosition(this.rootnode,0);

    }

    /**
     * Recursive function that assign levels to each node
     */
     assignLevel(node, level) {

       if (node.parentName == 'root') {
            level = 0;
        }
        node.level = level;
        if (node.children) {
            node.children.forEach(function(child) {
                this.assignLevel(child, level + 1);
            }.bind(this))
        }
    }

    /**
     * Recursive function that assign positions to each node
     */
    assignPosition(node, position) {
      node.position = position;

        if (node.children) {
            node.children.forEach(function(child) {
                 position=this.assignPosition(child,position);
            }.bind(this))

            if (node.children.length == 0) {
                position++;
            }

        }
        return position;
    }

    /**
     * Function that renders the tree
     */

    renderTree() {
            let listA= this.list;
            let svg= d3.select("body")
                      .append('svg')
                      .attr("width",1400)
                      .attr("height",1400);;

            let lines = svg.selectAll('line').data(listA);
            let lineEnter = lines.enter().append('line');
            lines.exit().remove()
            lines = lineEnter.merge(lines);

            lines.filter(function (d){return d.parentName!='root'})
                  .attr('x1',function(d){
                                        if(d.parentName!="root")
                                        {
                                        return d.parentNode.level*150+100;
                                        }
                                        })
                  .attr('y1',function(d){
                                        if(d.parentName!="root")
                                        {
                                          return d.parentNode.position*150+100;
                                        }
                                        })
                  .attr('x2',function(d){
                                        if(d.parentName!="root")
                                        {
                                          return d.level*150+100;
                                        }
                                        })
                  .attr('y2', function(d){
                                        if(d.parentName!="root")
                                        {
                                          return d.position*150+100;
                                        }
                                        })
                  .attr("transform","translate(200,100)");

        let group=svg.selectAll('g');
        group.exit().remove()

        let g= group.data(listA)
                    .enter()
                    .append('g')
                    .attr("transform","translate(200,100)")
                    .attr("class","nodeGroup");
        let c= g.append('circle')
                    .attr('cx', (d) => d.level*150+100 )
                    .attr('cy', (d)=> d.position*150+100)
                    .attr('r', (d) => 50);

        let t= g.append('text')
                    .attr('x',(d) => d.level*150+100)
                    .attr('y',(d)=> d.position*150+100)
                    .text(function(d){return d.name})
                    .attr("class","label");

            }

}
