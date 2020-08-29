
const http = require('http');
const ejs = require('ejs')
const fs = require('fs');
const log = console.log.bind(console)
const template = function(name) {
    let path = 'template/'+name
    return fs.readFileSync(path, 'utf8')
}
const redirect = function(url) {
    return {
        "Context-Type": "text/html; charset=utf-8",
        "Location":url
    }

}

const writeFile= function(dir, name, data) {
    let path = dir+name
    // const fs = require('fs')
    fs.writeFileSync(path, data, 'utf8')
}

const dir_read_file = function(dir, name) {
    let path = dir+name
    return fs.readFileSync(path, 'utf8')
}
const api_post_json = function(request, res, q) {
    // let data = dir_read_file('template/', 'index.json')
    let postData = []
    request.req.on('data', function(postDataChunk) {
        postData.push(postDataChunk);
    });
    request.req.on('end', function(){
        let buffer=Buffer.concat(postData)
        let d = buffer.toString()
        d = JSON.parse(d)
        d = JSON.stringify(d)
        writeFile('template/', 'index.json', d)        
        res.writeHead(301, redirect('/'))
        res.end("ok") 
    
    })
    
    // data = `${request.query.method}(`+`${JSON.stringify(data)}`+`)`
   
}

const api_get_json = function(request, res, q) {

    let data = dir_read_file('template/', 'index.json')
    data = JSON.parse(data)

    data = JSON.stringify(data)

    // data = `${request.query.method}(`+`${JSON.stringify(data)}`+`)`
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.setHeader('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');//设置方法
  
    // 允许携带哪个头访问我
    // 允许哪个方法访问我
    // 允许携带cookie
    res.setHeader('Access-Control-Allow-Credentials', true)
    // 预检的存活时间
    res.setHeader('Access-Control-Max-Age', 6)
    // 允许返回的头
    res.setHeader('Access-Control-Expose-Headers', 'name')
    res.end(data)
}

const route_index = function(request,res) {
    // 分页设置, tab设置
    // 
    // 设置 头部
    res.setHeader('Content-Type', 'text/html')

    // 这里添加 
    let body = template('index.ejs')
    // 读取数据
    let ms = dir_read_file('template/', 'index.json')

    ms = JSON.parse(ms)
    let html = ejs.render(body, {ms});

    res.write(html)
}

const r = {
    '/': route_index,
    '/api/get_json': api_get_json,
    '/api/post_json': api_post_json,
}

class Request {
    constructor() {
        this.method = 'GET'
        this.path = ''
        this.query = {}
        this.body = ''
    }
    form(data) {
        const args = data.split('&')
        const f = {}
    
        for (const arg in args) {
    
            let k = args[arg].split('=')[0]
            let v = args[arg].split('=')[1]
            f[k] = v      
        }  
        return f
    
    }

}

let request = new Request()

var parsed_path = function(url) {
    path = url.split('?')[0]
    return path
}

var parsed_query = function(url) {
    let query = {}
    if(url.indexOf('?') > -1) {

        let query_string = url.split('?')[1]
        if(query_string.indexOf('&') > -1) {
            let args = query_string.split('&')
            for (const arg of args) {
                let k = arg.split('=')[0]
                let v = arg.split('=')[1]
                query[k] = v
            }
        } else {
            let k = query_string.split('=')[0]
            let v = query_string.split('=')[1]
            query[k] = v
        }
    
    }
    
    

    return query
}


const response = function(req, res) {
    const { headers, method, url } = req;
    request.path = parsed_path(url)
    request.query = parsed_query(url)
    request.headers = headers
    request.body = req.body
    request.req = req
    request.method = method
    if(r[request.path] !== undefined) {
        var res_func = r[request.path]
    } else {
        res_func = r['/static']
    }
    res_func(request, res)

    
   
}

const app = http.createServer((req, res) => {
    response(req, res)
});

const run = (config) => {
    let port = config.port

    let hostname = config.hostname

    app.listen({port, hostname}, () => {
        console.log(`Server running at http://${hostname}:${port}/`);
    });
 
    
}

const _main = function() {

    const config = {
        hostname: 'localhost',
        port: 2001,
    }
    run(config)
}

_main()