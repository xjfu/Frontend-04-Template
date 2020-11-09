const net = require("net")
class Request {
    construct(options) {
        this.method = options.method || "GET";
        this.host = options.host;
        this.port = options.port || 80;
        this.headers = options.headers || {};
        if (!this.headers["Context-Type"]) {
            this.headers["Context-Type"] = "application/x-www-form-urlencoded"
        }
        if (this.headers["Context-Type"] === "application/json") {
            this.bodyText = JSON.stringify(this.body)
        } else if (this.headers["Context-Type"] === "application/x-www-form-urlencoded") {
            this.bodyText = Object.keys(this.body).map(key =>`${key}=${encodeURIComponent(this.body[key]).join('&')}`)
        }
        this.headers["Context-length"] = this.bodyText.length


    }
    send(connection) {
        return new Promise((resolve, rejcet)=>{
            const parser = new ResponseParser
            if (connection) {
                connection.write(this.toString());

            } else {
                connection = net.createConnection({
                    host:this.host,
                    port:this.port,
                }, ()=>{
                    connection.write(this.toString());
                })
            }
            connection.on('data', (data)=>{
                console.log(data.toString())
                parser.receive(data.toString())
                if (parser.isFinished) {
                    resolve(parser.response)
                    connection.end()
                }
            })
            connection.on('error', (err)=>{
                rejcet(err)      
                connection.end()      
            })

            // resolve("")
        })
    }

    // 请求格式拼接
    toString() {
        return `${this.method} ${this.path} HTTP/1.1\r
        ${Object.keys(this.headers).map(key=>`${key}:${this.headers[key]}`).join(`\r\n`)}\r
        \r
        ${this.bodyText}`
    }
}
class ResponseParser {
    construct() {

    }
    receive(string) {
        for (let i=0; i < string.length; i++) {
            this.receiveChar(string.charAt(i))
        }
        
    }
    // 状态机代码
    receiveChar(char) {

    }
}
void async function () {
    let request = new Request({
        methods: 'POST',
        host: '127.0.0.1',
        port: '8080',
        path: '/',
        headers: {
            ['X-Foo2']:'costomed',

        },
        body: {
            name: 'winter',
        }
    })
    let response = await request.send();
    console.log(response)
}

