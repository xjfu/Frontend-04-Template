function match(string) {
    let state = start  
    for (const c of string) {
        state = state(c)
    }
    return state === end
}

function start(c) {
    if (c == 'a') {
        return founA(c)
    } else {
        return start
    }

}
// 用状态机实现：字符串“abcabx”的解析
function match_abcabx(string) {
    let state = start
    for (const c of string) {
        state = state(c)
    }
    return state === end
}

function start(c) {
    if (c === 'a') {
        return foundA
    } else {
        return start(c)
    }
}

function founA(c) {
    if (c === 'b') {
        return foundB
    } else {
        return start(c)
    }
}
function foundB(c){
    if (c == 'c') {
        return foundC
    } else {
        return start(c)
    }
}
function foundC(c){
    if (c == 'a') {
        return foundA2
    } else {
        return start(c)
    }
}

function foundA2(c){
    if (c == 'b') {
        return foundB2
    } else {
        return start(c)
    }
}
function foundB2(c){
    if (c == 'x') {
        return end
    } else {
        return foundB(c)
    }
}
// 作业：使用状态机完成”abababx”的处理。
function match_abababx(string) {
    let state = start
    for (const c of string) {
        state = state(c)
    }
    return state == end
}

function start(c) {
    if (c == 'a') {
        return founA
    } else {
        return start(c)
    }
}
function founA(c) {
    if (c == 'b') {
        return foundB
    } else {
        return start(c)
    }
}

function founB(c) {
    if (c == 'a') {
        return foundA2
    } else {
        return start(c)
    }
}

function foundA2(c) {
    if (c == 'b') {
        return foundB2
    } else {
        return foundA(c)
    }
}

function foundB2(c) {
    if (c == 'a') {
        return foundA3
    } else {
        return foundB(c)
    }
}

function foundA3(c) {
    if (c == 'b') {
        return foundB3
    } else {
        return foundA2(c)
    }
}

function foundB3(c) {
    if (c == 'x') {
        return end
    } else {
        return foundB2(c)
    }
}

