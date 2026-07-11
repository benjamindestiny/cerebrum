import { useState, useEffect } from 'react'
import { db } from '../firebase'

export function useUserData(userId) {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return

    const unsubscribe = db.collection('users')
      .doc(userId)
      .onSnapshot((doc) => {
        if (doc.exists) {
          setUserData(doc.data())
        }
        setLoading(false)
      })

    return () => unsubscribe()
  }, [userId])

  return { userData, loading }
}