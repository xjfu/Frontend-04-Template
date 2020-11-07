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
    send() {
        return new Promise((resolve, rejcet)=>{
            const parse = new ResponseParser
            resolve("")
        })
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

