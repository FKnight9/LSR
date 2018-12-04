class LSP {

    constructor(router, sequence, list, TTL) 
    {
        this.router = router;
        this.sequence = sequence;
        this.list = list.copy();
        this.TTL = TTL;
    }
    copy() 
    {
        return new LSP(this.router, this.sequence, this.list, this.TTL);
    }
}

module.exports = LSP;