const get = require('./lib/fetch')
const format = require('./lib/format')
const { setConfigFile, setProxyConfigFile, setRestUrlFile } = require('./lib/set_file')

module.exports = async function(url, needTags) {
  const baseUrl = `${url}/swagger-resources`
  try {
    const { body } = await get(baseUrl)
    const location = `${url}/${body[0].location}`
    const res = await get(location)
    const apiData = format(res.body, needTags)
    setConfigFile(apiData)
    // setProxyConfigFile(apiData)
    setRestUrlFile(apiData)
  } catch (error) {
    throw error
  }
}