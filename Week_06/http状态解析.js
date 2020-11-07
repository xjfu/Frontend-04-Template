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

