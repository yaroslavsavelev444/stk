export const BreadcrumbJsonLd = ({ siteUrl }: { siteUrl: string }) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Главная',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Контакты',
        item: `${siteUrl}/contacts`,
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}