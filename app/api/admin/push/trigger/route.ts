import { NextResponse } from 'next/server'
import { checkAdmin } from '@/lib/admin-auth'
import { getActiveSubscriptions } from '@/lib/pwa'
import { sendPushNotification } from '@/lib/pwa/notification'
import { sendTelegramAlert } from '@/lib/telegram'
import type { NotificationPayload } from '@/types/pwa'

export async function POST(request: Request) {
  const authError = await checkAdmin()
  if (authError) return authError

  try {
    const body: NotificationPayload = await request.json()

    if (!body.title || !body.body) {
      return NextResponse.json(
        { error: 'Title and body are required' },
        { status: 400 }
      )
    }

    // Send Telegram as well
    await sendTelegramAlert({ name: 'Admin', form_type: 'Broadcast', message: `${body.title}: ${body.body}` } as Record<string, unknown>)

    const subscriptions = await getActiveSubscriptions('admin')

    if (subscriptions.length === 0) {
      return NextResponse.json({ telegram: true, sent: 0, total: 0 })
    }

    const result = await sendPushNotification(subscriptions, body)

    return NextResponse.json({ telegram: true, sent: result.success, total: subscriptions.length })
  } catch (error) {
    console.error('Failed to send admin push notification:', error)
    return NextResponse.json(
      { error: 'Failed to send notifications' },
      { status: 500 }
    )
  }
}
