iso-osi七层网络模型


http
tcp
internet
4G/5G/wifi

// http 请求总结
设计一个请求类
content type 
body kv格式 不同类型有不用的影响

// send 总结
requst 收集信息
设计一个send发送信息到服务器
send是一个异步的，返回一个promise
request 格式
"POST / HTTP/1.1"
....

response 格式

http/1.1 200 OK // 协议，状态码
Context-Type: text/html //
Date:
connection:
Transfer-Encoding:chunked
// 空行

// body
// 十六进制数字
26
// body
<html></html>
//结尾0
0

responseParser 总结
response是分段构造，所以用responseParser来装配
responseParser 分段处理responseText 用状态机来分析文本结构。


bodyparser总结
response的body可能和context-type有不同的结构，因此会采用子结构parser的结构来解决问题
以trunkBodyParser为例，用状态机来处理body格式。