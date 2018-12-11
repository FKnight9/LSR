const Help = require("./help");

let routers = Help.readFile("infile.dat");


while (1)
{
    let input = prompt("Enter \"C\" to continue, \"Q\" to quit, \"P\" followed by a router ID number to print a routing table, \"S\" followed by a router ID number to shut down a router, or \"T\" followed by a router ID number to start up a router.");
    let array = input.trim().replace(/\s+/g, ' ');
    let letter = array[0];
    if (letter == 'C')
    {
        Help.originatePacket(routers);
    }
    else if (letter == 'Q')
    {
        console.log("Thank you, have a great day!");
        break;
    }
    else if (letter == 'P')
    {
        Help.print(routers, array);
    }
    else if (letter == 'S')
    {
        Help.shutdown(routers, array);
    }
    else if (letter == 'T')
    {
        Help.startup(routers, array);
    } else {
        console.log("Your input was invalid, please input a correct entry");
    }
}