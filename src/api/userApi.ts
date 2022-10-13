import { Person } from '@/server/entity/User'
import http from '@/utils/axios'


export const getUsers = (): Promise<Person[]> => {
  return new Promise((resolve, reject) => {
    http.get('/users').then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  }) 
}

export const updateUser = (user: any) => {
  return new Promise((resolve, reject) => {
    http.post('/user/update', user)
    .then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}