import React from 'react';

interface Props {
  schema: Record<string, any>;
}

export default function ArticleSchemaInjector({ schema }: Props) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
