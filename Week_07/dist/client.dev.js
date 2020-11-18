"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var net = require("net");

var log = console.log.bind(console);

var parser = require('./parser');

var Request =
/*#__PURE__*/
function () {
  function Request(options) {
    var _this = this;

    _classCallCheck(this, Request);

    this.method = options.method || "GET";
    this.host = options.host;
    this.port = options.port || 80;
    this.body = options.body || {};
    this.path = options.path || "/";
    this.headers = options.headers || {};

    if (!this.headers["Content-Type"]) {
      this.headers["Content-Type"] = "application/x-www-form-urlencoded";
    }

    if (this.headers["Content-Type"] === "application/json") {
      this.bodyText = JSON.stringify(this.body);
    } else if (this.headers["Content-Type"] === "application/x-www-form-urlencoded") {
      // body 是 
      // body: {
      //     name: "winter",
      // } -> name=winter&...
      this.bodyText = Object.keys(this.body).map(function (key) {
        return "".concat(key, "=").concat(encodeURIComponent(_this.body[key]));
      }).join("&");
    }

    this.headers["Content-Length"] = this.bodyText.length;
  }

  _createClass(Request, [{
    key: "send",
    value: function send(connection) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        var parser = new ResponseParser(); // resolve("hah")
        // 有连接 直接写入数据

        if (connection) {
          connection.write(_this2.toString());
        } else {
          // 无连接创建TCP连接，异步写入数据
          connection = net.createConnection({
            host: _this2.host,
            port: _this2.port
          }, function () {
            connection.write(_this2.toString());
          });
        }

        connection.on("data", function (data) {
          // log('resdat', data)
          // resolve(data.toString())
          parser.receive(data.toString());

          if (parser.isFinished) {
            resolve(parser.response);
            connection.end();
          }
        });
        connection.on("error", function (err) {
          reject(err);
          connection.end();
        }); // resolve("")
      });
    } // 请求格式拼接

  }, {
    key: "toString",
    value: function toString() {
      var _this3 = this;

      // 请求格式
      return "".concat(this.method, " ").concat(this.path, " HTTP/1.1\r\n").concat(Object.keys(this.headers).map(function (key) {
        return "".concat(key, ":").concat(_this3.headers[key]);
      }).join("\r\n"), "\r\n\r\n").concat(this.bodyText);
    }
  }]);

  return Request;
}();

var TrunkedBodyParser =
/*#__PURE__*/
function () {
  function TrunkedBodyParser() {
    _classCallCheck(this, TrunkedBodyParser);

    this.WAITING_LENGTH = 0;
    this.WAITING_LENGTH_LINE_END = 1;
    this.READING_TRUNK = 2;
    this.WAITING_NEW_LINE = 3;
    this.WAITING_NEW_LINE_END = 4;
    this.length = 0;
    this.content = [];
    this.isFinished = false;
    this.current = this.WAITING_LENGTH;
  } // 状态机代码


  _createClass(TrunkedBodyParser, [{
    key: "receiveChar",
    value: function receiveChar(_char) {
      if (this.current == this.WAITING_LENGTH) {
        if (_char === '\r') {
          if (this.length === 0) {
            this.isFinished = true;
          }

          this.current = this.WAITING_LENGTH_LINE_END;
        } else {
          this.length *= 16;
          this.length += parseInt(_char, 16);
        }
      } else if (this.current === this.WAITING_LENGTH_LINE_END) {
        if (_char === '\n') {
          this.current = this.READING_TRUNK;
        }
      } else if (this.current === this.READING_TRUNK) {
        this.content.push(_char);
        this.length--;

        if (this.length === 0) {
          this.current = this.WAITING_NEW_LINE;
        }
      } else if (this.current === this.WAITING_NEW_LINE) {
        if (_char === '\r') {
          this.current = this.WAITING_NEW_LINE_END;
        }
      } else if (this.current === this.WAITING_NEW_LINE_END) {
        if (_char === '\n') {
          this.current = this.WAITING_LENGTH;
        }
      }
    }
  }]);

  return TrunkedBodyParser;
}();

