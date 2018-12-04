class Node {

    constructor (ID, cost) 
    {
        this.ID = ID;
        if (cost != undefined) 
        {
            this.cost = cost;
        } 
        else 
        {
            this.cost = 1;
        }
        this.next = null;
    }
}

module.exports = Node;