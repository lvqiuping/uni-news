import request from '@/util/http.js'
// export function login(data){
// 	url: '',
// 	method: 'post',
// 	data: data
// }
function login(url, data, loading) {
	return request(url, 'post', data, loading);
}