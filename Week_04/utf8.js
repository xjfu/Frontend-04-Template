    var log = console.log.bind(console)
    
    function UTF8_Encoding(s) {
        // let B = new Buffer()
        // var bytes = new Buffer(256);
        let buf = []
        for (let i = 0; i < s.length; i++) {
            // s[i].codePointAt(0)
             buf.push(s[i])   
        }
        return new Buffer(buf)
    }
    let a = UTF8_Encoding("abab一")
