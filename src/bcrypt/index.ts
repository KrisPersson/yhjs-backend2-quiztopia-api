import bcrypt from 'bcryptjs'

const saltRounds = 10

export async function comparePassword(plainTextPassword: string, hashInDb: string) {
    const match = await bcrypt.compare(plainTextPassword, hashInDb)
    return match ? true : false
}

export async function encryptPassword(plainTextPassword: string) {
    return await bcrypt.hash(plainTextPassword, saltRounds)
}
