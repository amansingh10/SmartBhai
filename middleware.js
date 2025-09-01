import { NextResponse } from 'next/server'
 
export function middleware(request) {
  return NextResponse.redirect(new URL('/chat/flight', request.url))
}
 
export const config = {
  matcher: '/',
}