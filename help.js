const Router = require("./router");

function readFile(file) {
    let routers = [];
    let input = fs.readFileSync(file, 'utf8').replace(/\r/g, '').split('\n');
    let cleanInput = [];
    for (let line of input) {
        cleanInput.push(line.replace(/\s+/g, ' ').split(' '));
    }
    for (let i = 0; i < cleanInput.length; i++) {
        if (cleanInput[i][0] != '') {
            routers.push(new Router(parseInt(cleanInput[i][0]), cleanInput[i][1]));
        } else if (cleanInput[i][0] == '') {
            let temp = routers[routers.length - 1];
            if (cleanInput[i].length === 2) {
                temp.addDirectLink(parseInt(cleanInput[i][1]));
            } else if (cleanInput[i].length === 3) {
                temp.addDirectLink(parseInt(cleanInput[i][1]), parseInt(cleanInput[i][2]));
            } else {
                throw "Incorrect amount of paramters";
            }
        } else {
            throw "infile.dat is in the wrong format";
        }
    }
    return routers;
}

function originatePacket(routers) {
    for (let router of routers) {
        router.getDirectRouters(routers);
    }
    for (let router of routers) {
        router.originatePacket();
    }
    for (let router of routers) {
        router.updateRoutingTable();
    }
}

function startup(routers, input) {
    console.log("Starting up " + input);
    let array = input.split(' ');
    let router = findRouterByName(routers, array[1]);
    router.resume();
}

function shutdown(routers, input) {
    console.log("Shutting down " + input);
    let array = input.split(' ');
    let router = findRouterByName(routers, array[1]);
    router.shutdown();
}

function print(routers, input) {
    console.log("Printing routing table now " + input);
    let array = input.split(' ');
    let router = findRouterByName(routers, array[1]);
    router.shutdown();
}

function findRouterByName(router, name) {
    for (let router of routers) {
        if (router.name == name) {
            return router;
        }
    }
    throw "Could not find router with this name";
}

module.exports = {
    readFile,
    originatePacket,
    shutdown,
    startup,
    print
}