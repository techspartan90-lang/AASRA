declare module 'next' {
  export interface Metadata {
    title?: string;
    description?: string;
    [key: string]: any;
  }
  export interface NextConfig {
    [key: string]: any;
  }
}

declare module 'next/server' {
  export class NextRequest extends Request {
    nextUrl: URL;
    cookies: any;
    ip?: string;
    geo?: any;
    [key: string]: any;
  }
  export class NextResponse extends Response {
    static json(body: any, init?: ResponseInit): NextResponse;
    static redirect(url: string | URL, status?: number): NextResponse;
    static next(init?: any): NextResponse;
    [key: string]: any;
  }
}

declare module 'next/link' {
  import React from 'react';
  const Link: React.ComponentType<any>;
  export default Link;
}

declare module 'next/types.js' {
  export type Route = any;
  export type PageProps = any;
  export type ResolvingMetadata = any;
  export type ResolvingViewport = any;
}

declare module 'next/server.js' {
  export * from 'next/server';
}
