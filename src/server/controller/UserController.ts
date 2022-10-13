import UserMapperImpl from './../mapper/UserMapper'
import express, { Router } from "express"
const router: Router = express.Router()
const userMapperImpl = new UserMapperImpl()
router.get('/users', (req, res) => {
  try {
    const users = userMapperImpl.findUsers()
    return res.json({
      code: 200,
      data: users,
    })
  } catch (e) {
    return res.json({
      code: 500,
      message: 'Server Error!'
    })
  }
})

export default router