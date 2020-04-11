import axios from 'axios'
export const shopApi = (data) => axios.get('/api/common/store/options', data)
