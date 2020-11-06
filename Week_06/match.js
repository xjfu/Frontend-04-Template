var match_a = function (string) {
    let flat = false
    for (const i of string) {
        if (i == 'a') {
            flag = true
        } else if(i=='b' && flag == 'true'){
            flag = true
        } else {
            flag = false
        }
    }
    return flag
}


var match_abcde = function(string) {
    let s = ''
    for(let i=0; i < string.length; i++) {
        if(string[i] == 'a') {
            s = string.slice(i, i+6)
        }
    }
    return s == 'abcdef'
        
}