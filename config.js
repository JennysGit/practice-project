
module.exports = {
  get API_HOST_TENANT () {
   return process.env.END_POINT || 'http://129.1.66.66:8088/iotmanagementportal'
  },

  get cdn () {
    return '//static.eastsoft.com.cn'
  }
}
