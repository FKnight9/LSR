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
        return -1;
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
}

module.exports = List;