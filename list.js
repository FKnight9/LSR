const Node = require("./node");

class List {
    constructor(ID, name) {
        this.head = new Node(ID, 0);
        this.name = name;
    }

    getIDs() {
        let IDs = [];
        let current = this.head.next;
        while (current != null) {
            IDs.push(current.ID);
            current = current.next;
        }
        return IDs;
    }

    getCost(ID) {
        let current = this.head;
        while (current != null) {
            if (current.ID == ID) {
                return current.cost;
            }
            current = current.next;
        }
        return Infinity;
    }

    setCost(ID, cost) {
        let current = this.head;
        while (current != null) {
            if (current.ID == ID) {
                current.cost = cost;
                return true;
            }
            current = current.next;
        }
        return false;
    }

    add(ID, cost) {
        let current = this.head;
        while(current.next != null) {
            current = current.next;
        }
        current.next = new Node(ID, cost);
    }

    copy() {
        let listCopy = new List(this.head.ID, this.name);
        let p1 = this.head;
        let p2 = listCopy.head;
        while(p1.next != null) {
            p2.next = new Node(p1.next.ID, p1.next.cost);
            p1 = p1.next;
            p2 = p2.next;
        }
        return p2;
    }
}

module.exports = List;