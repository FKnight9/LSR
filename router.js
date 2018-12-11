const List = require("./list");
const LSP = require("./lsp");

class Router {
    constructor(ID, name) {
        this.ID = ID;
        this.name = name;
        this.state = true;
        this.directLinkList = new List(ID, name);
        this.sequenceRecord = [];
        this.sequenceNum = 1;
        this.directLinkCounter = [];
        this.directLinkRouters = [];
        this.graph = [];
    }

    addDirectLink(ID, cost) {
        this.directLinkList.add(ID, cost);
        this.directLinkCounter.push([ID, 0]);
    }

    getDirectRouters(routers) {
        this.directLinkRouters = [];
        let directLinkRouterID = this.directLinkList.getIDs();
        for (let router of routers) {
            if (directLinkRouterID.indexOf(router.ID) >= 0) {
                this.directLinkRouters.push(router);
            }
        }
    }

    sequenceCheck(ID, sequence) {
        for (let record of this.sequenceRecord) {
            if (record[0] === ID && record[1] < sequence) {
                record[1] = sequence;
                return true;
            } else if (record[0] === ID && record[1] >= sequence) {
                return false;
            }
        }
        this.sequenceRecord.push([ID, sequence]);
        return true;
    }

    updateGraph(list) {
        for (let i = 0; i < this.graph.length; i++) {
            if (this.graph[i].head.ID === list.head.ID) {
                this.graph[i] = list;
                return true;
            }
        }
        this.graph.push(list);
        return true;
    }

    receivePacket(lsp, ID) {
        if (this.state == false) {
            return false;
        } 
        lsp.TTL--;
        for (let counter of this.directLinkCounter) {
            if (ID === counter[0]) {
                counter[1] = 0;
                break;
            }
        }
        if (lsp.TTL === 0) return true;
        if (this.sequenceCheck(lsp.router, lsp.sequence)) {
            let tempList = lsp.list.copy();
            this.updateGraph(tempList);
            for (let router of this.directLinkRouters) {
                if (router.ID != ID && router.ID != lsp.router) {
                    router.receivePacket(lsp.copy(), this.ID);
                }
            }
        }
        return true;
    }

    originatePacket() {
        if (this.state == false) {
            return false;
        }

        for (let count of this.directLinkCounter) {
            if (count[1] >= 2) {
                this.directLinkList.setCost(count[0], Infinity);
            }
        }
        let lsp = new LSP(this.ID, this.sequenceNum, this.directLinkList, 10);
        this.sequenceNum++;
        for (let router of this.directLinkRouters) {
            router.receivePacket(lsp, this.ID);
        }
        return true;
    }

    shutdown() {
        this.state = false;
    }

    resume() {
        this.state = true;
    }

    printRoutingTable() {
        for (let router of this.tempTable) {
            let destination_network = this.getNetworkNameByID(router[0]);
            let outgoing_network = this.getNetworkNameByID(router[1]);
            console.log(destination_network + ", " + outgoing_network);
        }
    }

    getNetworkNameByID(ID) {
        for (let router of this.networkNameMap) {
            if (router[0] === ID) {
                return router[1];
            }
        }
        throw "Error at getting the newtork name by ID";
    }

    getTableArrByID(routingTable, ID) {
        for (let router of routingTable) {
            if (router[0] === ID) {
                return router;
            }
        }
        throw "Error at getting table array by ID"
    }

    getCostFromTableByID(tempTable, ID) {
        for (let router of tempTable) {
            if (router[0] === ID) {
                return router[2];
            }
        }
        throw "Error at getting cost from table by ID";
    }

    findListByID(ID) {
        for (let list of this.graph) {
            if (list.head.ID === ID) {
                return list;
            }
        }
        throw "Error at finding the list by ID";
    }

    updateRoutingTable() {
        let start = this.ID;
        let tempRoutingTable = [];
        this.networkNameMap = [[this.directLinkList.head.ID, this.directLinkList.name]];
        tempRoutingTable.push([this.directLinkList.head.ID, this.directLinkList.head.ID, this.directLinkList.head.cost]);
        for (let list of this.graph) {
            this.networkNameMap.push([list.head.ID, list.name]);
            tempRoutingTable.push([list.head.ID, null, Infinity]);
        }
        let directLinkRouterIDs = this.directLinkList.getIDs();
        for (let router of directLinkRouterIDs) {
            let arr1 = this.getTableArrByID(tempRoutingTable, router);
            arr1[1] = router;
            arr1[2] = this.directLinkList.getCost(router);
            let s1 = [start, ];
            let s2 = [router, ];
            let cost1 = this.directLinkList.getCost(router)
            do {
                let tempID = s2.shift();
                s1.push(tempID);
                let tempList = this.findListByID(tempID);
                let cost2 = this.getCostFromTableByID(tempRoutingTable, tempID);

                let node = tempList.head;
                while (node != null) {
                    let tempTotalCost = cost2 + node.cost;
                    let arr2 = this.getTableArrByID(tempRoutingTable, node.ID);
                    if (arr2[2] > tempTotalCost) {
                        arr2[2] = tempTotalCost;
                        arr2[1] = router;
                    }
                    if (s1.indexOf(node.ID) === -1 && s2.indexOf(node.ID) === -1) {
                        s2.push(node.ID);
                    }
                    node = node.next;
                }
            } while (s2.length > 0);
        }
        this.tempTable = tempRoutingTable;
    }
}

module.exports = Router;