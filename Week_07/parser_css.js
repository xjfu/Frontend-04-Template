// 
const EOF = Symbol("EOF")
const log = console.log.bind(console)
const css = require('cssparser')
/* 
<a>
</a> 
*/

let currentToken = null
let currentAttribute = null
let stack = [{
    type: "document",
    children: []
}]

let rules = []
function addCSSRules(text) {
    var ast = css.parse(text)
    console.log(JSON.stringify(ast, null, "   "))
    rules.push(...ast.stylesheet[rules])
}

function emit(token) {
    if (token.type === "text") {
        return
    }
    let top = stack[stack.length - 1] //栈顶元素
    if (token.type === "startTag") {
        let element = {
            type: "element",
            children: [],
            attributes: [],
        }
        element.tagName = token.tagName
        // 遍历属性
        for (let p in token) {
            if (p != "type" && p != "tagname") {
                element.attributes.push({
                    name: p,
                    value: token[p],
                })

            }
        }


        // {
        //     type:"document", 
        //     children:[
        //     // element
        //         {
        //             type: "element",
        //             children: [],
        //             attributes: [],
        //         }
        //     ]
        // }
        top.children.push(element)
        element.parent = top

        if (!token.isSelfClosing) {
            stack.push(element)
        }

        currentTextNode = null

    } else if (token.type == "endTag") {
        // 出栈
        if (top.tagName != token.tagName) {
            throw new Error("tag start does not match")

        } else {
            if (top.tagName == "style") {
                addCSSRules(top.children[0].content)
            }
            stack.pop()
        }
        currentTextNode = null

    } else if (token.type == "text") {
        // 处理文本节点
        if (currentTextNode == null) {
            currentTextNode = {
                type: "text",
                content: ""
            }
            top.children.push(currentTextNode)
        }
        currentTextNode.content += token.content
    }
    log()
}
let html = `
`

// 状态data
function data(c) {
    if (c == '<') {
        return tagOpen
    } else if (c == EOF) {
        emit({
            type: "EOF"
        })
        return;
    } else {
        emit({
            type: "text",
            content: c,
        })
        return data
    }
}

function tagOpen(c) {
    if (c == '/') {
        return endTagOpen
    } else if (c.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: "startTag",
            tagName: "",
        }
        return tagName(c)
    } else {
        return
    }
}

function endTagOpen(c) {
    if (c.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: "endTag",
            tagName: ""
        }

        return tagName(c)
    } else if (c == '>') {} else if (c == EOF) {

    } else {

    }
}

function tagName(c) {

    // tagName 是以空白符结束的，html中有效的空白符有四种
    // 分别出tag符，换行符，禁止符和空格
    // 遇到空格之后进入beforeAttibuteName状态
    // 遇到 / 说明是一个自封闭标签

    if (c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName
    } else if (c == '/') {
        return selfClosingStartTag
    } else if (c.match(/^[a-zA-Z]$/)) {
        currentToken.tagName += c

        return tagName
    } else if (c == '>') {
        emit(currentToken)
        return data
    } else {
        return tagName
    }
}

function beforeAttributeName(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName
    } else if (c == '>' || c == '/' || c == EOF) {
        return afterAttributeName(c)
    } else if (c === '=') {
        return
    } else {
        currentAttribute = {
            name: "",
            value: "",
        }
        return attributeName(c)
    }
}

function attributeName(c) {
    if (c.match(/^[\t\n\f ]$/) || c == '/' || c == ">" || c == EOF) {
        return afterAttributeName(c)
    } else if (c === '=') {
        return beforeAttributeValue
    } else if (c === '\u0000') {


    } else if (c == "\"" || c == "'" || c == '<' ) {

    } else {
        currentAttribute.name += c
        return attributeName
    }

}
function beforeAttributeValue(c) {
    if (c.match(/^[\t\n\f ]$/) || c === '>' || c === '/' || c === EOF) {
        return beforeAttributeValue
    } else if (c === '\"') {
        return doubleQuotedAttributeValue
    } else if (c === '\'') {
        return singleQuotedAttributeValue
    } else if (c === '>') {
        //
    } else {
        return UnquotedAttributeValue(c)
    }

}

function doubleQuotedAttributeValue(c) {
    if (c === '\"') {
        currentToken[currentAttribute.name] = currentAttribute.value
        return afterQuotedAttributeValue
    } else if (c === '\u0000') {

    } else if (c === EOF) {

    } else {
        currentAttribute.value += c
        return doubleQuotedAttributeValue
    }

}
function singleQuotedAttributeValue(c) {
    if (c === '\'') {
        currentToken[currentAttribute.name] = currentAttribute.value
        return afterQuotedAttributeValue
    } else if (c === '\u0000') {

    } else if (c === EOF) {

    } else {
        currentAttribute.value += c
        return singleQuotedAttributeValue
    }

}

function afterQuotedAttributeValue(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName
    } else if (c === '/') {
        return selfClosingStartTag
    } else if (c === '>') {
        currentToken[currentAttribute.name] = currentAttribute.value
        emit(currentToken)
        return data
    } else if (c === EOF) {

    } else {
        currentAttribute.value += c
        return doubleQuotedAttributeValue
    }

}
function UnquotedAttributeValue (c) {
    if (c.match(/^[\t\n\f ]$/)) {
        currentToken[currentAttribute.name] = currentAttribute.value
        return beforeAttributeName
    }  else if (c === '/') {
        currentToken[currentAttribute.name] = currentAttribute.value
        return selfClosingStartTag
    } else if (c === '>') {
        currentToken[currentAttribute.name] = currentAttribute.value
        emit(currentToken)
        return data
    } else if (c === '\u0000') {

    } else if (c === '\"' || c === '\'' || c === '<' || c === '=' || c === '`') {

    } else if (c === EOF) {

    } else {
        currentAttribute.value += c
        return UnquotedAttributeValue
    }

}
function afterAttributeName (c) {
    if (c.match(/^[\t\n\f ]$/)) {
        
        return afterAttributeName
    }  else if (c === '/') {
        
        return selfClosingStartTag
    } else if (c === '=') {
        return beforeAttributeValue
    } else if (c === '>') {
        currentToken[currentAttribute.name] = currentAttribute.value
        emit(currentToken)
        return data
    } else if (c === EOF) {

    } else {
        currentToken[currentAttribute.name] = currentAttribute.value
        currentAttribute = {
            name: '',
            value: ''
        }
        return attributeName(c)
    }

}

function selfClosingStartTag(c) {
    if (c == '>') {
        currentToken.isSelfClosing = true
        return data
    } else if (c == EOF) {

    } else {

    }
}

function parserHTML(html) {
    let state = data
    for (const c of html) {
        state = state(c)
        // log('state', state)
    }

    state = state(EOF)

    // console.log(html)
}

module.exports.parserHTML = parserHTML

parserHTML(html)