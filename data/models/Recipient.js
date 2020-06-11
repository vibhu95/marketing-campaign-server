class Recipient{
    constructor(){
        
    }

    set Name(Name){
        this._Name = Name;
    }

    set Email(Email){
        this._Email = Email;
    }

    set Status(Status){
        this._Status = Status;
    }

    get Name(){
        return this._Name;
    }

    get Email(){
        return this._Email;
    }

    get Status(){
        return this._Status;
    }
}

module.exports = Recipient;