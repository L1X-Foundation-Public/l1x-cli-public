export function addZeroPrefix(address: string): string {   
    if(address.length == 0){
        return address;
    }
    if(address.startsWith("0x")){
        return address;
    }
    return "0x" + address;
}

export function removeZeroPrefix(address: string): string {
    if(address.length == 0){
        return address;
    }
    if(address.startsWith("0x")){
        return address.substring(2);
    }
    return address;
}