/*eslint import/no-unresolved: [2, { ignore: ['^k6.*'] }]*/
import http from 'k6/http'
import { check, sleep } from 'k6'

export const options = {
  vus: 10, // number of virtual users
  duration: '15s' // test duration
}

export default function () {
  const res = http.get('http://pm2-cluster:3000/api')
  console.log(res.status + ' : ' + res.body)
  check(res, {
    'status is 200': (r) => r.status === 200
  })
  sleep(1)
}
