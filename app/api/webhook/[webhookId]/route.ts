import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

import prismadb from '@/lib/prismadb'

export async function GET(
  req: Request,
  { params }: { params: { orderId: string } },
) {
  try {
    if (!params.orderId) {
      return new NextResponse('Missing orderId', { status: 400 })
    }

    const order = await prismadb.order.findUnique({
      where: {
        id: params.orderId,
      },
    })

    return new NextResponse(JSON.stringify(order), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.log('[ORDER_GET]', error)

    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; orderId: string } },
) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse('Unauthorized delete orders userId', { status: 401 })
    }

    if (!params.orderId) {
      return new NextResponse('Missing orderId', { status: 400 })
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    })

    if (!storeByUserId) {
      return new NextResponse('Unauthorized delete orders storeByUserId', { status: 403 })
    }

    const order = await prismadb.order.deleteMany({
      where: {
        id: params.orderId,
      },
    })

    return new NextResponse(JSON.stringify(order), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.log('[ORDER_DELETE]', error)

    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
