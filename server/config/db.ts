import mongoose from 'mongoose'

export const db = (db: string) => mongoose.connect(db)

mongoose.connection
  .on('open', () => console.log('DATABASE STATE', 'Connection Open'))
  .on('close', () => console.log('DATABASE STATE', 'Connection Closed'))
  .on('error', error => console.log('DATABASE STATE', error))
