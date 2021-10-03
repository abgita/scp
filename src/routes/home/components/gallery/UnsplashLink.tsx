import React from 'react'

interface UnsplashLinkProps {
  url: string
  text: string
}

export function UnsplashLink ({ url, text }: UnsplashLinkProps): JSX.Element {
  const utmParams = '?utm_source=SCP&utm_medium=referral'

  return <a href={url + utmParams} target='_blank' rel='noreferrer'>{text}</a>
}
