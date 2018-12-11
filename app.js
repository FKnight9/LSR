const Help = require("./help");
const prompts = require("prompt-sync");
const prompt = prompts();

let routers = Help.readFile("infile.dat");

while (1)
{
    console.log("\nEnter:\n \"C\" to continue\n \"Q\" to quit\n \"P\" followed by a router ID number to print a routing table\n \"S\" followed by a router ID number to shut down a router\n \"T\" followed by a router ID number to start up a router.\n");
    let input = prompt(">>");
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