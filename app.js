readFile();
while (True)
{
    var letter = prompt("Enter \"C\" to continue, \"Q\" to quit, \"P\" followed by a router ID number to print a routing table, \"S\" followed by a router ID number to shut down a router, or \"T\" followed by a router ID number to start up a router.");
    if (letter == 'C')
    {
        originatePacket();
    }
    else if (letter == 'Q')
    {
        break;
    }
    else if (letter.indexOf('P') > -1)
    {
        print();
    }
    else if (letter.indexOf('S') > -1)
    {
        shutdown();
    }
    else if (letter.indexOf('T') > -1)
    {
        startup();
    }
}