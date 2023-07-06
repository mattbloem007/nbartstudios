const https = require("https")

exports.handler = async function(event, context) {
  // your server-side functionality
  const req = https
    .request(event, res => {
      let data = ""
      res.on("data", chunk => {
        data += chunk
      })

      res.on("end", () => {
        console.log(JSON.parse(data))
      })
    })
    .on("error", error => {
      console.error(error)
    })
  console.log(event.body)
  req.write(event.body)
  req.end()
}
