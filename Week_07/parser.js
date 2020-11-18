
// 
const EOF = Symbol("EOF")
const log = console.log.bind(console)
/* 
<a>
</a> 
*/
let currentToken = null
function emit(token) {
    log(token)
}
let html = `
<div style="width: 990.0px;height: 355.0px;font-size: 0">
	<img src="https://img.alicdn.com/imgextra/i3/196993935/O1CN01lR40vL1ewH74O3oJE_!!196993935.jpg" alt=" 990.jpg" />
	<div style="margin-left: 65.0px;margin-top: -60.0px">
		 <a href="http://uniqlo.tmall.com/p/uttop.htm?spm=a1z10.5-b-s.w4011-15676986369.160.SHCYQz" target="_blank" style="margin-right: 25.0px"><img src="http://img.alicdn.com/imgextra/i4/196993935/TB2EpdcabglyKJjSZFuXXaE6FXa_!!196993935.png" /></a>
	</div>
	<div style="margin-left: 292.0px;margin-top: -23.0px">
	
		<a href="http://uniqlo.tmall.com/category-1524026894.htm?spm=a1z10.5-b-s.w4011-1514163491.2.65722f2aKKR8Tm" target="_blank" style="margin-right: 25.0px; ">
			<img src="http://img.alicdn.com/imgextra/i2/196993935/TB2aZqAXPZnyKJjSZFxXXabIpXa_!!196993935.png" alt=" MEN.png" />
		</a>
		
		<a href="http://uniqlo.tmall.com/category-1524026892.htm?spm=a1z10.4-b-s.w4007-1514163490.14.7562420edktk2G" target="_blank" style="margin-right: 25.0px"> 
			<img src="http://img.alicdn.com/imgextra/i3/196993935/TB2KcsFXwwjyKJjy1zdXXbgZpXa_!!196993935.png" alt=" WOMEN.png" /> 
		</a>  
		
		 <a href="http://uniqlo.tmall.com/category-1524026896.htm?spm=a1z10.5-b-s.w4011-15676986369.3.65722f2aKKR8Tm" target="_blank" style="margin-right: 25.0px;"> 
			<img src="http://img.alicdn.com/imgextra/i3/196993935/TB2vtOAXT3myKJjSZFCXXbXxXXa_!!196993935.png" alt=" KIDS.png" /> 
		</a> 

			
		<a href="http://uniqlo.tmall.com/category-1524026898.htm" target="_blank" style="margin-right: 25.0px;"> 
			<img src="http://img.alicdn.com/imgextra/i2/196993935/TB2M_GBXHMlyKJjSZFAXXbkLXXa_!!196993935.png" alt=" BABY.png" /> </a>
	</div>
</div>

<html></html>`

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
            type:"startTag",
            tagName:"",
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
            tagName:""
        }

        return tagName(c)
    } else if (c == '>'){
    } else if (c == EOF) {
        
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
    } else if (c == '>') {
        return data
    } else if (c === '=') {
        return beforeAttributeName
    } else {
        return beforeAttributeName
    }
}

function selfClosingStartTag(c) {
    if (c == '>') {
        currentToken.isSelfClosing = True
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