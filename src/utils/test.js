const axios = require('axios');

const handQueue = (
  reqs // 请求总数
) => {
  reqs = reqs || []
  const requestQueue = (concurrency) => {
    concurrency = concurrency || 6 // 最大并发数
    const queue = [] // 请求池
    let current = 0
    const dequeue = () => {
      while (current < concurrency && queue.length) {
        current++;
        const requestPromiseFactory = queue.shift() // 出列
        requestPromiseFactory()
          .then(() => { // 成功的请求逻辑
          })
          .catch(error => { // 失败
            console.log(error)
          })
          .finally(() => {
            current--
            dequeue()
          });
      }
    }
    return (requestPromiseFactory) => {
      queue.push(requestPromiseFactory) // 入队
      console.log("🚀 ~ return ~ queue:", queue)
      // dequeue()
    }


  }
  const enqueue = requestQueue(6)
  for (let i = 0; i < reqs.length; i++) {
    enqueue(function () { return axios.get('/api/test' + i) })
  }
}
handQueue([1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 4, 32, 1, 34, 6, 54, 4234, 3, 123, 5, 34, 545, 6])
