/*
 * @Author: wangwendie
 * @Date: 2023-06-14 14:45:27
 * @LastEditors: wangwendie
 * @Description: config-lite的配置文件
 */
module.exports = {
	port: parseInt(process.env.PORT, 10) || 8002,
	url: 'mongodb://localhost:27017/elm',
	session: {
		name: '1621151730',
		secret: '123456',
		cookie: {
			httpOnly: true,
	    secure: false,
	    maxAge: 365 * 24 * 60 * 60 * 1000,
		}
	}
}