var ResponseParser =
/*#__PURE__*/
function () {
  function ResponseParser() {
    _classCallCheck(this, ResponseParser);

    // 以 \r\n结束
    this.WAITING_STATUS_LINE = 0;
    this.WAITING_STATUS_LINE_END = 1;
    this.WAITING_HEADER_NAME = 2;
    this.WAITING_HEADER_SPACE = 3; // 等待冒号

    this.WAITING_HEADER_VALUE = 4;
    this.WAITING_HEADER_LINE_END = 5;
    this.WAITING_HEADER_BLOCK_END = 6;
    this.WAITING_BODY = 7;
    this.current = this.WAITING_STATUS_LINE;
    this.statusLine = "";
    this.headers = {};
    this.headerName = "";
    this.headerValue = "";
    this.bodyParse = null;
  }

  _createClass(ResponseParser, [{
    key: "receive",
    value: function receive(string) {
      for (var i = 0; i < string.length; i++) {
        this.receiveChar(string.charAt(i));
      }
    } // 状态机代码

  }, {
    key: "receiveChar",
    value: function receiveChar(_char2) {
      if (this.current == this.WAITING_STATUS_LINE) {
        if (_char2 === '\r') {
          this.current = this.WAITING_STATUS_LINE_END;
        } else {
          this.statusLine += _char2;
        }
      } else if (this.current === this.WAITING_STATUS_LINE_END) {
        if (_char2 === '\n') {
          this.current = this.WAITING_HEADER_NAME;
        }
      } else if (this.current === this.WAITING_HEADER_NAME) {
        if (_char2 === ':') {
          this.current = this.WAITING_HEADER_SPACE;
        } else if (_char2 === '\r') {
          this.current = this.WAITING_HEADER_BLOCK_END;

          if (this.headers['Transfer-Encoding'] === 'chunked') {
            this.bodyParse = new TrunkedBodyParser();
          }
        } else {
          this.headerName += _char2;
        }
      } else if (this.current === this.WAITING_HEADER_SPACE) {
        if (_char2 === ' ') {
          this.current = this.WAITING_HEADER_VALUE;
        }
      } else if (this.current === this.WAITING_HEADER_VALUE) {
        if (_char2 === '\r') {
          this.current = this.WAITING_HEADER_LINE_END;
          this.headers[this.headerName] = this.headerValue;
          this.headerValue = "";
          this.headerName = "";
        } else {
          this.headerValue += _char2;
        }
      } else if (this.current === this.WAITING_HEADER_LINE_END) {
        if (_char2 === '\n') {
          this.current = this.WAITING_HEADER_NAME;
        }
      } else if (this.current === this.WAITING_HEADER_BLOCK_END) {
        if (_char2 === '\n') {
          this.current = this.WAITING_BODY;
        } // this.bodyText += char

      } else if (this.current === this.WAITING_BODY) {
        this.bodyParse.receiveChar(_char2);
      }
    }
  }, {
    key: "isFinished",
    get: function get() {
      return this.bodyParse && this.bodyParse.isFinished;
    }
  }, {
    key: "response",
    get: function get() {
      this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/);
      return {
        statusCode: RegExp.$1,
        statusText: RegExp.$2,
        headers: this.headers,
        body: this.bodyParse.content.join('')
      };
    }
  }]);

  return ResponseParser;
}();

void function _callee() {
  var request, response, dom;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          request = new Request({
            method: "POST",
            host: "127.0.0.1",
            port: "8088",
            path: "/",
            headers: _defineProperty({}, "X-Foo2", "costomed"),
            body: {
              name: "winter"
            }
          });
          _context.next = 3;
          return regeneratorRuntime.awrap(request.send());

        case 3:
          response = _context.sent;
          dom = parser.parserHTML(response.body);
          console.log('response', dom);

        case 6:
        case "end":
          return _context.stop();
      }
    }
  });
}();